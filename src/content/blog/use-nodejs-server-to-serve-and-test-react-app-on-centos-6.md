---
lang: en
title: "use nodejs server to serve & test react app on centos 6"
tags:
  - "nodejs"
  - "centos"
  - "react"
---

https://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/
https://expressjs.com/en/starter/installing.html

### 1. Download Node.js

You will want to download the latest stable version of Node.js, which can be done by running the command below. It runs a script that automatically steps you through the installation process. The script is downloaded directly from Joylent (the makers of Node.js) at their NodeSource repository.

``` {r, engine='', count_lines}
 cd /tmp  
 curl -sL https://rpm.nodesource.com/setup | bash -
 ```
notice here need update url flowing the instruction.

### 2. Install Node.js

Once the script detects that you do not have Node.js installed, enter the following command to begin the install via the yum package manager.

 yum install -y nodejs
