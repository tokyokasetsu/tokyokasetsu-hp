#!/usr/bin/env node
/**
 * SessionStart Hook — 08-surveillance.md 項目22・26 完全対応
 *
 * 読み込み順序（項目22）:
 *   1. 監視md（最優先・私の行動規範）
 *   2. secretary/（全体方針・意思決定履歴）
 *   3. 該当プロジェクトの個別md
 *   4. 該当プロジェクトのチャット履歴
 *   5. lessons-learned/（毎回全件・ファイルが増えたらタイトル先読み方式）
 *   6. status.md
 *   7. urls.md
 *   8. reports/（必要時のみ・同種のバグ発生時に自動読み込み）
 *
 * 読み込み失敗時（項目26）:
 *   - ファイルなし → 正常・初回として続行
 *   - ファイル破損 → 直前のgitコミットから復元を試みる → 復元できない場合は新規作成して続行 → 仁さんに報告
 *   - 監視md読み込み失敗 → 作業を止めて仁さんに報告
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const CLAUDE_DIR = path.join(PROJECT_DIR, '.claude');
const SESSIONS_DIR = path.join(CLAUDE_DIR, 'sessions');
const LESSONS_DIR = path.join(PROJECT_DIR, 'lessons-learned');
const REPORTS_DIR = path.join(PROJECT_DIR, 'reports');
const SECRETARY_DIR = path.join(CLAUDE_DIR, 'secretary');

function readFileSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').trim();
    }
  } catch (e) {
    // ファイル破損 → gitから復元を試みる
    try {
      execSync(`git checkout HEAD -- "${filePath}"`, { cwd: PROJECT_DIR, encoding: 'utf8' });
      return fs.readFileSync(filePath, 'utf8').trim();
    } catch {
      // 復元失敗
    }
  }
  return null;
}

function readDirFiles(dirPath, ext) {
  if (!fs.existsSync(dirPath)) return [];
  try {
    return fs.readdirSync(dirPath)
      .filter(f => f.endsWith(ext))
      .map(f => ({ name: f, path: path.join(dirPath, f) }));
  } catch { return []; }
}

function getRecentSessions(maxCount) {
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  try {
    return fs.readdirSync(SESSIONS_DIR)
      .filter(f => f.endsWith('-session.md'))
      .map(f => {
        const fp = path.join(SESSIONS_DIR, f);
        const stat = fs.statSync(fp);
        return { name: f, path: fp, mtime: stat.mtimeMs };
      })
      .filter(f => (now - f.mtime) < maxAge)
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, maxCount);
  } catch { return []; }
}

function main() {
  const parts = [];
  const warnings = [];

  // =============================================
  // 1. 監視md（最優先・私の行動規範）
  // =============================================
  const surveillancePath = path.join(CLAUDE_DIR, 'rules', '08-surveillance.md');
  const surveillance = readFileSafe(surveillancePath);
  if (surveillance) {
    parts.push(`【1. 監視md（行動規範）】\n読み込み済み: ${surveillancePath}`);
  } else {
    // 監視md読み込み失敗 → 作業を止めて仁さんに報告
    warnings.push('【重大警告】監視md（08-surveillance.md）の読み込みに失敗しました。作業を止めて仁さんに報告してください。');
  }

  // =============================================
  // 2. secretary/（全体方針・意思決定履歴）
  // =============================================
  const secretaryFiles = readDirFiles(SECRETARY_DIR, '.md');
  if (secretaryFiles.length > 0) {
    const titles = secretaryFiles.map(f => `  - ${f.name}`).join('\n');
    parts.push(`【2. secretary/（全体方針）】\n${secretaryFiles.length}件:\n${titles}`);
  } else {
    parts.push('【2. secretary/】ファイルなし（初回として続行）');
  }

  // =============================================
  // 3. 該当プロジェクトの個別md（rulesフォルダー）
  // =============================================
  const rulesDir = path.join(CLAUDE_DIR, 'rules');
  const ruleFiles = readDirFiles(rulesDir, '.md').filter(f => f.name !== '08-surveillance.md');
  if (ruleFiles.length > 0) {
    const titles = ruleFiles.map(f => `  - ${f.name}`).join('\n');
    parts.push(`【3. プロジェクト個別md】\n${ruleFiles.length}件:\n${titles}`);
  }

  // =============================================
  // 4. 該当プロジェクトのチャット履歴（projects/配下）
  // =============================================
  const projectsDir = path.join(CLAUDE_DIR, 'projects');
  const chatDirs = fs.existsSync(projectsDir)
    ? fs.readdirSync(projectsDir).filter(d => fs.statSync(path.join(projectsDir, d)).isDirectory())
    : [];
  if (chatDirs.length > 0) {
    parts.push(`【4. チャット履歴】\nプロジェクト: ${chatDirs.join(', ')}`);
  } else {
    parts.push('【4. チャット履歴】なし（初回として続行）');
  }

  // =============================================
  // 5. lessons-learned/（毎回全件・タイトル先読み方式）
  // =============================================
  const lessonFiles = readDirFiles(LESSONS_DIR, '.md').filter(f => f.name !== '.gitkeep');
  if (lessonFiles.length > 0) {
    if (lessonFiles.length <= 20) {
      // 20件以下：全件の内容を読み込む
      const lessonsContent = lessonFiles.map(f => {
        const content = readFileSafe(f.path);
        return `### ${f.name}\n${content || '（読み込み失敗）'}`;
      }).join('\n\n');
      parts.push(`【5. lessons-learned/（全${lessonFiles.length}件）】\n${lessonsContent}`);
    } else {
      // 20件超：タイトル先読み方式
      const titles = lessonFiles.map(f => `  - ${f.name}`).join('\n');
      parts.push(`【5. lessons-learned/（${lessonFiles.length}件・タイトル一覧）】\n${titles}\n\n詳細が必要な場合は個別ファイルを読み込んでください。`);
    }
  } else {
    parts.push('【5. lessons-learned/】ファイルなし（初回として続行）');
  }

  // =============================================
  // 6. status.md
  // =============================================
  const statusPath = path.join(PROJECT_DIR, 'status.md');
  const status = readFileSafe(statusPath);
  if (status) {
    parts.push(`【6. status.md】\n${status.slice(0, 2000)}${status.length > 2000 ? '\n...（以下省略・詳細はstatus.mdを直接参照）' : ''}`);
  } else {
    parts.push('【6. status.md】ファイルなし');
  }

  // =============================================
  // 7. urls.md
  // =============================================
  const urlsPath = path.join(PROJECT_DIR, 'urls.md');
  const urls = readFileSafe(urlsPath);
  if (urls) {
    parts.push(`【7. urls.md】\n${urls}`);
  } else {
    parts.push('【7. urls.md】ファイルなし');
  }

  // =============================================
  // 8. reports/（必要時のみ・タイトル一覧）
  // =============================================
  const reportFiles = readDirFiles(REPORTS_DIR, '.md');
  if (reportFiles.length > 0) {
    const titles = reportFiles.map(f => `  - ${f.name}`).join('\n');
    parts.push(`【8. reports/（${reportFiles.length}件・必要時に読み込み）】\n${titles}`);
  } else {
    parts.push('【8. reports/】ファイルなし');
  }

  // =============================================
  // sessions/（直近1〜3件の引き継ぎメモ）
  // =============================================
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
  const recentSessions = getRecentSessions(3);
  if (recentSessions.length > 0) {
    const sessionContents = recentSessions.map(s => {
      const content = readFileSafe(s.path);
      return `### ${s.name}\n${content || '（読み込み失敗）'}`;
    }).join('\n\n');
    parts.push(`【sessions/（直近${recentSessions.length}件）】\n${sessionContents}`);
  }

  // =============================================
  // git status
  // =============================================
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: PROJECT_DIR, encoding: 'utf8' }).trim();
    const gitStatus = execSync('git status --short', { cwd: PROJECT_DIR, encoding: 'utf8' }).trim();
    parts.push(`【git状態】\nブランチ: ${branch}${gitStatus ? `\n未コミットの変更:\n${gitStatus}` : '\nワーキングツリーはクリーン'}`);
  } catch { /* ignore */ }

  // =============================================
  // 警告があれば先頭に追加
  // =============================================
  if (warnings.length > 0) {
    parts.unshift(warnings.join('\n'));
  }

  const payload = JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: parts.join('\n\n---\n\n') || 'セッション履歴なし — 新規セッション'
    }
  });

  process.stdout.write(payload);
}

main();
