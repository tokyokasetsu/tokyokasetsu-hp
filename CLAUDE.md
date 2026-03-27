# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

株式会社東京架設（足場・仮設工事 / 東京都板橋区 / 関東一円）のコーポレートサイト。
全ページ `hp/` フォルダ内の単体HTMLファイル（CSS・JS インライン、外部ファイルなし）。

### ページ一覧

| ファイル | 内容 |
|---|---|
| トップページ.html | LP（ヒーロー＋九曜紋UI＋サービス＋実績＋数字＋ニュース） |
| 事業紹介.html | 事業案内（紋章SVG切替UI＋通常/特殊足場パネル） |
| 協力会社.html | 協力会社募集（簡素なレイアウト、他ページとCSS設計が異なる） |
| 免振ページ.html | 免震足場（特許技術解説＋比較図＋施工事例） |
| 採用.html | 採用情報（数字＋文化＋募集要項＋社員の声＋選考フロー） |
| 会社概要.html | 会社情報（代表挨拶＋会社概要テーブル＋沿革タイムライン） |

## 絶対ルール（HP担当）

1. **修正指示のない箇所は絶対に変更しない**
2. **バグ・仕様違反は自動修正して報告する**
3. **デザイン変更は必ずユーザーに確認を取ってから実施する**

## 仕様

### ナビゲーション順序

事業案内 → 協力会社 → 免震足場 → 図面品質 → 施工事例 → ブログ → 採用情報 → 会社情報

### カラー変数（:root）

```css
--navy-deep: #0e1a2a;
--navy:      #152538;
--navy-mid:  #1e3450;
--blue:      #3088d0;
--blue-bright: #4aabf5;
--cyan:      #5ad0ec;
--cyan-light: #8aeaf8;
```

### フォント

- 日本語: `Noto Sans JP`（--font-ja）
- 英数字: `Outfit`（--font-en）
- ロゴ: `Zen Old Mincho`

### header 仕様

- **`header__right` は必ず空にする**（電話番号・CTAボタン禁止）
- **`header__logo-text` に `<small>` タグ禁止**
- **英語セクションラベル（section-label内の英語テキスト）禁止**

### レイアウト

- fixed ヘッダー下のコンテンツは **`margin-top`** で余白を取る（`padding-top` 禁止）

### JavaScript 変数名規約

| 用途 | 変数名 |
|---|---|
| ハンバーガーボタン | `hamburger` |
| SPナビ | `spNav` |
| ヘッダー要素 | `hdr` |
| スクロール判定閾値 | `80`（px） |

## 現状の既知の仕様違反

以下はページ横断で確認済みの乖離点。修正指示がある場合にのみ対応すること。

### header__right が空でない
- 免振ページ.html: 電話番号＋CTAボタンあり（L255-260）
- 採用.html: header__right の div あり（L298）
- 会社概要.html: CSS に header__tel / header__cta のスタイルが残存

### header__logo-text に small タグ
- 協力会社.html: CSS に `.header__logo-text small` のスタイル定義あり（L27）

### 英語セクションラベルが存在
- 全ページで section-label 内に英語テキスト使用中（例: "OUR WORKS", "NUMBERS", "COMPANY INFORMATION" 等）

### JS 変数名の不統一
- 採用.html: `ham`（仕様: `hamburger`）
- 会社概要.html: `btn` / `nav`（仕様: `hamburger` / `spNav`）
- 事業紹介.html: `ham` / `spnav`（仕様: `hamburger` / `spNav`）
- トップページ.html: `hb` / `sn`（仕様: `hamburger` / `spNav`）

### fixed 下の padding-top 使用
- 事業紹介.html: `.crest-area` に `padding-top:80px`（L169）
- 会社概要.html: `.page-hero` に `padding-top:80px`（L70）

### 協力会社.html の構造差異
- ヘッダー高さ 68px（他ページは 80px）
- クラス命名が独自体系（`.header__ham`, `.header__nav a` 等）
- CSS 変数が簡略版（--navy-deep, --blue-bright, --cyan-light 等が未定義）
- sp-nav 未実装（ハンバーガー動作なし）
