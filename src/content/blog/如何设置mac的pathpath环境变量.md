---
lang: zh
title: "如何设置mac的PATH（$PATH）环境变量"
tags:
  - "macos"
  - "环境变量"
---

### 临时修改当前命令行的的环境变量
命令行键入如下命令，意思是直接设置PATH值。  
其以冒号分割，前几个值为默认值，不应该修改。
```bash
PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:你需要的路径
```

### 永久修改
在当前用户HOME文件夹下创建 .bash_profile
推荐命令
```bash
vim .bash_profile
或者
nano .bash_profile
```
vim 和 nano 是 mac 命令行的代码编辑器没有的话推荐安装其。

在 .bash_profile 假如如下代码
```bash
export PATH="/usr/local/mysql/bin:$PATH"
````
**/usr/local/mysql/bin 替换成你需要的地址**

如果你安装了oh my zsh,请在home 文件夹下编辑.zshrc文件
```bash
vim ~/.zshcr
最后一行加入
export PATH="/usr/local/mysql/bin:$PATH"
```
**/usr/local/mysql/bin 替换成你需要的地址**

如果需要调整PATH串的顺序，请改变$PATH字段的位置例如
```bash
export PATH="$PATH:/usr/local/mysql/bin"
```


