# wilyum-rivyr-tsao.github.io

Rivyr 的个人主页 · Astro + 纯手写 CSS（无框架依赖）

- 🏠 首页：Bento 网格 + 打字机 + 鼠标追光 + 滚动浮现 + 明暗主题
- ✎ 博客：21 篇迁移自旧 Jekyll 站（原文存档在 `legacy-jekyll` 分支）
- 🤖 LLM 友好：`/llms.txt`、sitemap、语义化 HTML

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
```

## 改个人信息

所有介绍、技能、社交链接都在 **`src/consts.ts`**，改完 push 即可。

## 写文章

在 `src/content/blog/` 新建 markdown：

```markdown
---
title: "文章标题"
date: 2026-09-27
tags:
  - "标签"
---

正文……
```

push 到 `master` 后 GitHub Actions 自动部署。
