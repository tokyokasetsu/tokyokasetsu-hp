# HP 仕様詳細

## ナビゲーション順序

事業案内 → 協力会社 → 免震足場 → 図面品質 → 施工事例 → ブログ → 採用情報 → 会社情報

## カラー変数（:root）

```css
--navy-deep: #0e1a2a;
--navy:      #152538;
--navy-mid:  #1e3450;
--blue:      #3088d0;
--blue-bright: #4aabf5;
--cyan:      #5ad0ec;
--cyan-light: #8aeaf8;
```

## フォント

- 日本語: `Noto Sans JP`（--font-ja）
- 英数字: `Outfit`（--font-en）
- ロゴ: `Zen Old Mincho`

## header 仕様

- **`header__right` は必ず空にする**（電話番号・CTAボタン禁止）
- **`header__logo-text` に `<small>` タグ禁止**
- **英語セクションラベル（section-label内の英語テキスト）禁止**

## レイアウト

- fixed ヘッダー下のコンテンツは **`margin-top`** で余白を取る（`padding-top` 禁止）

## JavaScript 変数名規約

| 用途 | 変数名 |
|---|---|
| ハンバーガーボタン | `hamburger` |
| SPナビ | `spNav` |
| ヘッダー要素 | `hdr` |
| スクロール判定閾値 | `80`（px） |
