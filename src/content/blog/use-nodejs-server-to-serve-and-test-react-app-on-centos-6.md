---
lang: both
title: "在 CentOS 6 上用 Node.js 服务器部署并测试 React 应用"
tags:
  - "nodejs"
  - "centos"
  - "react"
---

<div class="lang-zh">

参考链接：

- [Linux screen 教程](https://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/)
- [Express 安装指南](https://expressjs.com/en/starter/installing.html)

### 1. 下载 Node.js

建议下载 Node.js 的最新稳定版，可以运行下面的命令完成。该命令会执行一个脚本，自动引导你走完安装流程。脚本直接来自 NodeSource 仓库。

```bash
cd /tmp
curl -sL https://rpm.nodesource.com/setup | bash -
```

注意：这里的 URL 需要按照官方说明更新到对应版本。

### 2. 安装 Node.js

脚本检测到系统没有安装 Node.js 后，执行以下命令通过 yum 包管理器开始安装：

```bash
yum install -y nodejs
```

### 3. 部署与测试

安装完成后，把 React 应用的构建产物（如 `build/` 目录）上传到服务器，用一个简单的 Express 静态服务器托管，再用 `screen` 让进程在退出 SSH 后保持运行，即可在 CentOS 6 上随时访问和测试应用。

</div>

<div class="lang-en">

References:

- [Linux screen tutorial](https://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/)
- [Express installation guide](https://expressjs.com/en/starter/installing.html)

### 1. Download Node.js

You will want to download the latest stable version of Node.js, which can be done by running the command below. It runs a script that automatically steps you through the installation process. The script is downloaded directly from the NodeSource repository.

```bash
cd /tmp
curl -sL https://rpm.nodesource.com/setup | bash -
```

Note: the URL here needs to be updated to the desired version following the official instructions.

### 2. Install Node.js

Once the script detects that you do not have Node.js installed, enter the following command to begin the install via the yum package manager:

```bash
yum install -y nodejs
```

### 3. Deploy and Test

With Node.js installed, upload your React app's build output (e.g. the `build/` directory) to the server, serve it with a simple Express static server, and keep the process alive after SSH logout with `screen` — the app is then accessible for testing on CentOS 6 at any time.

</div>
