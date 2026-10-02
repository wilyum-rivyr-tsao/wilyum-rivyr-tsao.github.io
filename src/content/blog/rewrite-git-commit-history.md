---
title: "改写git 提交历史"
lang: zh
tags:
  - "git"
---

- 重组git commit 的三种方式

- commit --amend 

- 合并staged的改变(git add 之后的改变)，到前一个commit（而不是新建一个commit）。

- 好处

- 后悔提交了什么改变可以撤回

- 提交信息写错了可以更改

- 注意：

- 不要修改公共的commits

- 因为被修改的commit如同新的commit

- 这和重置公共的提交无异

- 容易造成其他开发者的困惑

- 几种演示

- 直接修改提交信息

- git commit --amend -m "提交信息"

- 编辑文件并git add 之后

- git commit --amend --no-edit

- no-edit 表示不修改提交信息

持续更新中....敬请期待

- git rebase 

- git reflog

![](https://pic2.zhimg.com/v2-7630ed9575423729fffa249435565bc3_r.jpg)

已开启送礼物所属专栏 · 2020-09-10 23:40 更新 (https://zhuanlan.zhihu.com/c_1287326683671269376) 

![](https://picx.zhimg.com/v2-c5be1695771c4f9b442b5bde56e5e8e0_720w.jpg?source=172ae18b)

Git技艺

![](https://picx.zhimg.com/v2-4d0762d913b4e273480434b40ba308ff_l.jpg?source=172ae18b)

William Tso2 篇内容 · 5 赞同 (https://zhuanlan.zhihu.com/c_1287326683671269376) 最热内容 ·oh shit! git reset --hard 如何找回？ (https://zhuanlan.zhihu.com/c_1287326683671269376) 编辑于 2020-09-10 23:44Git (//www.zhihu.com/topic/19557710) Git 团队协作（书籍） (//www.zhihu.com/topic/20823682) GitHub (//www.zhihu.com/topic/19566035) ofd文件用什么可以打开？有粉丝发私信问ofd是什么格式？ofd文件怎么打开？因为她邮箱里收到了几份文件，都是ofd的，自己之前没处理过。好，我今天把ofd的前世今生都讲一遍，希望大家以后没有类似的困惑。OFD...有粉丝发私信问ofd是什么格式？ofd文件怎么打开？因为她邮箱里收到了几份文件，都是ofd的，自己之前没处理过。好，我今天把ofd的前世今生都讲一遍，希望大家以后没有类似的困惑。OF...

![](https://pic4.zhimg.com/v2-0b2eda949d62236d1e2be0adf92c8f99.webp)

万兴PDF100+热议 (https://www.zhihu.com/question/293223895/answer/3326701163)
