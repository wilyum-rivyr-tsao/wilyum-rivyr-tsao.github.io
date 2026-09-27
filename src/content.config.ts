import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('Notes'),
    // 正文语言（按标题中文字符占比推断），用于列表/详情页语言徽章
    lang: z.enum(['zh', 'en']),
  }),
});

export const collections = { blog };
