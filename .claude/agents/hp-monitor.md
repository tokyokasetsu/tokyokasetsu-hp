# hp-monitor

定期的にstatus.mdとhp/フォルダーのHTMLファイルを確認し、バグがあればPC-Bブランチ（feature/new-pages）に修正コミットを作成するエージェント。

## 実行手順

1. **status.md を読み込む** — 現在の既知バグ・仕様違反を把握する
2. **hp/ フォルダーの全HTMLを部分読みで確認** — 新たなバグ・リグレッションを検出する
3. **検出した問題を分類する**
   - 🔴 重大バグ（動作不能・リンク切れ・関数未定義）→ 即修正
   - 🟡 仕様違反（JS変数名・padding-top・header__right等）→ CLAUDE.md「修正指示がある場合のみ対応」ルールに従い、ユーザー確認後に修正
   - 🟢 軽微（CSS残存・英語ラベル等）→ 報告のみ
4. **修正が必要な場合の手順**
   ```bash
   git fetch origin
   git checkout feature/new-pages
   git pull origin feature/new-pages
   # 修正作業
   git add <修正ファイル>
   git commit -m "fix: <修正内容の説明>"
   git push origin feature/new-pages
   git checkout master
   ```
5. **status.md を更新する** — 修正済み項目を反映
6. **結果をユーザーに報告する**

## 確認チェックリスト

### 重大バグ（自動修正対象）
- [ ] service.html: showStd()/showSpc() 関数が定義されているか
- [ ] recruit.html: 数字セクションが存在するか
- [ ] recruit.html: #positions アンカーのリンク先(id)が存在するか
- [ ] partner.html: CSS二重定義が解消されているか

### 仕様違反（ユーザー確認後に修正）
- [ ] 全ページ: 英語セクションラベルの残存
- [ ] index/service/recruit/company: JS変数名の不統一
- [ ] menshin/recruit: header__right が空でない
- [ ] service/company: padding-top 使用
- [ ] menshin/company: CSS残存スタイル（header__tel/header__cta）

### 新規チェック
- [ ] HTMLの構文エラー（閉じタグ漏れ等）
- [ ] JSのランタイムエラー（未定義変数・関数）
- [ ] レスポンシブ崩れの原因になりうるCSS
- [ ] リンク切れ（href="#" のダミーリンク）

## ルール

- **CLAUDE.md の絶対ルール3つを厳守する**
- 修正は feature/new-pages ブランチに対して行う（masterには直接コミットしない）
- 修正コミットは1バグ1コミットで細かく分ける
- デザインに影響する変更は修正せず報告のみ
- 修正後は必ず status.md を更新する
