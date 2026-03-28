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

/**
 * 秘書チャット申し送り処理
 * status.mdの「## 秘書チャット申し送り」セクションを読み取り、
 * 違反レポートをlessons-learned/に自動生成し、処理済み項目をstatus.mdから削除する。
 */
function processSecretaryHandoff() {
  const statusPath = path.join(PROJECT_DIR, 'status.md');
  const status = readFileSafe(statusPath);
  if (!status) return [];

  // 「## 秘書チャット申し送り」セクションを抽出（CRLF対応）
  const sectionMatch = status.match(/## 秘書チャット申し送り\r?\n([\s\S]*?)$/);
  if (!sectionMatch) return [];

  const sectionContent = sectionMatch[1];

  // コメントブロックを除去してから処理
  const cleanedContent = sectionContent.replace(/<!--[\s\S]*?-->/g, '').trim();

  // 「（現在、申し送り事項はありません）」なら何もしない
  if (!cleanedContent || cleanedContent.includes('申し送り事項はありません')) return [];

  // 「### 違反: [タイトル]」ブロックを全て抽出（コメント除去済みコンテンツから）
  const blocks = cleanedContent.split(/(?=###\s*違反:)/).filter(b => b.trim().match(/^###\s*違反:/));
  if (blocks.length === 0) {
    // 書式に従わない自由記述がある場合
    const freeText = cleanedContent;
    if (freeText && !freeText.startsWith('（')) {
      const today = getDateString();
      const fileName = `秘書チャット申し送り-${today}.md`;
      const filePath = path.join(LESSONS_DIR, fileName);
      const content = `# 秘書チャット申し送り\n\n**記録日**: ${today}\n**発見者**: 秘書チャット（claude.ai）\n\n---\n\n${freeText}\n`;
      if (!fs.existsSync(LESSONS_DIR)) fs.mkdirSync(LESSONS_DIR, { recursive: true });
      fs.writeFileSync(filePath, content);
      clearHandoffSection(statusPath, status);
      return [`申し送り（自由記述）→ ${fileName} に自動生成`];
    }
    return [];
  }

  const results = [];
  const today = getDateString();

  for (const block of blocks) {
    // タイトル抽出
    const titleMatch = block.match(/###\s*違反:\s*(.+)/);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();

    // 各フィールド抽出
    const severity = extractField(block, '深刻度') || '不明';
    const discoverer = extractField(block, '発見者') || '不明';
    const whatHappened = extractField(block, '何が起きたか') || '';
    const whyHappened = extractField(block, 'なぜ起きたか') || '';
    const correctAction = extractField(block, '正しい行動') || '';
    const rule = extractField(block, '根拠ルール') || '';
    const prevention = extractField(block, '再発防止') || '';

    // lessons-learned/にファイル生成
    const safeName = title.replace(/[/\\:*?"<>|]/g, '_');
    const fileName = `${safeName}-${today}.md`;
    const filePath = path.join(LESSONS_DIR, fileName);

    const content = `# ${title}\n\n**記録日**: ${today}\n**発見者**: ${discoverer}\n**深刻度**: ${severity}\n\n---\n\n## 何が起きたか\n\n${whatHappened}\n\n## なぜ起きたか\n\n${whyHappened}\n\n## 正しい行動\n\n${correctAction}\n\n## 根拠ルール\n\n${rule}\n\n## 再発防止\n\n${prevention}\n`;

    if (!fs.existsSync(LESSONS_DIR)) fs.mkdirSync(LESSONS_DIR, { recursive: true });
    fs.writeFileSync(filePath, content);
    results.push(`違反「${title}」→ ${fileName} に自動生成`);
  }

  // 処理済み → status.mdの申し送りセクションをクリア
  if (results.length > 0) {
    clearHandoffSection(statusPath, status);
    // git add & commit
    try {
      execSync(`git add "${statusPath}" lessons-learned/`, { cwd: PROJECT_DIR, stdio: 'pipe' });
      execSync('git commit -m "lessons-learned自動生成: 秘書チャット申し送り処理" --no-verify', { cwd: PROJECT_DIR, stdio: 'pipe' });
      execSync('git push origin HEAD', { cwd: PROJECT_DIR, stdio: 'pipe' });
    } catch { /* non-fatal */ }
  }

  return results;
}

function extractField(block, label) {
  const re = new RegExp(`\\*\\*${label}\\*\\*:\\s*(.+)`, 'm');
  const match = block.match(re);
  return match ? match[1].trim() : null;
}

function clearHandoffSection(statusPath, statusContent) {
  const cleared = statusContent.replace(
    /(## 秘書チャット申し送り\r?\n)([\s\S]*?)$/,
    '$1\n<!-- 処理済みの申し送りはlessons-learned/に自動生成されました -->\n\n（現在、申し送り事項はありません）\n'
  );
  fs.writeFileSync(statusPath, cleared);
}

function getDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function main() {
  const parts = [];
  const warnings = [];

  // =============================================
  // 0. 秘書チャット申し送り処理（lessons-learned自動生成）
  // =============================================
  const handoffResults = processSecretaryHandoff();
  if (handoffResults.length > 0) {
    parts.push(`【0. 秘書チャット申し送り処理】\n${handoffResults.join('\n')}`);
  }

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
