import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // 标签体系：无发布日期/分类概念，tags 为唯一归类方式，至少 1 个
    tags: z.array(z.string()).min(1),
    // 正文语言：both=全文中英双语（lang-zh/lang-en 双块），不显示语言徽章；zh/en=单语言，列表/详情页显示徽章
    lang: z.enum(['zh', 'en', 'both']).default('both'),
  }),
});

export const collections = { blog };
