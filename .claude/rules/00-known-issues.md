# 既知の仕様違反

以下はページ横断で確認済みの乖離点。修正指示がある場合にのみ対応すること。

> **注**: 2026-03-28 の feature/new-pages ブランチで大半を修正済み。
> ファイル名も英語化済み（トップページ→index, 事業紹介→service, 免振ページ→menshin, 採用→recruit, 会社概要→company, 協力会社→partner）

## header__right が空でない
- menshin.html: ~~電話番号＋CTAボタンあり~~ → CSS残存削除済み ✅
- recruit.html: ~~header__right の div あり~~ → 調査の結果、既に空だった ✅
- company.html: ~~CSS に header__tel / header__cta のスタイルが残存~~ → 削除済み ✅

## header__logo-text に small タグ
- partner.html: ~~CSS に `.header__logo-text small` のスタイル定義あり~~ → CSS二重定義解消時に削除済み ✅

## 英語セクションラベルが存在
- ~~全ページで section-label 内に英語テキスト使用中~~ → 全ページ削除済み ✅

## JS 変数名の不統一
- ~~recruit.html: `ham`~~ → 調査の結果、既にhamburgerで正しかった ✅
- ~~company.html: `btn` / `nav`~~ → 調査の結果、既にhamburger/spNavで正しかった ✅
- ~~service.html: `ham` / `spnav`~~ → 調査の結果、既にhamburger/spNavで正しかった ✅
- ~~index.html: `hb` / `sn`~~ → hamburger/spNavに修正済み ✅

## fixed 下の padding-top 使用
- ~~service.html: `.crest-area` に `padding-top:80px`~~ → margin-topに修正済み ✅
- ~~company.html: `.page-hero` に `padding-top:80px`~~ → margin-topに修正済み ✅

## partner.html の構造差異
- ~~ヘッダー高さ 68px~~ → CSS二重定義解消で80pxの統一版に修正済み ✅
- ~~クラス命名が独自体系~~ → 統一版CSSで解消済み ✅
- ~~CSS 変数が簡略版~~ → 統一版CSSで解消済み ✅
- ~~sp-nav 未実装~~ → 統一版で実装済み ✅
