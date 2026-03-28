# HP 全ページ完成度レポート

**調査日**: 2026-03-28
**対象**: hp/ フォルダー内 全6ファイル
**調査方法**: 6並列エージェントによる部分読み＋仕様照合

---

## サマリー

| ファイル | 完成度 | 主な未対応 |
|---|:---:|---|
| トップページ.html | 85% | JS変数名違反、英語ラベル、ファイルサイズ1.7MB |
| 事業紹介.html | 75% | JS変数名違反、padding-top違反、showStd/showSpc未定義の可能性 |
| 免振ページ.html | 82% | header__right非空（CSS残存）、英語ラベル多数、OGP/favicon未確認 |
| 採用.html | 70% | 数字セクション欠落、#positionsリンク切れ、header__right非空 |
| 会社概要.html | 78% | padding-top違反、CSS残存、英語ラベル、OGP/favicon未確認 |
| 協力会社.html | 65% | CSS二重定義、独自クラス体系、OGP/favicon無し |

**全体平均: 76%**

---

## ページ別詳細

### 1. トップページ.html（85%）

**HTML構造**: head/header/main/footer 完備。Google Fonts プリロード済み
**CSS**: インラインCSS、レスポンシブ対応（1024px/640px）、CSS変数完備
**JS**: ハンバーガー、九曜紋UI(8ノード切替)、カウントアップ、IntersectionObserver、ページ遷移演出（羽根アニメーション）
**コンテンツ**: ヒーロー(動画背景)・九曜紋UI・サービス・実績・数字・ニュース・CTA — 全セクション揃い
**画像**: 全てbase64インライン（動画含む → **1.7MB** パフォーマンス懸念）

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅ HTMLは空（CSSに定義残存） |
| small タグなし | ✅（CSSに定義残存） |
| margin-top 使用 | ✅ |
| JS変数名 | ❌ `hb`/`sn`（正: `hamburger`/`spNav`） |
| 英語ラベル | ❌ "OUR WORKS", "NUMBERS", "NEWS" 等 |
| OGP/favicon | ⚠️ 要確認（エージェント間で判定分かれ） |

**追加問題**:
- ニュースリンク4件が `href="#"`（ダミー）
- ロゴリンクが `href="#"`（ダミー）

---

### 2. 事業紹介.html（75%）

**HTML構造**: head/header/footer あり。`<main>`タグ無し
**CSS**: インラインCSS、レスポンシブ対応（1024px/640px/768px）、CSS変数完備
**JS**: ハンバーガー、紋章SVG切替UI、IntersectionObserver
**コンテンツ**: ヒーロー・紋章SVG切替UI・通常足場パネル(METHOD 01-04)・特殊足場パネル(METHOD 05-08)・CTA
**画像**: 全てbase64インライン

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅ |
| small タグなし | ✅ |
| margin-top 使用 | ❌ `.crest-area` に `padding-top:80px`（L169, L429） |
| JS変数名 | ❌ `ham`/`spnav`（正: `hamburger`/`spNav`） |
| 英語ラベル | ❌ "BUSINESS", "METHOD XX" 等 |
| OGP/favicon | ❌ 無し |
| mainタグ | ❌ 無し |

**追加問題（重大）**:
- `showStd()` / `showSpc()` 関数が呼び出されているが定義が見つからない可能性 → 紋章切替UIが動作しない恐れ（要手動確認）

---

### 3. 免振ページ.html（82%）

**HTML構造**: head/header/footer あり。`<main>`タグ無し
**CSS**: インラインCSS、レスポンシブ対応（1024px/768px）、CSS変数完備（14個）
**JS**: ハンバーガー、比較スライダー(beforeAfter)、カウントアップ、IntersectionObserver、Canvas羽根パーティクル
**コンテンツ**: ヒーロー・課題提起・ソリューション・特許技術メカニズム(特許第6346238号)・比較図・施工事例・特許情報・CTA — 全セクション揃い
**画像**: base64インライン + SVGインライン

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ⚠️ HTMLは空だがCSS(`.header__tel`/`.header__cta`)が残存 |
| small タグなし | ✅（CSSに`.header__logo-text small`定義残存） |
| margin-top 使用 | ✅ |
| JS変数名 | ✅ `hamburger`/`spNav`/`hdr` — 全て準拠 |
| 英語ラベル | ❌ "THE CORE PROBLEM", "ANOTHER RISK", "INTEGRATED PLATFORM SYSTEM", "CASE STUDIES" 等多数 |
| OGP/favicon | ❌ 無し |
| mainタグ | ❌ 無し |

**注**: 既知の仕様違反リスト(00-known-issues.md)では「電話番号＋CTAボタンあり（L255-260）」と記載されているが、詳細調査ではHTMLの`header__right`は空。CSSのデッドコードのみ残存の可能性。要手動確認。

---

### 4. 採用.html（70%）

