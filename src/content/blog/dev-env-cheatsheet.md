---
lang: both
title: "开发环境速查：PATH、SSH 与终端欢迎语"
tags:
  - "环境配置"
  - "macos"
  - "linux"
---

<div class="lang-zh">

这是一篇开发环境配置速查合集，收录了配新机器时最常查的三件事：macOS 上查看与设置环境变量（含 PATH 的临时/永久修改）、Ubuntu 上开启 SSH 服务、CentOS 上定制登录欢迎语。

## macOS 环境变量与 PATH

场景：新装 Mac 或换了 shell 之后，要确认环境变量是否生效、临时调试某个变量，或者把自定义路径永久写进 PATH。

查看当前所有环境变量用 `printenv`；只看某个变量用 `echo $变量名`：

```bash
HIMANSHUs-MacBook-Pro:~ himanshu$ echo $JAVA_HOME
/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
```

临时修改（只对当前终端会话生效，关掉就没了）：

```bash
HIMANSHUs-MacBook-Pro:~ himanshu$ export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
```

PATH 以冒号分割，前几个值是系统默认值，不要动，只在末尾追加自己的路径：

```bash
PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:你需要的路径
```

永久修改：在当前用户 HOME 目录下编辑 `.bash_profile`（推荐用 vim 或 nano），加入：

```bash
export PATH="/usr/local/mysql/bin:$PATH"
```

如果装了 oh-my-zsh，则编辑 `~/.zshrc`，在最后一行加入同样的 `export` 语句。把 `/usr/local/mysql/bin` 替换成你需要的路径即可。想调整 PATH 里的优先级顺序，就改变 `$PATH` 在语句中的位置，比如放到前面表示后置追加：

```bash
export PATH="$PATH:/usr/local/mysql/bin"
```

## Ubuntu 开启 SSH 服务

场景：新装的 Ubuntu 机器默认没有 SSH 服务，需要远程登录时，三步装好并启动。先把默认配置备份一份再动它。

```bash
sudo apt-get install openssh-server
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.factory-defaults
sudo service ssh start
```

## CentOS 登录欢迎语（motd）

场景：多人共用的服务器，登录时想一眼看到关键信息（比如应用部署目录、注意事项），写进 `/etc/motd` 即可，每次登录终端都会展示。

```bash
$ vim /etc/motd
```

写点有用的内容，比如应用目录在哪、这台机器是干什么的。

</div>

<div class="lang-en">

A cheat sheet for setting up a fresh dev machine, covering the three things you look up most often: viewing and setting environment variables on macOS (including temporary and permanent PATH changes), enabling SSH on Ubuntu, and customizing the login greeting on CentOS.

## Environment Variables and PATH on macOS

When to use: after setting up a new Mac or switching shells, you want to check whether your environment variables took effect, tweak one temporarily for debugging, or permanently add a custom path to PATH.

Use `printenv` to list all current environment variables; to inspect a single one, `echo $VARIABLE_NAME`:

```bash
HIMANSHUs-MacBook-Pro:~ himanshu$ echo $JAVA_HOME
/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
```

Temporary change (only lives for the current terminal session):

```bash
HIMANSHUs-MacBook-Pro:~ himanshu$ export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
```

PATH is colon-separated; the first few entries are system defaults — leave them alone and only append your own paths:

```bash
PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:your/custom/path
```

For a permanent change, edit `.bash_profile` in your home directory (vim or nano both work) and add:

```bash
export PATH="/usr/local/mysql/bin:$PATH"
```

If you use oh-my-zsh, edit `~/.zshrc` instead and append the same `export` line at the end. Replace `/usr/local/mysql/bin` with whatever path you need. To change precedence within PATH, move the `$PATH` token around — putting it first appends your path at the end:

```bash
export PATH="$PATH:/usr/local/mysql/bin"
```

## Enabling SSH on Ubuntu

When to use: a fresh Ubuntu install ships without an SSH server, so remote login fails. Three commands install and start it — back up the default config before touching it.

```bash
sudo apt-get install openssh-server
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.factory-defaults
sudo service ssh start
```

## CentOS Login Greeting (motd)

When to use: on a shared server, you want everyone to see key info at login — where the app lives, what this box is for, house rules. Put it in `/etc/motd` and it prints on every login.

```bash
$ vim /etc/motd
```

Write something genuinely useful, such as where your application directory is.

</div>
