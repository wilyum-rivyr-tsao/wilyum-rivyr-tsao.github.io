---
lang: en
title: "set-existsing-folder-point-to-remote-git"
tags:
  - "git"
  - "github"
---

``` bash
1. $ git init

2. $ git remote add origin https://github.com/xxx/xxx.git

3. $ git branch --set-upstream-to=origin/<branch> master

4. $ git pull --allow-unrelated-histories
```
**watch out** here's needs https:// not ssh, in case you don't have the SSH keys. but you can also use ssh if you'd prefer.

In my case, error was just `fatal: refusing to merge unrelated histories` on every especially first pull request after remotely adding a git repo.
Using `--allow-unrelated-histories` flag worked with pull request in this way
