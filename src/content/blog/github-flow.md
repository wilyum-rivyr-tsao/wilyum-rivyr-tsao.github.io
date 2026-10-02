---
lang: both
title: "Git Flow 分支模型"
tags:
  - "git"
  - "git-flow"
---

<div class="lang-zh">

语义化版本：[https://semver.org/lang/zh-CN/](https://semver.org/lang/zh-CN/)

## 主分支（长周期分支，不删除）

核心仓库拥有两个主要分支，**具有无限的生命周期**：

- origin/**master** 是主要分支，总是反映生产就绪状态。
- origin/**develop** 是主要分支，始终反映下一版本的最新开发状态。

![](https://nvie.com/img/main-branches@2x.png)

当 develop 分支中的代码稳定并准备好发布时，所有更改都应以某种方式合并回 master，然后使用版本号打一个 Tag。

因此，每次将更改合并回 master 时，就是一个新版本。我们要对此非常严格，因此从理论上讲，可以使用 Git 的钩子脚本在每次有 master 提交时自动部署软件到生产服务器上。

## 次要分支（短周期，用完即可删除）

在主要分支之外，开发模型使用各种支持分支来帮助团队成员之间并行开发、轻松跟踪主分支、准备生产版本以及快速解决生产问题。与主要分支不同，这些分支的寿命有限，因为它们最终会被删除。

![](https://nvie.com/img/fb@2x.png)

**分支可用前缀：**

- feature/*
- release/*
- hotfix/*

### feature 分支

- 分支来自：`develop`
- 必须合并回：`develop`
- 命名：`feature/xxx`

用于为即将发布或将来的版本开发新功能。只要该功能处于开发阶段，它就会存在，但最终会合并回 develop（将新功能加入即将发布的版本）或被丢弃（功能不达预期时）。

**创建与合并 feature 分支**：

```bash
# 1. 从 develop 拉出 feature/fema
$ git checkout -b feature/fema develop

# 2. 开发完成后合并回 develop
$ git checkout develop
$ git merge --no-ff feature/fema
# --no-ff 标志使合并始终创建新的提交对象，
# 这样可以避免丢失功能分支的历史信息。

# 3. 删除分支并推送
$ git branch -d feature/fema
$ git push origin develop
```

**--no-ff 的效果**：

![](https://nvie.com/img/merge-without-ff@2x.png)

### release 分支

- 分支来自：`develop`
- 必须合并到：`develop` 和 `master`
- 命名：`release/xxx`

release 分支用于准备新的生产版本，允许最后一刻的小修改和小 bug 修复。**禁止加入新功能，新功能必须在下一个版本开发周期内加入。**

打 release 分支的前提条件：

1. 大版本号已经确定（版本功能已确定）
2. develop 分支已经具备当前版本所有功能（所有 feature 分支已经合并入 develop）

例如，假设版本 1.1.5 是当前的生产版本，我们即将推出一个大版本。develop 的状态已经为"下一个版本"做好了准备，我们决定它将成为版本 1.2（而不是 1.1.6 或 2.0）。因此创建分支并以新版本号命名：

```bash
# 创建 release 分支
$ git checkout -b release/1.2 develop
$ git commit -a -m "Bumped version number to 1.2"
```

release 分支完成后必须先合并到 master 并为此版本打 tag：

```bash
$ git checkout master
$ git merge --no-ff release-1.2
$ git tag -a 1.2
```

由于 release 分支上可能有小修改，所以也需要将其合并回 develop：

```bash
$ git checkout develop
$ git merge --no-ff release-1.2
```

确认上述步骤完成后，删除 release 分支：

```bash
$ git branch -d release-1.2
```

### hotfix 分支

- 分支来自：`master`
- 必须合并回：`develop` 和 `master`
- 命名：`hotfix/xxx`

hotfix 分支非常像 release 分支，因为它们也是为了准备新的生产版本——尽管是计划外的。当生产版本中的严重 bug 必须立即解决时，可以从 master 分支上对应的 tag 创建 hotfix 分支。

![](https://nvie.com/img/hotfix-branches@2x.png)

这样团队成员在 develop 分支上的工作可以继续，而另一个人同时准备生产版本的快速修复。

**创建 hotfix 分支**：从 master 创建。例如版本 1.2 是当前生产版本，因严重 bug 造成麻烦，而 develop 上的功能还不稳定，这时可以创建 hotfix 分支开始修复：

```bash
$ git checkout -b hotfix-1.2.1 master
# 修复完成后别忘了更新版本号
$ git commit -a -m "Bumped version number to 1.2.1"
```

**完成 hotfix 分支**：修复需要合并回 master，同时也需要合并回 develop，以保证修复包含在下一个版本中。这与 release 分支的完成方式完全相似：

```bash
$ git checkout master
$ git merge --no-ff hotfix-1.2.1
$ git tag -a 1.2.1

$ git checkout develop
$ git merge --no-ff hotfix-1.2.1
```

此处规则的一个例外：当当前存在 release 分支时，hotfix 的更改需要合并到该 release 分支，而不是 develop。release 分支完成时，修复最终会随之合并到 develop。（如果开发工作立即需要这个修复、等不及 release 完成，可以同时合并到 develop 和 release 分支。）

最后删除分支：

```bash
$ git branch -d hotfix-1.2.1
```

</div>

<div class="lang-en">

Semantic versioning: [https://semver.org/](https://semver.org/)

## Main Branches (long-lived, never deleted)

The central repository holds two main branches with an **infinite lifetime**:

- origin/**master** — the main branch that always reflects a production-ready state.
- origin/**develop** — the main branch that always reflects the latest development state for the next release.

![](https://nvie.com/img/main-branches@2x.png)

When the code on develop is stable and ready to ship, all changes are merged back into master one way or another and tagged with a version number.

So every merge back into master is a new release by definition. We tend to be very strict about this — in theory, a Git hook script could automatically deploy the software to production servers on every master commit.

## Supporting Branches (short-lived, deleted after use)

Alongside the main branches, the model uses a variety of supporting branches to enable parallel development between team members, ease tracking of features, prepare production releases, and quickly fix live production problems. Unlike the main branches, these branches always have a limited lifetime — they are removed eventually.

![](https://nvie.com/img/fb@2x.png)

**Available branch prefixes:**

- feature/*
- release/*
- hotfix/*

### Feature branches

- Branch off from: `develop`
- Must merge back into: `develop`
- Naming: `feature/xxx`

Used to develop new features for the upcoming or a distant future release. A feature branch lives as long as the feature is in development, but will eventually be merged back into develop (to add the new feature to the upcoming release) or discarded (if the experiment disappoints).

**Creating and merging a feature branch:**

```bash
# 1. branch feature/fema off develop
$ git checkout -b feature/fema develop

# 2. when done, merge back into develop
$ git checkout develop
$ git merge --no-ff feature/fema
# the --no-ff flag forces the merge to always create a new commit object,
# preserving the history of the feature branch.

# 3. delete the branch and push
$ git branch -d feature/fema
$ git push origin develop
```

**The effect of --no-ff:**

![](https://nvie.com/img/merge-without-ff@2x.png)

### Release branches

- Branch off from: `develop`
- Must merge back into: `develop` and `master`
- Naming: `release/xxx`

Release branches support the preparation of a new production release. They allow for last-minute dotting of i's and crossing of t's — minor bug fixes and metadata bumps. **No new features may go in; new features must wait for the next development cycle.**

Prerequisites for cutting a release branch:

1. The target version number is decided (the release scope is fixed)
2. develop already contains everything for the release (all feature branches merged)

For example, say version 1.1.5 is the current production release and we have a big release coming up. The state of develop is ready for the "next release" and we've decided this becomes version 1.2 (rather than 1.1.6 or 2.0). So we branch off and give the release branch a name reflecting the new version number:

```bash
# create the release branch
$ git checkout -b release/1.2 develop
$ git commit -a -m "Bumped version number to 1.2"
```

When a release branch is finished, it is merged into master first and tagged:

```bash
$ git checkout master
$ git merge --no-ff release-1.2
$ git tag -a 1.2
```

Because the release branch may have received small fixes, it must also be merged back into develop:

```bash
$ git checkout develop
$ git merge --no-ff release-1.2
```

Once everything above is done, remove the release branch:

```bash
$ git branch -d release-1.2
```

### Hotfix branches

- Branch off from: `master`
- Must merge back into: `develop` and `master`
- Naming: `hotfix/xxx`

Hotfix branches are very much like release branches — they prepare a new production release, albeit an unplanned one. When a critical bug in a production version must be resolved immediately, a hotfix branch is created from the corresponding tag on master.

![](https://nvie.com/img/hotfix-branches@2x.png)

This way, the rest of the team can keep working on develop while one person prepares the quick production fix.

**Creating a hotfix branch:** branch off master. Say version 1.2 is the current production release and a severe bug is causing trouble, while develop is still unstable — we create a hotfix branch and start fixing:

```bash
$ git checkout -b hotfix-1.2.1 master
# after the fix, don't forget to bump the version number
$ git commit -a -m "Bumped version number to 1.2.1"
```

**Finishing a hotfix branch:** the fix must be merged back into master, but also into develop, so the fix is included in the next release as well. This is exactly like finishing a release branch:

```bash
$ git checkout master
$ git merge --no-ff hotfix-1.2.1
$ git tag -a 1.2.1

$ git checkout develop
$ git merge --no-ff hotfix-1.2.1
```

One exception to the rule: when a release branch currently exists, hotfix changes must be merged into that release branch instead of develop. The fix will eventually reach develop when the release branch is finished. (If work on develop immediately requires the fix and cannot wait for the release, you may merge it into both develop and the release branch.)

Finally, delete the branch:

```bash
$ git branch -d hotfix-1.2.1
```

</div>
