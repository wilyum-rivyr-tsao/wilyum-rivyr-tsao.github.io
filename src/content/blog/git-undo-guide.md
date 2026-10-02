---
lang: both
title:
    zh: "Git 后悔药：改写历史与误删恢复"
    en: "Git Undo Guide: Rewriting History & Recovering Lost Commits"
tags:
  - "git"
---

<div class="lang-zh">

这是一篇 Git "后悔药"合集，收录了三个救命场景：提交后发现要改（改写历史）、`reset --hard` 误删工作（reflog 恢复）、把已有本地目录关联到远程仓库。每节都给出可直接复制的命令。

## 改写提交历史：commit --amend

场景：刚提交完就发现提交信息写错了，或者漏了文件不想为此新建一个 commit——用 `--amend` 把暂存区的改动合并进上一个提交。

只改提交信息：

```bash
git commit --amend -m "提交信息"
```

把改好的文件 `git add` 之后，合并进上一个提交且不改提交信息：

```bash
git commit --amend --no-edit
```

注意：**不要修改已经推送出去的公共 commit**。被 amend 的 commit 等同于一个全新的 commit，效果和重置公共提交无异，很容易让其他协作者困惑。

## git reset --hard 误删恢复

场景：`git reset --hard` 之后发现提交没了、工作区也被清空了——别慌，Git 的 reflog 记录了 HEAD 的每一次移动，被 reset 的提交还在。

先查看历史操作日志，找到想恢复的 commit：

```bash
git reflog
```

在日志里找到需要的 commit 码，然后基于它检出分支：

```bash
git checkout -b 你的分支名 <commit码>
```

被 reset 的提交就找回来了。

## 已有目录关联远程仓库

场景：本地已有一堆代码文件（不是 clone 下来的），想把它指向一个已有的远程仓库并拉取历史。直接 `git pull` 会报 `fatal: refusing to merge unrelated histories`，需要加 `--allow-unrelated-histories`。

```bash
$ git init

$ git remote add origin https://github.com/xxx/xxx.git

$ git branch --set-upstream-to=origin/<branch> master

$ git pull --allow-unrelated-histories
```

注意这里用的是 https 而不是 ssh 地址——没有配置 SSH key 的机器上 https 才能直接用；配过 key 的话用 ssh 也可以。

</div>

<div class="lang-en">

A collection of Git "undo buttons" for three life-saving scenarios: fixing a commit you just made (rewriting history), recovering work lost to `reset --hard` (via reflog), and pointing an existing local folder at a remote repository. Every section has copy-paste-ready commands.

## Rewriting History with commit --amend

When to use: right after committing, you notice a typo in the message or a missing file — and you don't want a whole new commit for it. `--amend` folds your staged changes into the previous commit.

To fix only the commit message:

```bash
git commit --amend -m "提交信息"
```

To merge edited files into the previous commit without touching the message, `git add` them first, then:

```bash
git commit --amend --no-edit
```

One warning: **never amend commits that have already been pushed.** An amended commit is effectively a brand-new commit — no different from rewriting shared history — and it will confuse every collaborator on the branch.

## Recovering from git reset --hard

When to use: you ran `git reset --hard` and your commit — along with the working tree — seems gone. Don't panic: Git's reflog records every move HEAD makes, so the reset commit is still there.

First, inspect the history of operations and find the commit you want:

```bash
git reflog
```

Find the commit hash you need, then check out a branch from it:

```bash
git checkout -b your-branch-name <commit-hash>
```

The commits lost to the reset are back.

## Pointing an Existing Folder at a Remote Repo

When to use: you have a local folder full of code (not a clone) and want to hook it up to an existing remote repository and pull its history. A plain `git pull` fails with `fatal: refusing to merge unrelated histories` — that's what `--allow-unrelated-histories` is for.

```bash
$ git init

$ git remote add origin https://github.com/xxx/xxx.git

$ git branch --set-upstream-to=origin/<branch> master

$ git pull --allow-unrelated-histories
```

Note the remote URL uses https rather than ssh — https works out of the box on machines without SSH keys configured, but ssh is fine too if you've set one up.

</div>
