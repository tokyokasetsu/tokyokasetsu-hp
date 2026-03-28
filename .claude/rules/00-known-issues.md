# 既知の仕様違反

以下はページ横断で確認済みの乖離点。修正指示がある場合にのみ対応すること。

## header__right が空でない
- 免振ページ.html: 電話番号＋CTAボタンあり（L255-260）
- 採用.html: header__right の div あり（L298）
- 会社概要.html: CSS に header__tel / header__cta のスタイルが残存

## header__logo-text に small タグ
- 協力会社.html: CSS に `.header__logo-text small` のスタイル定義あり（L27）

## 英語セクションラベルが存在
- 全ページで section-label 内に英語テキスト使用中（例: "OUR WORKS", "NUMBERS", "COMPANY INFORMATION" 等）

## JS 変数名の不統一
- 採用.html: `ham`（仕様: `hamburger`）
- 会社概要.html: `btn` / `nav`（仕様: `hamburger` / `spNav`）
- 事業紹介.html: `ham` / `spnav`（仕様: `hamburger` / `spNav`）
- トップページ.html: `hb` / `sn`（仕様: `hamburger` / `spNav`）

## fixed 下の padding-top 使用
- 事業紹介.html: `.crest-area` に `padding-top:80px`（L169）
- 会社概要.html: `.page-hero` に `padding-top:80px`（L70）

## 協力会社.html の構造差異
- ヘッダー高さ 68px（他ページは 80px）
- クラス命名が独自体系（`.header__ham`, `.header__nav a` 等）
- CSS 変数が簡略版（--navy-deep, --blue-bright, --cyan-light 等が未定義）
- sp-nav 未実装（ハンバーガー動作なし）
