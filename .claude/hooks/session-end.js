#!/usr/bin/env node
/**
 * SessionEnd Hook — セッション要約を自動保存
 *
 * トランスクリプトからユーザーメッセージ・使用ツール・編集ファイルを抽出し
 * .claude/sessions/ に要約ファイルを保存する
 */
const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(__dirname, '..', 'sessions');
const MAX_STDIN = 1024 * 1024;

let stdinData = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  if (stdinData.length < MAX_STDIN) stdinData += chunk.substring(0, MAX_STDIN - stdinData.length);
});
process.stdin.on('end', () => main());

function getDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function extractSummary(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;

  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.split('\n').filter(Boolean);

  const userMessages = [];
  const toolsUsed = new Set();
  const filesModified = new Set();

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      // ユーザーメッセージ収集
      if (entry.type === 'user' || entry.role === 'user' || entry.message?.role === 'user') {
        const raw = entry.message?.content ?? entry.content;
        const text = typeof raw === 'string' ? raw
          : Array.isArray(raw) ? raw.map(c => c?.text || '').join(' ') : '';
        const cleaned = text.replace(/\x1b\[[0-9;]*m/g, '').trim();
        if (cleaned) userMessages.push(cleaned.slice(0, 200));
      }

      // ツール使用・ファイル編集
      if (entry.type === 'tool_use' || entry.tool_name) {
        const name = entry.tool_name || entry.name || '';
        if (name) toolsUsed.add(name);
        const fp = entry.tool_input?.file_path || entry.input?.file_path || '';
        if (fp && (name === 'Edit' || name === 'Write')) filesModified.add(fp);
      }

      // アシスタントメッセージ内のツール使用
      if (entry.type === 'assistant' && Array.isArray(entry.message?.content)) {
        for (const block of entry.message.content) {
          if (block.type === 'tool_use') {
            if (block.name) toolsUsed.add(block.name);
            const fp = block.input?.file_path || '';
            if (fp && (block.name === 'Edit' || block.name === 'Write')) filesModified.add(fp);
          }
        }
      }
    } catch { /* skip */ }
  }

  if (userMessages.length === 0) return null;

  return {
    userMessages: userMessages.slice(-10),
    toolsUsed: Array.from(toolsUsed).slice(0, 20),
    filesModified: Array.from(filesModified).slice(0, 30),
    totalMessages: userMessages.length
  };
}

function main() {
  let transcriptPath = null;
  try {
    const input = JSON.parse(stdinData);
    transcriptPath = input.transcript_path;
  } catch {
    transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
  }

  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }

  const today = getDateString();
  const time = getTimeString();
  let branch = 'unknown';
  try {
    const { execSync } = require('child_process');
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch { /* ignore */ }

  const projectName = path.basename(path.resolve(__dirname, '..', '..'));
  const sessionFile = path.join(SESSIONS_DIR, `${today}-session.md`);
  const summary = extractSummary(transcriptPath);

  let content = `# セッション: ${today}\n`;
  content += `**日時:** ${today} ${time}\n`;
  content += `**プロジェクト:** ${projectName}\n`;
  content += `**ブランチ:** ${branch}\n\n---\n\n`;

  if (summary) {
    content += `## タスク\n`;
    for (const msg of summary.userMessages) {
      content += `- ${msg.replace(/\n/g, ' ')}\n`;
    }
    content += '\n';

    if (summary.filesModified.length > 0) {
      content += `## 編集ファイル\n`;
      for (const f of summary.filesModified) {
        content += `- ${f}\n`;
      }
      content += '\n';
    }

    if (summary.toolsUsed.length > 0) {
      content += `## 使用ツール\n${summary.toolsUsed.join(', ')}\n\n`;
    }

    content += `## 統計\n- ユーザーメッセージ数: ${summary.totalMessages}\n`;
  } else {
    content += `## 要約\n[トランスクリプトから抽出できませんでした]\n`;
  }

  // 既存ファイルがあれば追記、なければ新規作成
  if (fs.existsSync(sessionFile)) {
    fs.appendFileSync(sessionFile, `\n\n---\n\n## 更新: ${time}\n${summary ? `メッセージ数: ${summary.totalMessages}` : '(更新なし)'}\n`);
  } else {
    fs.writeFileSync(sessionFile, content);
  }

  process.exit(0);
}
