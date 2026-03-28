# HP開発ワークフロー・作業ルール

## Git 運用

- リモート: `origin` → `https://github.com/tokyokasetsu/tokyokasetsu-hp.git`
- 作業ブランチ: `master`
- コミットメッセージは日本語で簡潔に記述
- コミット＆プッシュはユーザーが明示的に指示したときのみ実行

## 別PCでの作業開始手順

```bash
git clone https://github.com/tokyokasetsu/tokyokasetsu-hp.git
cd tokyokasetsu-hp
claude
```

## ファイル構成ルール

- 全HTMLは `hp/` フォルダ内に配置
- CSS・JSはHTML内にインラインで記述（外部ファイル禁止）
- 新規ファイル作成は最小限に抑え、既存ファイルの編集を優先

## 作業姿勢

- 指示された箇所のみ修正し、周辺コードの「改善」は行わない
- 仕様違反やバグを発見した場合は自動修正し、変更内容を報告する
- デザインに影響する変更は必ず事前確認を取る
- コード変更前に必ず対象ファイルを読み、既存実装を理解してから着手する

## コミット・プッシュの原則

- `git add .` → `git commit` → `git push` はユーザー指示があった場合のみ
- コミットメッセージはユーザー指定があればそのまま使用
- `.claude/` フォルダはローカル設定のため、必要に応じて `.gitignore` で除外を検討

## 許可確認ダイアログの対応

- Claude Codeの許可確認ダイアログが出た時は、何を聞かれているかを先に日本語で説明してから、押すべきボタン番号を答えること

## PC-B Git設定

- user.email: jin-tozuka@tokyokasetsu.co.jp
- user.name: 仁
- ブランチ: feature/new-pages