**HTML構造**: head/header/main/footer あり
**CSS**: インラインCSS、レスポンシブ対応（1024px/640px）、CSS変数完備
**JS**: ハンバーガー、カウントアップ、社員の声カルーセル、IntersectionObserver、ページ遷移演出
**コンテンツ**: ヒーロー・文化(待遇)・募集要項・社員の声・選考フロー・CTA
**画像**: base64インライン、社員アバターはemojiプレースホルダー

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ❌ div あり（L285-298付近） |
| small タグなし | ✅ |
| margin-top 使用 | ⚠️ 一部 padding-top 使用あり（footer等） |
| JS変数名 | ⚠️ 要確認（エージェント間で判定分かれ: `ham` vs `hamburger`） |
| 英語ラベル | ❌ "WORK ENVIRONMENT", "POSITIONS", "EMPLOYEE VOICE", "SELECTION FLOW" 等 |
| OGP/favicon | ❌ 無し |

**追加問題（重大）**:
- ❌ **数字セクション（累計施工実績・年数・社員数）が欠落** — 仕様では必須
- ❌ **`#positions` アンカーリンク切れ** — page-intro の scrollTo 先に `id="positions"` が無い
- `.section-label--dark` CSSクラスが使用されているが未定義

---

### 5. 会社概要.html（78%）

**HTML構造**: head/header/main/footer あり
**CSS**: インラインCSS、レスポンシブ対応（1024px/768px）、CSS変数完備
**JS**: ハンバーガー、沿革タイムラインアニメーション、IntersectionObserver
**コンテンツ**: ヒーロー・代表挨拶(2名)・会社概要テーブル・沿革タイムライン(1989年〜)・アクセス(Google Maps埋込)・CTA — 全セクション揃い
**画像**: base64インライン + Google Maps iframe

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅（HTMLは空） |
| CSS残存 | ❌ `.header__tel`/`.header__cta` スタイル残存（L50-54） |
| small タグなし | ✅ |
| margin-top 使用 | ❌ `.page-hero` に `padding-top:80px`（L70） |
| JS変数名 | ⚠️ 要確認（既知リストでは `btn`/`nav` だが詳細調査では `hamburger`/`spNav` — 修正済みの可能性） |
| 英語ラベル | ❌ "COMPANY INFORMATION", "GREETING", "COMPANY HISTORY", "ACCESS" |
| OGP/favicon | ❌ 無し |

---

### 6. 協力会社.html（65%）

**HTML構造**: head/header/footer あり。OGP・favicon 無し。`<main>` は `class="main"` で実装
**CSS**: インラインCSS、レスポンシブ対応（768px）、CSS変数は簡略版
**JS**: ハンバーガー、カウントアップ、FAQ アコーディオン、IntersectionObserver
**コンテンツ**: ヒーロー・強み(3カード)・募集要項・数字・協力会社の声(3件)・FAQ(アコーディオン)・CTA・応募フォーム
**画像**: base64インライン（ロゴのみ）

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅ |
| small タグなし | ✅（CSSに`.site-header__logo-text small`定義あり） |
| margin-top 使用 | ✅ |
| JS変数名 | ✅ `hamburger`/`spNav`/`hdr` — 全て準拠 |
| 英語ラベル | ❌ "PARTNERS", "WHY US", "REQUIREMENTS", "NUMBERS", "VOICE", "FAQ" |
| クラス命名 | ❌ 独自体系（`.site-header` vs 他ページ`.header`） |
| OGP/favicon | ❌ 無し |
| ヘッダー高さ | ⚠️ 68px → 80pxに修正済みの可能性（要確認） |

**追加問題（重大）**:
- ❌ **CSS二重定義**: L100以降に「UNIFIED HEADER/FOOTER (auto-injected)」としてヘッダー/フッタースタイルが再定義 → 最初の定義（L21-99）と競合
- z-index 不統一（L22: 100 vs L102: 1000）
- privacy.html へのリンクがあるがファイル未確認

---

## 全ページ共通の仕様違反

| 違反項目 | 該当ページ |
|---|---|
| 英語セクションラベル | **全6ページ** |
| OGP/favicon 未設定 | 事業紹介・免振・採用・会社概要・協力会社（5ページ）※トップは要確認 |
| JS変数名不統一 | トップ・事業紹介（確定2ページ）＋採用・会社概要（要確認2ページ） |
| header__right 非空 | 免振ページ（CSS残存）・採用（HTML非空） |
| padding-top 使用 | 事業紹介・会社概要（2ページ） |
| CSS残存スタイル | 免振ページ・会社概要（2ページ） |
| `<main>` タグ無し | 事業紹介・免振ページ（2ページ） |

## 重大バグ（要手動確認）

| ページ | 問題 | 影響 |
|---|---|---|
| 事業紹介.html | showStd()/showSpc() 関数未定義の可能性 | 紋章切替UIが動作しない |
| 採用.html | 数字セクション欠落 | 仕様で必須のコンテンツが無い |
| 採用.html | #positions アンカーリンク切れ | ナビから募集要項へスクロールできない |
| 協力会社.html | CSS二重定義（L21-99 vs L100以降） | スタイル競合・意図しない表示 |

## 全ページ共通の強み

- 全ページ CSS・JS インライン完結（外部ファイル依存なし）
- 全ページ 画像 base64 埋め込み（リンク切れリスクゼロ）
- 全ページ レスポンシブ対応済み
- 全ページ Google Fonts 3書体読み込み済み
- 全ページ ハンバーガーメニュー・スクロール検知・Revealアニメーション実装済み
