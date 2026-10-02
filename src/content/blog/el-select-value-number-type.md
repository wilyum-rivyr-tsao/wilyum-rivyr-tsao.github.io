---
title: "el-select的value需要Number类型你特么就不能报个错么"
lang: zh
tags:
  - "vue"
  - "element-ui"
---

el-select  给value赋值只显示id

按道理来说，我给select一个value 他应该显示真正的值吧。可是他偏不。我的select 又在一个组件里面。选项数据是动态加载的。我在外部组件created的时候就赋值肯定是不行的因为备选的列表还没出来呢，当备选的列表出来后我从组件外部赋值value还是不行。怎么回事呢。嘿他妈的，el-select需要个Number类型。而传过来的是个String类型，我就想了element 你就特么不能报个错么
发布于 2020-11-27 14:11ElementUI (//www.zhihu.com/topic/20076294) 程序员0基础入门大模型的学习路线！0基础入门大模型，transformer、bert这些是要学的，但是 你的第一口不一定从这里咬下去。真的没有必要一上来就把时间精力全部投入到复杂的理论、各种晦涩的数学公式还有编程语言上，这样...0基础入门大模型，transformer、bert这些是要学的，但是 你的第一口不一定从这里咬下去。真的没有必要一上来就把时间精力全部投入到复杂的理论、各种晦涩的数学公式还有编程语言上，这...

![](https://pic4.zhimg.com/v2-1f4740e0798e0fc5eac8c4cc7dae9fc2.webp)

AI技能研究所50+咨询 (https://zhuanlan.zhihu.com/p/31864213680)
