# AGENTS.md — 项目记忆（供 AI 编码代理阅读）

> 这是 Rivyr 的 GitHub Pages 个人主页。任何 AI 编码代理（Kimi CLI 等）在此仓库工作前，请先读完本文件。

## 项目概览

- **站点**: https://wilyum-rivyr-tsao.github.io/
- **技术栈**: Astro 5（静态输出）+ 纯手写 CSS（无 Tailwind/框架依赖）+ 少量原生 JS
- **部署**: push 到 `master` → GitHub Actions（`.github/workflows/deploy.yml`，withastro/action）→ GitHub Pages（build_type=workflow）
- **风格**: 2026 现代风——深色 aurora 渐变背景、玻璃拟态 bento 卡片、鼠标追光、滚动浮现、打字机、明暗主题切换、中英双语切换
- **双语（zh-CN / en）**：默认中文；`<html data-lang="zh|en">` + `.lang-zh`/`.lang-en` 双块元素控制显隐，两种语言文本都在 HTML 中；导航栏"中/EN"按钮切换，偏好存 `localStorage('lang')`；切换时广播 `window` 的 `langchange` 事件（打字机、时钟等脚本监听）
- **LLM 友好**: `/public/llms.txt`、sitemap（@astrojs/sitemap）、语义化 HTML，改动时不得破坏这些

## 目录结构

```
src/
  consts.ts            # ⭐ 所有个人信息/介绍/技能/社交链接都在这里（{ zh, en } 双语结构，含 UI 文案表），用户最常改的文件
  content.config.ts    # 博客内容集合（glob loader, schema: title/tags/lang；tags 必填，lang: zh|en|both 默认 both，无日期/分类字段）
  content/blog/*.md    # 18 篇文章（Jekyll 迁移 + 知乎同步；新文章均 lang: both 中英双语，旧文 lang: zh|en，无 date/category）
  layouts/Base.astro   # 全站布局：导航、主题切换、语言切换、追光/滚动浮现脚本
  pages/index.astro    # 首页 bento 网格（打字机双词库、时钟随语言换 locale）
  pages/blog/index.astro      # 文章列表（平铺、按标题排序：标题 + 语言徽章（仅单语言文章）+ tags；顶部标签筛选条，纯前端 JS + ?tag= 参数）
  pages/blog/[...slug].astro  # 文章详情（语言徽章（仅单语言文章）+ tags chip 链接回列表页筛选，无日期/分类）
  styles/global.css    # 全部样式，CSS 变量主题（--bg/--accent 等），含 .lang-zh/.lang-en 显隐规则
public/                # avatar.jpg, favicon.svg, llms.txt（双语）, robots.txt
```

## 硬性约定

1. **双语（zh-CN / en）是全站要求**：UI 文案、首页介绍必须中英双语可切换；语言偏好存 localStorage；两种语言文本都要出现在 HTML 里（保持 LLM 友好，不要纯 JS 渲染单语言）。博客正文保持原文语言，标注语言标签即可。
2. 个人信息改动只动 `src/consts.ts`，不要散落硬编码。
3. 不改部署方式；不引入重型依赖（保持 Astro 零 JS 默认）。
4. 动画必须兼容 `prefers-reduced-motion`。
5. 网络：本机代理 `http://127.0.0.1:7897`（git 全局已配，npm 若失败可 `npm config set proxy`）。
6. **文章无发布日期、无分类，标签（tags）是唯一归类方式**：content schema 只有 title/tags/lang，tags 必填（至少 1 个）；front matter 也不要加 date/category；首页"文章"卡按标题排序取前 4 篇作为稳定顺序；文章详情页的 tag 链接指向 `/blog/?tag=<标签>` 触发列表页筛选；首页"N 个标签"统计由全站 tags 去重聚合。**每篇文章必须中英双语（lang: both），正文用 `<div class="lang-zh">` / `<div class="lang-en">` 双块分别包裹中文和英文全文**（div 与 markdown 内容之间留空行）；lang 为 both 的文章在列表/详情页不显示语言徽章，仅 zh/en 单语言旧文显示徽章。

## 常用命令

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # 输出到 dist/，提交前必须通过
```

## 工作流程

1. 改代码 → `npm run build` 验证通过
2. `git commit`（清晰的英文或中文 message）
3. **不要直接 push 到 master**，完成后由 Hermes 验收并推送
4. 每次完成功能后，回来更新本文件的"项目概览/约定"（如有变化）——这是对后续会话的记忆延续

## 历史

- 旧 Jekyll 站存档在 `legacy-jekyll` 分支，勿动。
