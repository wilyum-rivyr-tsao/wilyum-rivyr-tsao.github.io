---
lang: both
title: "Git 提交信息规范"
tags:
  - "git"
  - "提交规范"
---

<div class="lang-zh">

## 提交信息格式

每条提交信息由**标题（header）**、**正文（body）**和**页脚（footer）**组成。标题有特殊格式，包含**类型（type）**、**作用域（scope）**和**主题（subject）**：

```
<type>(<scope>): <subject>
<空行>
<body>
<空行>
<footer>
```

标题是必填的，作用域是可选的。

提交信息的任何一行都不能超过 100 个字符，这样在 GitHub 和各种 git 工具中都更易读。

页脚应包含对 issue 的关闭引用（如果有的话）。

示例（更多示例可参考 [Angular 的提交历史](https://github.com/angular/angular/commits/master)）：

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert（回滚）

如果当前提交回滚了之前的某个提交，应以 `revert: ` 开头，后接被回滚提交的标题。正文中写明：`This reverts commit <hash>.`，其中 hash 是被回滚提交的 SHA 值。

### Type（类型）

必须是以下之一：

- **build**：影响构建系统或外部依赖的修改（示例作用域：gulp、broccoli、npm）
- **ci**：CI 配置文件和脚本的修改（示例作用域：Travis、Circle、BrowserStack、SauceLabs）
- **docs**：仅文档修改
- **feat**：新功能
- **fix**：修复 bug
- **perf**：提升性能的代码修改
- **refactor**：既不修 bug 也不加功能的代码修改（重构）
- **style**：不影响代码含义的修改（空格、格式化、缺少分号等）
- **test**：添加缺失的测试或修正现有测试

### Scope（作用域）

作用域应该是受影响的 npm 包名（以便从提交信息生成 changelog 的人理解）。

以下是支持的作用域列表（以 Angular 项目为例）：

- animations / common / compiler / compiler-cli / core / elements / forms / http
- language-service / platform-browser / platform-browser-dynamic / platform-server
- platform-webworker / platform-webworker-dynamic / router / service-worker / upgrade

"使用包名"规则目前有几个例外：

- **packaging**：用于改变所有包 npm 布局的修改，如 public path 变更、对所有包的 package.json 修改、d.ts 文件/格式变更、bundle 变更等
- **changelog**：用于更新 CHANGELOG.md 中的发布说明
- **docs-infra**：用于仓库 /aio 目录下 docs-app（angular.io）相关的修改
- 空字符串：用于跨所有包的 `style`、`test`、`refactor` 修改（如 `style: add missing semicolons`），以及与特定包无关的文档修改（如 `docs: fix typo in tutorial`）

### Subject（主题）

主题是对修改的简洁描述：

- 使用祈使句、现在时：用 "change" 而不是 "changed" 或 "changes"
- 首字母不要大写
- 结尾不加句号（.）

### Body（正文）

与主题一样，使用祈使句、现在时。正文应说明修改的动机，并与之前的行为做对比——写清楚改了什么、为什么改，而不是怎么改的。

Bitcoin Core 的这条提交是解释"改了什么、为什么改"的绝佳范例：

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

核心是说清你最初为什么要做这个修改——修改前程序如何工作（有什么问题）、现在如何工作，以及你为什么选择这种方式来解决。

### Footer（页脚）

页脚应包含**破坏性变更（Breaking Changes）**的信息，也是引用本提交所**关闭（Closes）**的 GitHub issue 的位置。

破坏性变更应以 `BREAKING CHANGE:` 开头，后跟一个空格或两个换行，其余内容用于描述该变更。

### 完整示例

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
```

</div>

<div class="lang-en">

## Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples (even more [samples](https://github.com/angular/angular/commits/master)):

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

The following is the list of supported scopes (using the Angular project as an example):

- animations / common / compiler / compiler-cli / core / elements / forms / http
- language-service / platform-browser / platform-browser-dynamic / platform-server
- platform-webworker / platform-webworker-dynamic / router / service-worker / upgrade

There are currently a few exceptions to the "use package name" rule:

- **packaging**: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, d.ts file/format changes, changes to bundles, etc.
- **changelog**: used for updating the release notes in CHANGELOG.md
- **docs-infra**: used for docs-app (angular.io) related changes within the /aio directory of the repo
- none/empty string: useful for `style`, `test` and `refactor` changes that are done across all packages (e.g. `style: add missing semicolons`) and for docs changes that are not related to a specific package (e.g. `docs: fix typo in tutorial`)

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior — explain what and why, not how.

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

Just focus on making clear the reasons why you made the change in the first place — the way things worked before the change (and what was wrong with that), the way they work now, and why you decided to solve it the way you did.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Examples

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
```

</div>
