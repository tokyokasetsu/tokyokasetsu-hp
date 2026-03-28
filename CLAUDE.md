# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリ情報

- **GitHub**: https://github.com/tokyokasetsu/tokyokasetsu-hp
- **別PCでの環境構築手順**: `git clone https://github.com/tokyokasetsu/tokyokasetsu-hp.git` → `cd tokyokasetsu-hp` → `claude`
- **作業日**: 2026-03-28
- **ブランチ運用**: 作業ブランチは `master`、GitHub のデフォルトは `main`

## プロジェクト概要

株式会社東京架設（足場・仮設工事 / 東京都板橋区 / 関東一円）のコーポレートサイト。
全ページ `hp/` フォルダ内の単体HTMLファイル（CSS・JS インライン、外部ファイルなし）。

### ページ一覧

| ファイル | 内容 |
|---|---|
| index.html | LP（ヒーロー＋九曜紋UI＋サービス＋実績＋数字＋ニュース） |
| service.html | 事業案内（紋章SVG切替UI＋通常/特殊足場パネル） |
| partner.html | 協力会社募集（簡素なレイアウト、他ページとCSS設計が異なる） |
| menshin.html | 免震足場（特許技術解説＋比較図＋施工事例） |
| recruit.html | 採用情報（数字＋文化＋募集要項＋社員の声＋選考フロー） |
| company.html | 会社情報（代表挨拶＋会社概要テーブル＋沿革タイムライン） |

## 絶対ルール（HP担当）

1. **修正指示のない箇所は絶対に変更しない**
2. **バグ・仕様違反は自動修正して報告する**
3. **デザイン変更は必ずユーザーに確認を取ってから実施する**

## 運用ナレッジ（詳細は .claude/rules/ 参照）

以下のルールファイルに詳細を分散管理:

| ファイル | 内容 |
|---|---|
| `.claude/rules/00-known-issues.md` | 既知の仕様違反一覧（修正指示がある場合のみ対応） |
| `.claude/rules/01-hp-workflow.md` | Git運用・ファイル構成・作業姿勢・コミット原則 |
| `.claude/rules/02-claude-code-techniques.md` | 操作テクニック・思考量制御・git worktree並行・PMマインドセット |
| `.claude/rules/03-dev-tools-and-methods.md` | UIガチャ・MCP連携・SaaS開発フロー・AI分業・Cowork vs Claude Code |
| `.claude/rules/04-hp-spec.md` | ナビ順序・カラー変数・フォント・header仕様・レイアウト・JS変数名規約 |
| `.claude/rules/05-skill-design.md` | スキル構造・YAML仕様・2分類・Eval・サブエージェント設計・運用注意 |
| `.claude/rules/06-requirements-and-design.md` | 要求/要件定義・非機能要件6分類・設計思想・認知負荷 |
| `.claude/rules/07-security-and-prompting.md` | セキュリティ意識・プロンプトキーワード・プロンプト4原則 |
