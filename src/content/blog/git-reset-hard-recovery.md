---
title: "oh shit! git reset --hard 如何找回？"
lang: zh
tags:
  - "git"
---

```
git reflog
```

![](https://pic1.zhimg.com/v2-c40efde7bb53b7a05b7f75dde97f3336_r.jpg)

顾名思义git reflog就是查看过去我们git的日志。

在日志中找到我们需要的commit。

然后Git checkout -b 你的commit码。

好了现在被reset的提交找回来了。

**以下文字纯属娱乐 **

解决git reset --hard如何找回的问题，是非常非常重要的。 

每个程序员都不得不面对这个问题。 在面对这个问题时， 从这个角度来看， 本人也是经过了深思熟虑，在每个日日夜夜思考这个问题。 

对我个人而言，git reset --hard不仅仅是一个重大的事件，还可能会改变我的人生。 一般来说， git reset --hard ，到底应该如何解决。

已开启送礼物所属专栏 · 2020-09-10 23:40 更新 (https://zhuanlan.zhihu.com/c_1287326683671269376) 

![](https://pica.zhimg.com/v2-c5be1695771c4f9b442b5bde56e5e8e0_720w.jpg?source=172ae18b)

Git技艺

![](https://picx.zhimg.com/v2-4d0762d913b4e273480434b40ba308ff_l.jpg?source=172ae18b)

William Tso2 篇内容 · 5 赞同 (https://zhuanlan.zhihu.com/c_1287326683671269376) 最热内容 ·改写git 提交历史 (https://zhuanlan.zhihu.com/c_1287326683671269376) 发布于 2020-09-10 09:52Git (//www.zhihu.com/topic/19557710) GitHub (//www.zhihu.com/topic/19566035) Git 团队协作（书籍） (//www.zhihu.com/topic/20823682) 怎么复习信息系统项目管理师？“软考高项通关速览：从零到拿证的实战地图”这篇攻略为你划清备考迷雾：考试结构：综合知识：75道选择题（项目管理+时...“软考高项通关速览：从零到拿证的实战地图”这篇攻略为你划清备考迷雾：考试结构：综合知识：75道选择题（项目管理+时...

![](https://pic4.zhimg.com/v2-e2b2dc65ef024e0bb84f700e18453418.webp)

乐凯项目管理 (https://www.zhihu.com/question/285411826/answer/127590858695)
