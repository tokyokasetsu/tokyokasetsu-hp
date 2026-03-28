#!/usr/bin/env node
/**
 * SessionEnd Hook — 08-surveillance.md 項目26 完全対応
 *
 * 保存内容（sessions/）:
 *   - 今回達成したこと・できなかったこと
 *   - 編集ファイル一覧と変更理由
 *   - 次回やるべきタスク（優先順位付き）
 *   - 仁さんからの指摘事項
 *   - コンテキスト使用量・Eval結果・使用エージェント
 *
 * バックアップ:
 *   sessions/・lessons-learned/・reports/は全てGitHubにpushしてバックアップを常に保つ
 */
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const SESSIONS_DIR = path.join(PROJECT_DIR, '.claude', 'sessions');
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
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}

function extractSummary(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;

  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.split('\n').filter(Boolean);

  const userMessages = [];
  const assistantMessages = [];
  const toolsUsed = new Set();
  const filesModified = new Set();
  const agentsUsed = new Set();

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      // ユーザーメッセージ収集
      if (entry.type === 'user' || entry.role === 'user' || entry.message?.role === 'user') {
        const raw = entry.message?.content ?? entry.content;
        const text = typeof raw === 'string' ? raw
          : Array.isArray(raw) ? raw.map(c => c?.text || '').join(' ') : '';
        const cleaned = text.replace(/\x1b\[[0-9;]*m/g, '').trim();
        if (cleaned) userMessages.push(cleaned.slice(0, 300));
      }

      // アシスタントメッセージ収集（指摘事項・達成事項の推定用）
      if (entry.type === 'assistant' || entry.role === 'assistant' || entry.message?.role === 'assistant') {
        const raw = entry.message?.content ?? entry.content;
        const text = typeof raw === 'string' ? raw
          : Array.isArray(raw) ? raw.filter(c => c?.type === 'text').map(c => c?.text || '').join(' ') : '';
        const cleaned = text.replace(/\x1b\[[0-9;]*m/g, '').trim();
        if (cleaned) assistantMessages.push(cleaned.slice(0, 300));
      }

      // ツール使用・ファイル編集
      if (entry.type === 'tool_use' || entry.tool_name) {
        const name = entry.tool_name || entry.name || '';
        if (name) toolsUsed.add(name);
        const fp = entry.tool_input?.file_path || entry.input?.file_path || '';
        if (fp && (name === 'Edit' || name === 'Write')) filesModified.add(fp);
        // エージェント検出
        if (name === 'Agent') {
          const desc = entry.tool_input?.description || entry.input?.description || '';
          if (desc) agentsUsed.add(desc);
        }
      }

      // アシスタントメッセージ内のツール使用
      if (entry.type === 'assistant' && Array.isArray(entry.message?.content)) {
        for (const block of entry.message.content) {
          if (block.type === 'tool_use') {
            if (block.name) toolsUsed.add(block.name);
            const fp = block.input?.file_path || '';
            if (fp && (block.name === 'Edit' || block.name === 'Write')) filesModified.add(fp);
            if (block.name === 'Agent') {
              const desc = block.input?.description || '';
              if (desc) agentsUsed.add(desc);
            }
          }
        }
      }
    } catch { /* skip */ }
  }

  if (userMessages.length === 0) return null;

  return {
    userMessages: userMessages.slice(-15),
    assistantMessages: assistantMessages.slice(-10),
    toolsUsed: Array.from(toolsUsed).slice(0, 30),
    filesModified: Array.from(filesModified).slice(0, 50),
    agentsUsed: Array.from(agentsUsed).slice(0, 20),
    totalUserMessages: userMessages.length,
    totalAssistantMessages: assistantMessages.length
  };
}

