#!/usr/bin/env node
/**
 * SessionStart Hook — 前回のセッション要約を読み込んでコンテキストに注入
 */
const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(__dirname, '..', 'sessions');

function main() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }

  // 最新のセッションファイルを検索（7日以内）
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  let latest = null;

  try {
    const files = fs.readdirSync(SESSIONS_DIR)
      .filter(f => f.endsWith('-session.md'))
      .map(f => {
        const stat = fs.statSync(path.join(SESSIONS_DIR, f));
        return { name: f, path: path.join(SESSIONS_DIR, f), mtime: stat.mtimeMs };
      })
      .filter(f => (now - f.mtime) < maxAge)
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length > 0) latest = files[0];
  } catch (e) {
    // ignore
  }

  const parts = [];

  if (latest) {
    const content = fs.readFileSync(latest.path, 'utf8').trim();
    if (content && !content.includes('[セッション内容なし]')) {
      parts.push(`前回のセッション要約（${latest.name}）:\n${content}`);
    }
  }

  // git status も付加
  try {
    const { execSync } = require('child_process');
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const status = execSync('git status --short', { encoding: 'utf8' }).trim();
    parts.push(`現在のブランチ: ${branch}`);
    if (status) {
      parts.push(`未コミットの変更:\n${status}`);
    }
  } catch (e) {
    // git not available
  }

  const payload = JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: parts.join('\n\n') || 'セッション履歴なし — 新規セッション'
    }
  });

  process.stdout.write(payload);
}

main();
