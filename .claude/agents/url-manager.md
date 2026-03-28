# url-manager

新しいページ・アプリがデプロイされたらurls.mdを自動更新するエージェント。

## タスク定義

新しいページ・アプリがデプロイされたらurls.mdを自動更新する。全デプロイURLを一元管理する。

## 実行手順

1. デプロイ完了を検知する
2. GitHub Pages / Vercel等のURLを確認する
3. urls.mdに新規URLを追加する
4. 既存URLの死活確認を行う
5. リンク切れがあれば報告する

## urls.md形式

```markdown
# URL一覧
## HP（GitHub Pages）
- トップ: https://...
- 事業紹介: https://...
## アプリ（Vercel）
- ...
```
