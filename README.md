# 约会模式决策器（Next.js 单页版）

把原始 React demo 工程化为可直接部署到 Vercel 的 Next.js 项目，移动端优先、单页、保留原有判断逻辑与样式风格。

## 文件结构

```txt
.
├── app
│   ├── api
│   │   └── track
│   │       └── route.js
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components
│   └── DateFoodDeciderDemo.jsx
├── lib
│   └── track.js
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── tailwind.config.js
```

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 统计事件（最简）

仅包含 3 个事件：
- `page_view`
- `start_click`
- `result_view`

前端通过 `fetch('/api/track')` 上报，服务端在 `app/api/track/route.js` 做白名单校验并打印日志。

## 一步步部署到 Vercel

1. 把代码推到 GitHub（或 GitLab/Bitbucket）。
2. 打开 [Vercel](https://vercel.com)，登录账号。
3. 点击 **Add New... → Project**。
4. 选择你的仓库并导入。
5. Framework Preset 选择 **Next.js**（通常会自动识别）。
6. Build Command 保持默认 `next build`，Output 保持默认。
7. 点击 **Deploy**。
8. 首次部署完成后，打开域名进行验证。
9. 后续每次 `git push` 到默认分支，Vercel 会自动重新部署。

## 截图建议

- 进入页面后选择任意条件，点击“开始判断”。
- 结果卡片会在同页展开，适合直接手机截图。
