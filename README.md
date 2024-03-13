# nice-axios

[![NPM version](https://img.shields.io/npm/v/nice-axios?color=a1b858&label=)](https://www.npmjs.com/package/nice-axios)

the onion model of axios by @django

- Tree-shakable ESM
- Fully typed - with TSDocs

> This package is designed to be used as `devDependencies` and bundled into your dist.

## 🚀 Quick Start

- Install Dependency

```bash
pnpm add nice-axios
# or
npm i nice-axios
```

- CDN

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.17.21/lodash.min.js"></script>
<script src="./dist/umd/index.umd.js"></script>
```

## 🔍 Usage

- Basic

```js
import { createNiceAxios } from 'nice-axios'
const niceAxios = createNiceAxios()

niceAxios.get()
niceAxios.post()
...etc

```

- Plugins

```js
import { createNiceAxios } from 'nice-axios'

const addTokenPlugin: NiceAjaxExecutor = async (next, config) => {
    // Execute before request
    const token = 'test-token'
    if (config?.headers) {
      config.headers['xxx-TOKEN'] = token
    }

    return next(config).then((result: AxiosResponse) => {
      // Execute after request
      return result
    })
  }

  const plugins: NiceAjaxPlugin[] = [
    // generate plugin instance
    {
      // When the value is approximately small, the observer will be executed earlier before the request. On the contrary, the larger the value, the earlier the observer will be executed after the request.
      order: -100,
      executor: addTokenPlugin,
      desc: 'add token',
    },
  ]

  const niceAxios = createNiceAxios(plugins)
  const res = await niceAxios.get<AxiosResponse<string>>('https://httpd.apache.org/', {
    // meta: { allReturn: true },
  })
```

- Option

| 属性              | 类型             | 描述              |
| ----------------- | ---------------- | ----------------- |
| baseURL           | string           | base url          |
| prefixURL         | string           | prefix url        |
| name              | string           | scope             |
| afterPluginOption | AjaxAfterOptions | afterPluginOption |
| defaultMeta       | AjaxConfigMeta   | defaultMeta       |

## 原理

```ts
/**
 * 采用 compose 插件模式，对请求进行处理
 * 默认插件顺序是从左到右
 * - 请求前置插件 order 从小到大 [1,2,3,4,5] 越小越先执行
 * - 请求后置插件 order 从大到小 [-1,-2,-3,-4,-5] 越大越先执行
 * ## 执行顺序解释：
 * 1. 设计里面是”洋葱模型理念“，像洋葱一样，请求先从外层插件开始执行，然后依次往内层执行，最后返回结果
 * 2. 核心方法是 `compose`，`compose` 会将所有插件组合成一个函数，然后执行这个函数，这个函数会依次执行所有插件
 */
export type NiceAjaxExecutor = ComposePlugin<AjaxResponse, AjaxConfig>
```

### 例子

```ts
// 插件 1
const plugin1: NiceAjaxPlugin = {
  desc: '插件1',
  order: 1,
  executor: async (next, config) => {
    // 由于一个请求的生命周期中，config 都是一个对象引用。所以这里修改后会影响之后的 config 的值
    config.xx = xx
    // 这里可以传新的 config，新的 config 会覆盖原来的 config。注意这里是重新赋值 oldConfig = newConfig
    // next 在不断的调用下一个插件的关键
    return next(newConfig)
  },
}
```

## Star History

<a href="https://star-history.com/#sixdjango/nice-axios&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=sixdjango/nice-axios&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=sixdjango/nice-axios&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=sixdjango/nice-axios&type=Date" />
  </picture>
</a>

## License

[MIT](./LICENSE) License © 2024 [Django](https://github.com/sixdjango)
