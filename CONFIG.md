### 安装 TS

```js


npm i -S typescript vue-router@next 安装 ts 和 router


npx tsc --init 创建tsconfig.json文件

把根目录下的main.js文件改名为main.ts

把根目录下的index.html中引入的main.js改名为main.ts

同时把.vue文件里的<script>标签中加入lang="ts"

在项目根目录创建shim.d.ts文件，同时在其中写入以下代码，用于配置ts支持识别.vue文件

declare module "*.vue" {
	import { Component } from "vue";
	const component: Compoent;
	export default component;
}
```
