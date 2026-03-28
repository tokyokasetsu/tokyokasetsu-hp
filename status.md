# HP 全ページ完成度レポート

**調査日**: 2026-03-28
**対象**: hp/ フォルダー内 全6ファイル

---

## サマリー

| ファイル | 完成度 | 主な未対応 |
|---|:---:|---|
| トップページ.html | 90% | JS変数名違反、英語ラベル残存 |
| 事業紹介.html | 88% | JS変数名違反、padding-top違反、英語ラベル |
| 免振ページ.html | 85% | header__right非空（電話+CTA）、英語ラベル |
| 採用.html | 87% | header__right非空、JS変数名違反、英語ラベル |
| 会社概要.html | 83% | JS変数名違反、padding-top違反、CSS残存、英語ラベル |
| 協力会社.html | 80% | 独自クラス体系、OGP/favicon未設定、英語ラベル |

**全体平均: 86%**

---

## ページ別詳細

### 1. トップページ.html（90%）

**HTML構造**: 完備（head/OGP/favicon/header/main/footer）
**CSS**: インラインCSS、レスポンシブ対応（768px）、CSS変数完備
**JS**: ハンバーガー、九曜紋UI、カウントアップ、IntersectionObserver
**コンテンツ**: ヒーロー(動画)・九曜紋UI・サービス・実績・数字・ニュース・CTA — 全セクション揃い
**画像**: 全てbase64インライン（動画含む → 1.7MB）

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅ |
| small タグなし | ✅ |
| margin-top 使用 | ✅ |
| JS変数名 | ❌ `hb`/`sn`（正: `hamburger`/`spNav`） |
| 英語ラベル | ❌ "OUR WORKS", "NUMBERS", "NEWS" 等 |

**未対応**: JS変数名修正、英語ラベル削除、ファイルサイズ最適化

---

### 2. 事業紹介.html（88%）

**HTML構造**: 完備（head/OGP/favicon/header/main/footer）
**CSS**: インラインCSS、レスポンシブ対応、CSS変数完備
**JS**: ハンバーガー、紋章SVG切替UI、IntersectionObserver
**コンテンツ**: ヒーロー・紋章SVG切替UI・通常足場パネル・特殊足場パネル・CTA — 全セクション揃い
**画像**: 全てbase64インライン

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅ |
| small タグなし | ✅ |
| margin-top 使用 | ❌ `.crest-area` に `padding-top:80px` |
| JS変数名 | ❌ `ham`/`spnav`（正: `hamburger`/`spNav`） |
| 英語ラベル | ❌ "BUSINESS" 等 |

**未対応**: JS変数名修正、padding-top→margin-top、英語ラベル削除

---

### 3. 免振ページ.html（85%）

**HTML構造**: 完備（head/OGP/favicon/header/main/footer）
**CSS**: インラインCSS、レスポンシブ対応、CSS変数完備
**JS**: ハンバーガー、比較スライダー、カウントアップ、IntersectionObserver
**コンテンツ**: ヒーロー・課題提起・ソリューション・特許技術メカニズム・比較図・施工事例・特許情報・CTA — 全セクション揃い
**画像**: 全てbase64インライン

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ❌ 電話番号＋CTAボタンあり（L255-260） |
| small タグなし | ✅ |
| margin-top 使用 | ✅ |
| JS変数名 | ✅ `hamburger`/`spNav`/`hdr` |
| 英語ラベル | ❌ "SEISMIC ISOLATION", "PROBLEM", "SOLUTION" 等多数 |
| CSS残存 | ❌ `.header__tel`/`.header__cta` のスタイル定義残存 |

**未対応**: header__right の電話番号・CTA削除、CSS残存スタイル削除、英語ラベル削除

---

### 4. 採用.html（87%）

**HTML構造**: 完備（head/OGP/favicon/header/main/footer）
**CSS**: インラインCSS、レスポンシブ対応、CSS変数完備
**JS**: ハンバーガー、カウントアップ、社員の声カルーセル、IntersectionObserver
**コンテンツ**: ヒーロー・数字・文化・募集要項・社員の声・選考フロー・CTA — 全セクション揃い
**画像**: 全てbase64インライン

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ❌ div あり（L298） |
| small タグなし | ✅ |
| margin-top 使用 | ✅ |
| JS変数名 | ❌ `ham`（正: `hamburger`）※spNavは準拠 |
| 英語ラベル | ❌ "RECRUIT", "NUMBERS", "CULTURE" 等 |

**未対応**: header__right 空化、JS変数名修正、英語ラベル削除

---

### 5. 会社概要.html（83%）

**HTML構造**: 完備（head/OGP/favicon/header/main/footer）
**CSS**: インラインCSS、レスポンシブ対応、CSS変数完備
**JS**: ハンバーガー、沿革タイムラインアニメーション、IntersectionObserver
**コンテンツ**: ヒーロー・代表挨拶・会社概要テーブル・沿革タイムライン・アクセス・CTA — 全セクション揃い
**画像**: 全てbase64インライン

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅（HTMLは空） |
| CSS残存 | ❌ `.header__tel`/`.header__cta` スタイル残存 |
| small タグなし | ✅ |
| margin-top 使用 | ❌ `.page-hero` に `padding-top:80px`（L70） |
| JS変数名 | ❌ `btn`/`nav`（正: `hamburger`/`spNav`） |
| 英語ラベル | ❌ "COMPANY INFORMATION", "GREETING", "HISTORY" 等 |

**未対応**: JS変数名修正、padding-top→margin-top、CSS残存削除、英語ラベル削除

---

### 6. 協力会社.html（80%）

**HTML構造**: head/header/footer あり。OGP・favicon なし。`<main>`タグなし
**CSS**: インラインCSS、レスポンシブ対応（768px）、CSS変数は定義あるが簡略版
**JS**: ハンバーガー、カウントアップ、FAQ アコーディオン、IntersectionObserver
**コンテンツ**: ヒーロー・強み/メリット・募集要項・数字・協力会社の声・FAQ・CTA — 揃い
**画像**: 全てbase64インライン

| 仕様項目 | 状態 |
|---|---|
| header__right 空 | ✅ |
| small タグなし | ✅（CSSに`.site-header__logo-text small`定義あり） |
| margin-top 使用 | ✅ |
| JS変数名 | ✅ `hamburger`/`spNav`/`hdr` |
| 英語ラベル | ❌ "PARTNERS", "WHY US", "REQUIREMENTS" 等 |
| クラス命名 | ⚠️ 独自体系（`.site-header` vs 他ページ`.header`） |
| OGP/favicon | ❌ なし |
| mainタグ | ❌ なし |

**未対応**: OGP/favicon追加、mainタグ追加、クラス命名統一、英語ラベル削除、ダミーリンク修正

---

## 全ページ共通の仕様違反

| 違反項目 | 該当ページ |
|---|---|
| 英語セクションラベル | 全6ページ |
| JS変数名不統一 | トップ・事業紹介・採用・会社概要（4ページ） |
| header__right 非空 | 免振ページ・採用（2ページ） |
| padding-top 使用 | 事業紹介・会社概要（2ページ） |
| CSS残存スタイル | 免振ページ・会社概要（2ページ） |

## 全ページ共通の強み

- 全ページ CSS・JS インライン完結（外部ファイル依存なし）
- 全ページ 画像 base64 埋め込み（リンク切れリスクゼロ）
- 全ページ レスポンシブ対応済み（768px ブレークポイント）
- 全ページ Google Fonts 3書体読み込み済み
- 5/6ページ OGP・favicon 対応済み（協力会社のみ未対応）
