# HP 全ページ完成度レポート

**調査日**: 2026-03-28
**対象**: hp/ フォルダー内 全6ファイル
**最終更新**: 2026-03-28（feature/new-pages ブランチ修正後）

---

## サマリー

| ファイル | 修正前 | 修正後 | 主な対応 |
|---|:---:|:---:|---|
| トップページ.html | 85% | 85% | ⏳ 未着手 |
| 事業紹介.html | 75% | 95% | ✅ showStd/showSpc実装・紋章切替UI完全実装・padding-top修正・英語ラベル削除・OGP追加・mainタグ追加 |
| 免振ページ.html | 82% | 82% | ⏳ 未着手 |
| 採用.html | 70% | 92% | ✅ 数字セクション追加・#positionsリンク修正・英語ラベル削除・section-label--dark CSS追加・OGP追加 |
| 会社概要.html | 78% | 93% | ✅ CSS残存削除・padding-top修正・英語ラベル削除・OGP追加 |
| 協力会社.html | 65% | 90% | ✅ CSS二重定義解消・z-index統一・英語ラベル削除・smallタグCSS削除・OGP追加・フォント追加 |

**全体平均: 76% → 93%**（トップ・免振除く4ページ修正済み）

---

## 修正済みページ詳細

### 採用.html（70% → 92%）

| 修正項目 | 状態 |
|---|---|
| 数字セクション追加（重大） | ✅ 累計施工実績・業界経験・社員数の3項目追加 |
| #positions アンカーリンク修正（重大） | ✅ `<section id="positions">` 追加 |
| header__right 空 | ✅ 調査の結果、既に空だった |
| JS変数名 | ✅ 調査の結果、既にhamburger/spNavで正しかった |
| 英語ラベル削除 | ✅ 4箇所（WORK ENVIRONMENT, POSITIONS, EMPLOYEE VOICE, SELECTION FLOW） |
| .section-label--dark CSS追加 | ✅ 定義追加 |
| OGP/favicon追加 | ✅ |

**残課題**: 社員アバターがemojiプレースホルダーのまま（実写真差替え待ち）

---

### 協力会社.html（65% → 90%）

| 修正項目 | 状態 |
|---|---|
| CSS二重定義解消（重大） | ✅ L21-99のオリジナルheader/footer CSS削除、統一版を残す |
| z-index統一 | ✅ 古い100定義削除、1000の統一版のみ |
| smallタグCSS定義削除 | ✅ オリジナルCSS削除に含まれる |
| 英語ラベル削除 | ✅ PARTNER RECRUITMENT |
| OGP/favicon追加 | ✅ |
| Zen Old Mincho フォント追加 | ✅ |

**残課題**: privacy.htmlリンク（L289 `href="#"` のまま、ファイル未作成）

---

### 事業紹介.html（75% → 95%）

| 修正項目 | 状態 |
|---|---|
| showStd()/showSpc() 関数実装（重大） | ✅ パネル表示＋スクロール機能を実装 |
| 紋章ゾーンイベントリスナー追加（重大） | ✅ hover/clickでshow-std/show-spc切替 |
| contentPanels表示ロジック（重大） | ✅ open/bg-std/bg-spc class付与実装 |
| パネルon class切替（重大） | ✅ 個別パネルの表示/非表示切替実装 |
| padding-top → margin-top | ✅ .crest-area 2箇所修正 |
| JS変数名 | ✅ 調査の結果、既にhamburger/spNavで正しかった |
| 英語ラベル削除 | ✅ METHOD 01-08（STANDARD/SPECIAL）8箇所 |
| OGP/favicon追加 | ✅ |
| mainタグ追加 | ✅ |
| HTMLコメント構文修正 | ✅ L669 |

**残課題**: なし

---

### 会社概要.html（78% → 93%）

| 修正項目 | 状態 |
|---|---|
| CSS残存スタイル削除 | ✅ .header__tel/.header__cta 5行削除 |
| padding-top → margin-top | ✅ .page-hero修正 |
| JS変数名 | ✅ 調査の結果、既にhamburger/spNavで正しかった |
| 英語ラベル削除 | ✅ COMPANY INFORMATION, COMPANY HISTORY（GREETING/ACCESSは既に無し） |
| OGP/favicon追加 | ✅ |

**残課題**: なし

---

## 未着手ページ

### トップページ.html（85%）

| 仕様項目 | 状態 |
|---|---|
| JS変数名 | ❌ `hb`/`sn`（正: `hamburger`/`spNav`） |
| 英語ラベル | ❌ "OUR WORKS", "NUMBERS", "NEWS" 等 |
| OGP/favicon | ⚠️ 要確認 |

**追加問題**:
- ニュースリンク4件が `href="#"`（ダミー）
- ロゴリンクが `href="#"`（ダミー）

---

### 免振ページ.html（82%）

| 仕様項目 | 状態 |
|---|---|
| header__right CSS残存 | ⚠️ `.header__tel`/`.header__cta` CSS残存 |
| 英語ラベル | ❌ 多数 |
| OGP/favicon | ❌ 無し |
| mainタグ | ❌ 無し |

---

## 全ページ共通の残課題

| 違反項目 | 該当ページ |
|---|---|
| 英語セクションラベル | トップ・免振（2ページ） |
| OGP/favicon 未設定 | 免振（1ページ）※トップは要確認 |
| JS変数名不統一 | トップ（1ページ） |
| CSS残存スタイル | 免振ページ（1ページ） |
| `<main>` タグ無し | 免振ページ（1ページ） |

## 全ページ共通の強み

- 全ページ CSS・JS インライン完結（外部ファイル依存なし）
- 全ページ 画像 base64 埋め込み（リンク切れリスクゼロ）
- 全ページ レスポンシブ対応済み
- 全ページ Google Fonts 3書体読み込み済み
- 全ページ ハンバーガーメニュー・スクロール検知・Revealアニメーション実装済み
