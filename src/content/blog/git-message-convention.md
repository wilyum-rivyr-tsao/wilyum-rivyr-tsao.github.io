---
lang: en
title: "git message convention"
category: "git"
tags:
  - "git"
---

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

每个提交消息由标题，正文和页脚组成。 标头具有特殊格式，包括类型，作用域和主题：
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

header 是必需的，header 的作用域是可选的。

为了在GitHub以及各种git工具中更容易阅读消息，提交消息的任何行都不能超过100个字符！ 

页脚应包含对问题的结束引用（如果有）。

Samples: (even more [samples](https://github.com/angular/angular/commits/master))

例子
```
docs(changelog): update changelog to beta.5
```
```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### 回复
如果提交回复了之前的提交，它应该以revert：开头，然后是回复的提交的header。 在正文中它应该说：`这是回复提交<提交的哈希值>`。其中哈希是被还原的提交的SHA256值。

### Type
Must be one of the following:

如下是提交类型

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)

  影响构建系统或外部依赖项的更改（示例范围：gulp，broccoli，npm）

* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)

  我们的CI（持续集成）配置文件和脚本的更改（示例范围：Travis，Circle，BrowserStack，SauceLabs）

* **docs**: Documentation only changes

  对文档做出的修改

* **feat**: A new feature

  新功能

* **fix**: A bug fix

  修复bug

* **perf**: A code change that improves performance

  改进性修改

* **refactor**: A code change that neither fixes a bug nor adds a feature

  重构：既不是修复bug也不是添加新属性

* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)

  代码风格修改，并未影响代码效果

* **test**: Adding missing tests or correcting existing tests

  添加测试或矫正测试

### Scope
The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages.

The following is the list of supported scopes:



* **animations**
* **common**
* **compiler**
* **compiler-cli**
* **core**
* **elements**
* **forms**
* **http**
* **language-service**
* **platform-browser**
* **platform-browser-dynamic**
* **platform-server**
* **platform-webworker**
* **platform-webworker-dynamic**
* **router**
* **service-worker**
* **upgrade**

There are currently a few exceptions to the "use package name" rule:

* **packaging**: used for changes that change the npm package layout in all of our packages, e.g.
  public path changes, package.json changes done to all packages, d.ts file/format changes, changes
  to bundles, etc.
* **changelog**: used for updating the release notes in CHANGELOG.md
* **docs-infra**: used for docs-app (angular.io) related changes within the /aio directory of the
  repo
* none/empty string: useful for `style`, `test` and `refactor` changes that are done across all
  packages (e.g. `style: add missing semicolons`) and for docs changes that are not related to a
  specific package (e.g. `docs: fix typo in tutorial`).

### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

该主题包含对变更的简洁描述：

使用命令式的语句（用动词开头 Add Remove Change ect.）现在时：“change”而非“changed”或“changes”

英文不要把第一个字母大写
最后没有句号（。）

#### Capitalize the subject line
首字母大写

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

body应该包括改变的动机，并将其与之前的行为进行对比。

#### Capitalize the subject line
首字母大写
#### Use the body to explain what and why vs. how
写明提交的是什么以及为什么提交以及如何做出的的更改
This commit from Bitcoin Core is a great example of explaining what changed and why:

```
   Simplify serialize.h's exception handling

   Remove the 'state' and 'exceptmask' from serialize.h's stream
   implementations, as well as related methods.

   As exceptmask always included 'failbit', and setstate was always
   called with bits = failbit, all it did was immediately raise an
   exception. Get rid of those variables, and replace the setstate
   with direct exception throwing (which also removes some dead
   code).

   As a result, good() is never reached after a failure (there are
   only 2 calls, one of which is in tests), and can just be replaced
   by !eof().

   fail(), clear(n) and exceptions() are just never called. Delete
   them.
```
Just focus on making clear the reasons why you made the change in the first place—the way things worked before the change (and what was wrong with that), the way they work now, and why you decided to solve it the way you did.
明确你做出改变的原因 - 改变之前的程序是如何运作的（程序有什么问题），他们现在的工作方式，以及为什么你决定修改他们以你是如何解决的。



### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

页脚应包含有关Breaking Changes的任何信息。
突破性变化应以“BREAKING CHANGE”一词开头：带有一个或两个换行符。 然后将其余的提交消息用于此目的。

### Examples

示例

```
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead

```

```
feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected

New directives for proper binding these attributes in older browsers (IE).
Added coresponding description, live examples and e2e tests.

Closes #351

style($location): add couple of missing semi colons

docs(guide): updated fixed docs from Google Docs

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace

```

```

feat($compile): simplify isolate scope bindings

Changed the isolate scope binding options to:
  - @attr - attribute binding (including interpolation)
  - =model - by-directional model binding
  - &expr - expression execution binding

This change simplifies the terminology as well as
number of choices available to the developer. It
also supports local name aliasing from the parent.

BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```



```
feat(*):Submit cart to The user cart when user login(/login)

  What: Add submit cart function subCart() to login module

  Why : Cart info should not lost when anomous user login

  How : read cart info from cookie and push it to server.

  Changes to be committed:
       new file:   _posts/Front-end/2018-09-10-git-message-template.md

```
