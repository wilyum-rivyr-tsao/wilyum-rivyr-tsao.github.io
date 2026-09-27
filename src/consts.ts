// ============================================================
//  个人信息配置 —— 改这里就能更新全站内容
//  所有展示文案均为 { zh, en } 双语结构（zh 为默认语言）
// ============================================================
export const SITE = {
  title: 'Rivyr',
  description: {
    zh: 'Rivyr 的个人主页：开发者，关注前端、AI 与自动化。记录项目、文章与思考。',
    en: "Rivyr's personal site — a developer into frontend, AI, and automation. Projects, articles, and notes.",
  },
  url: 'https://wilyum-rivyr-tsao.github.io',
};

// 技术栈为语言中立词汇，两种语言共用同一份
const STACK = ['TypeScript', 'React', 'Vue', 'Node.js', 'Python', 'Astro', 'Docker', 'LLM / RAG', 'n8n', 'GitHub Actions'];

export const PROFILE = {
  name: 'Rivyr',
  // 打字机效果轮播的身份标签
  roles: {
    zh: ['开发者', 'AI 爱好者', '全栈工程师', '自动化控'],
    en: ['Developer', 'AI Enthusiast', 'Full-Stack Engineer', 'Automation Lover'],
  },
  // 首页个人介绍（支持多段）
  bio: {
    zh: [
      '你好，我是 Rivyr，一名开发者。',
      '关注前端工程、AI/LLM 应用与自动化工具，喜欢把重复的事情交给代码。',
      '这里记录我的项目、文章和一路踩过的坑。',
    ],
    en: [
      "Hi, I'm Rivyr, a developer.",
      'I work on frontend engineering, AI/LLM applications, and automation — I like handing repetitive work over to code.',
      'This is where I keep my projects, articles, and the pitfalls I ran into along the way.',
    ],
  },
  location: { zh: '地球某处', en: 'Somewhere, Earth' },
  timezone: 'Asia/Shanghai',
  github: 'wilyum-rivyr-tsao',
  twitter: '9Jdi2pdPBuSApC',
  email: '', // 想公开就填，例如 'hi@example.com'
  avatar: '/avatar.jpg',
  // 技能标签云
  stack: { zh: STACK, en: STACK },
  // 首页"正在关注"卡片
  now: {
    zh: ['AI Agent 工作流', 'LLM 应用工程化', '个人知识管理'],
    en: ['AI agent workflows', 'Engineering LLM applications', 'Personal knowledge management'],
  },
};

// 全站 UI 文案（导航、卡片标题、博客页等），与个人信息一样集中维护
export const UI = {
  nav: {
    home: { zh: '首页', en: 'Home' },
    blog: { zh: '文章', en: 'Posts' },
  },
  card: {
    localTime: { zh: '本地时间', en: 'Local Time' },
    blog: { zh: '博客', en: 'Blog' },
    latestPosts: { zh: '最新文章', en: 'Latest Posts' },
    techStack: { zh: '技术栈', en: 'Tech Stack' },
    now: { zh: '正在关注', en: 'Now' },
    postsUnit: { zh: '篇文章', en: 'posts' },
    categoriesUnit: { zh: '个分类', en: 'categories' },
  },
  blogPage: {
    title: { zh: '✎ 文章', en: '✎ Posts' },
    description: {
      zh: 'Rivyr 的技术文章归档',
      en: "Archive of Rivyr's technical articles",
    },
    back: { zh: '← 返回文章列表', en: '← Back to all posts' },
  },
};