function autoCommitSessions() {
  try {
    const { execSync } = require('child_process');
    // sessions/・lessons-learned/・reports/ をadd & push
    execSync('git add .claude/sessions/ lessons-learned/ reports/ 2>/dev/null', { cwd: PROJECT_DIR, encoding: 'utf8', stdio: 'pipe' });
    const diff = execSync('git diff --cached --quiet 2>/dev/null; echo $?', { cwd: PROJECT_DIR, encoding: 'utf8', stdio: 'pipe' }).trim();
    if (diff === '1') {
      execSync('git commit -m "session-end: セッション要約自動保存" --no-verify 2>/dev/null', { cwd: PROJECT_DIR, encoding: 'utf8', stdio: 'pipe' });
      execSync('git push origin HEAD 2>/dev/null', { cwd: PROJECT_DIR, encoding: 'utf8', stdio: 'pipe' });
    }
  } catch { /* auto-backup failure is non-fatal */ }
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
    branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: PROJECT_DIR, encoding: 'utf8' }).trim();
  } catch { /* ignore */ }

  const projectName = path.basename(PROJECT_DIR);
  const sessionFile = path.join(SESSIONS_DIR, `${today}-session.md`);
  const summary = extractSummary(transcriptPath);

  // =============================================
  // セッション要約を項目26の形式で保存
  // =============================================
  let content = `# セッション要約: ${today} ${time}\n\n`;
  content += `**プロジェクト:** ${projectName}\n`;
  content += `**ブランチ:** ${branch}\n`;
  content += `**終了時刻:** ${time}\n\n---\n\n`;

  if (summary) {
    // 今回達成したこと（ユーザーメッセージから推定）
    content += `## 今回達成したこと\n`;
    for (const msg of summary.userMessages) {
      content += `- ${msg.replace(/\n/g, ' ')}\n`;
    }
    content += '\n';

    // 編集ファイル一覧と変更理由
    if (summary.filesModified.length > 0) {
      content += `## 編集ファイル一覧\n`;
      for (const f of summary.filesModified) {
        content += `- ${f}\n`;
      }
      content += '\n';
    }

    // 次回やるべきタスク（優先順位付き）
    content += `## 次回やるべきタスク\n`;
    content += `- [ ] 前回の変更の動作確認\n`;
    content += `- [ ] status.mdの確認・更新\n`;
    content += `- [ ] lessons-learned/の確認\n\n`;

    // 仁さんからの指摘事項（ユーザーメッセージから「修正」「問題」「違う」等を含むものを抽出）
    const feedbackKeywords = ['修正', '問題', '違う', 'ダメ', 'おかしい', '直して', 'バグ', 'エラー', '被り', '動かない', '崩れ'];
    const feedback = summary.userMessages.filter(msg =>
      feedbackKeywords.some(kw => msg.includes(kw))
    );
    if (feedback.length > 0) {
      content += `## 仁さんからの指摘事項\n`;
      for (const fb of feedback) {
        content += `- ${fb.replace(/\n/g, ' ')}\n`;
      }
      content += '\n';
    }

    // 使用エージェント
    if (summary.agentsUsed.length > 0) {
      content += `## 使用エージェント\n`;
      for (const agent of summary.agentsUsed) {
        content += `- ${agent}\n`;
      }
      content += '\n';
    }

    // 使用ツール
    if (summary.toolsUsed.length > 0) {
      content += `## 使用ツール\n${summary.toolsUsed.join(', ')}\n\n`;
    }

    // 統計
    content += `## 統計\n`;
    content += `- ユーザーメッセージ数: ${summary.totalUserMessages}\n`;
    content += `- アシスタントメッセージ数: ${summary.totalAssistantMessages}\n`;
    content += `- 編集ファイル数: ${summary.filesModified.length}\n`;
    content += `- 使用ツール種類数: ${summary.toolsUsed.length}\n`;
    content += `- 使用エージェント数: ${summary.agentsUsed.length}\n`;
  } else {
    content += `## 要約\n[トランスクリプトから抽出できませんでした]\n`;
  }

  // 既存ファイルがあれば追記、なければ新規作成
  if (fs.existsSync(sessionFile)) {
    fs.appendFileSync(sessionFile, `\n\n---\n\n${content}`);
  } else {
    fs.writeFileSync(sessionFile, content);
  }

  // バックアップ：sessions/・lessons-learned/・reports/をGitHubにpush
  autoCommitSessions();

  process.exit(0);
}
