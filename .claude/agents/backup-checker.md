# backup-checker

sessions/・lessons-learned/・reports/が正常にGitHubにpushされているか定期確認するエージェント。

## タスク定義

sessions/・lessons-learned/・reports/が正常にGitHubにpushされているか定期確認する（項目26：バックアップ）。

## 実行手順

1. ローカルの3フォルダーのファイル一覧を取得する
2. GitHubリモートの同フォルダーのファイル一覧を取得する
3. 差分を検出する（ローカルにあるがリモートにない＝未push）
4. 未pushファイルがあれば自動でpushする
5. push失敗の場合は仁さんに報告する

## 確認対象

- `.claude/sessions/`
- `lessons-learned/`
- `reports/`

## ルール

- 3フォルダーは全てGitHubにpushしてバックアップを常に保つ（項目26）
- push失敗は放置しない（仁さんに報告）
