---
lang: en
title: "Github Flow"
tags:
  - "git"
  - "git-flow"
---

语义化版本：

[https://semver.org/lang/zh-CN/](https://semver.org/lang/zh-CN/)

## 主分支（长周期分支，不删除）

开发模型受到现有模型的启发。 核心仓库拥有两个主要分支，**具有无限的生命周期**：

我们认为origin/**master**是主要分支，总是反映生产就绪状态。

我们将origin/**develop**视为主要分支，始终反映了下一版本中最新的开发状态。

![](https://nvie.com/img/main-branches@2x.png)

当开发分支中的源代稳定并准备好发布时，所有更改都应以某种方式合并回master，然后使用版本号打一个Tag。

因此，每次将更改合并回master时，这就是一个新版本。 我们要对此非常严格，因此从理论上讲，我们可以使用Git的钩子脚本在次有master提交时自动部署我们的软件到我们的生产服务器上。

## 次要分支（短周期，用完即可删除）

在主要分支外，我们的开发模型使用可以各种支持分支来帮助团队成员之间的并行开发，轻松跟踪主分支，准备生产版本以及帮助快速解决生产问题(bug)。 与主要分支不同，这些分支的寿命有限，因为它们最终会被删除。

![](https://nvie.com/img/fb@2x.png)

**分支可用前缀：**

- feature/*
- release/*
- hotfix/*

### **分支说明:**

**feature分支**

分支来自：

`develop`

必须合并回：

`develop`

命名：

feature/xxx

用于为即将发布或将来的版本开发新功能，只要该功能处于开发阶段，它就会存在，但最终会合并回起始分支（以便将新功能添加到即将发布的版本中）或丢弃（在功能令人失望的情况下）。

**创建develop分支**：

1 从develop打新出feature/fema

2 开发完成合并回develop分支

    $ git checkout -b feature/fema develop 

2 开发完成合并回develop分支

    $ git checkout develop
    
    $ git merge --no-ff feature/fema 
    --no-ff
    标志使合并始终创建新的提交对象。
    这样可以避免丢失有关功能分支提交的历史的信息。
    
    $ git branch -d feature/fema 删除分支
    
    $ git push origin develop

**—no-if**

![](https://nvie.com/img/merge-without-ff@2x.png)

**release分支**

分支来自:

`develop`

必须合并到:

`develop` 和 `master`

分支命名:

`release/xxx`

**release**分支支持准备新的生产版本。他们允许最后一刻,小修改和小错误修复。**禁止加入新的功能，新功能必须在下一个版本开发周期内加入。**

打release分支的前提条件：

1.大版本号已经确定（版本功能已确定）

2.develop分支已经具备当前版本所有功能（所有feature分支已经合并入develop）

release分支是从develop创建的。 例如，假设版本1.1.5是当前的生产版本，我们即将推出一个大版本。 开发状态已经为“下一个版本”做好了准备，我们已经决定这将成为版本1.2（而不是1.1.6或2.0）。 因此，我们分支并为发布分支提供反映新版本号的名称：

创建release分支：

    $ git checkout -b release/1.2 develop
    $ git commit -a -m "Bumped version number to 1.2"

完成release分支必须先合并到master然后为此版本创建tag：

    $ git checkout master
    $ git merge --no-ff release-1.2
    $ git tag -a 1.2

由于release分支可能有小修改所以我们也需要将其合并回develop（develop在此期间不能有修改）：

    $ git checkout develop
    $ git merge --no-ff release-1.2

一旦上述步骤确认已经完成，我们必须移除此release分支

    $ git branch -d release-1.2

### **hotfix分支：**

分支来自

`master`

必须合并回：

`develop` and `master`

命名：

`hotfix/xxx`

hotfix分支非常像release分支，因为它们也是为了准备新的生产版本，尽管是计划外的。 它们源于必须立即采取实际生产版本的不良状态。 当必须立即解决生产版本中的严重错误时，可以从生产版本的master分支上的Tag创建hotfix分支。

![](https://nvie.com/img/hotfix-branches@2x.png)

因此团队成员在develop分支上的工作可以继续，而另一个人正在准备快速修复发布版本。

创建hotfix分支：

从master分支创建修补程序分支。 例如，假设版本1.2是当前正在运行的生产版本，并且由于严重的错误而导致麻烦。 但是develop的功能还不稳定。 然后我们可以创建hotfix并开始修复问题：

    $ git checkout -b hotfix-1.2.1 master
    修复完成
    $ git commit -a -m "Bumped version number to 1.2.1"

不要忘了更新版本号

完成hotfix分支：

完成后，bugfix需要合并回master，但也需要合并回develop，以保证bugfix也包含在下一个版本中。 这与发布分支的完成方式完全相似。

    $ git checkout master
    $ git merge --no-ff hotfix-1.2.1
    
    $ git tag -a 1.2.1

    $ git checkout develop
    $ git merge --no-ff hotfix-1.2.1
    

此处规则的一个例外是，当一个release支当前存在时，需要将修补程序更改合并到该release分支中，而不是develop分支。 在发布分支完成时，将错误修复反向合并到发布分支中最终将导致错误修复合并到develop分支中。 （如果立即开发工作需要这个错误修复，并且不能等待发布分支完成，您可以将错误修复同时合并到develop和release分支中。）

最后删除分支

    $ git branch -d hotfix-1.2.1
