---
title: "Setting up Environment Variables in MacOS Sierra"
date: 2017-04-25
category: "Environment"
tags:
  - "Environment"
---

#### Displaying current Environment Variables
```js
**printenv**
```
However, for displaying the value of any specific environment variable run the echo $[variable name] on the terminal, as shown below.

```bash
HIMANSHUs-MacBook-Pro:~ himanshu$ echo $JAVA_HOME
/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
```
Setting temporary environment variable using terminal

```bash
HIMANSHUs-MacBook-Pro:~ himanshu$ export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
```


