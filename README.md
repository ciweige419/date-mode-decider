# 约会模式决策器（Cloudflare Pages 静态版）

本项目为 Next.js 单页应用，使用静态导出（`output: "export"`），可直接部署到 Cloudflare Pages。

## 本地运行

```bash
npm install
npm run dev
```

## 构建静态产物

```bash
npm run build
```

构建后静态文件在 `out/` 目录。

## Cloudflare Pages 推荐设置

- Framework preset: `None`（或 Next.js 也可，但以静态站点方式部署）
- Build command: `npm run build`
- Build output directory: `out`
- Node version: `22`（可选）

> 不需要 Wrangler，不需要 Functions，不需要任何环境变量。
