# Aevio LP — デプロイ手順

## 前提条件
- Node.js 18以上
- GitHubアカウント
- Vercelアカウント（無料）

## Step 1: GitHubリポジトリを作成

1. GitHub.com → 「New repository」
2. リポジトリ名: `aevio-lp`
3. Private（非公開）推奨
4. 「Create repository」

## Step 2: ローカルでプロジェクトを設定

```bash
# ダウンロードしたzipを展開後、そのフォルダで:
cd aevio-lp

# 依存関係をインストール
npm install

# ローカルで動作確認
npm run dev
# → http://localhost:3000 で確認

# GitHubにプッシュ
git init
git add .
git commit -m "Initial commit - Aevio LP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aevio-lp.git
git push -u origin main
```

## Step 3: Vercelにデプロイ

1. https://vercel.com にログイン（GitHubアカウントで）
2. 「Add New」→「Project」
3. 「Import Git Repository」→ `aevio-lp` を選択
4. Framework Preset: **Next.js**（自動検出されるはず）
5. 「Deploy」をクリック
6. 2-3分でデプロイ完了 → `aevio-lp-xxxxx.vercel.app` でアクセス可能

## Step 4: カスタムドメインを設定

1. Vercelダッシュボード → プロジェクト → 「Settings」→「Domains」
2. `aevio.ai` を入力 →「Add」
3. 表示されるDNSレコードをCloudflareに追加:
   - Type: `CNAME`
   - Name: `@`（ルートドメイン）
   - Target: `cname.vercel-dns.com`
4. `www.aevio.ai` も追加する場合:
   - Type: `CNAME`  
   - Name: `www`
   - Target: `cname.vercel-dns.com`
5. Cloudflare側のProxy（オレンジの雲）は**OFFにする**（DNS onlyに）
6. 数分待つとSSL証明書も自動発行されます

## Step 5: 確認

- https://aevio.ai にアクセスしてLPが表示されればOK
- モバイルでも確認（レスポンシブ対応は今後改善可能）

## ファイル構成

```
aevio-lp/
├── app/
│   ├── layout.js     ← メタデータ・OGP・フォント設定
│   ├── page.js       ← ランディングページ本体
│   └── icon.svg      ← ファビコン（Orbitマーク）
├── public/            ← 静的ファイル置き場（OG画像等）
├── package.json
├── next.config.js
└── .gitignore
```

## 今後の追加タスク
- [ ] OG画像を追加（Twitter/SNSシェア用）
- [ ] フォーム送信をhello@aevio.aiに飛ばす（Formspree or Resend）
- [ ] Google Analytics / PostHog 追加
- [ ] レスポンシブ対応の改善（モバイル最適化）
