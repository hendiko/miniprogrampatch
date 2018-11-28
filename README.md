# 概述

`miniprogrampatch` 非常简单易用，它只有 `patchPage` 和 `patchComponent` 两个函数，分别用以增强微信小程序提供的 `Page` 和 `Component` 对象，使得页面（Page）和自定义组件（Component）具有属性监听（watch）和计算属性（computed）特性。

# 小程序示例片段

示例代码片段：[https://developers.weixin.qq.com/s/0WQr9fmp7P4U](https://developers.weixin.qq.com/s/0WQr9fmp7P4U)

> 示例代码目录：`./miniprogramapp`

# 安装

使用 npm 安装

```
npm install --save miniprogrampatch
```

或者直接拷贝文件 `./dist/miniprogrampatch.js` 到项目中。

# 用法

> 以下示例假定 miniprogrampatch.js 文件放置于项目根目录，示例代码参见[miniprogramapp](https://developers.weixin.qq.com/s/0WQr9fmp7P4U)。

## 全局补丁

在 `app.js` 中：

```js
const { patchPage, patchComponent } = require('./miniprogrampatch')

Page = patchPage(Page);
Component = patchComponent(Component);

App({});
```

在全局增强模式下，在编写页面或自定义组件时，无需再做任何事情就可以使用 `watch` 和 `computed` 特性。

例如 `./index/index.js` 中直接定义 `watch` 和 `computed` 属性：

```js

Page({
    watch: {
        total(value, old) {
            // do something
        }
    },

    computed: {
        total: {
            require: ['count', 'countByTen', 'countByHundred'],  // 显式指定依赖属性
            fn({ count, countByTen, countByHundred }) {
                return count + countByTen + countByHundred;
            }
        }
    },

    data: {
        count: 1
    }
});

```

## 局部补丁

你也可以选择在需要使用 `watch` 或 `computed` 特性的页面（或自定义组件）中，局部增强 `Page` 或 `Component` 对象：

例如在 `./index/index.js` 中：

```js
const { patchPage } = require('../miniprogrampatch');

patchPage(Page)({
    watch: {
        // add some watchers
    },

    computed: {
        // add some computed props
    },

    // todo
})
```

> 如果在 app.js 中打了全局补丁，则在页面或组件中不必再打局部补丁。

# 配置与方法

## 配置项

### `watch`

该配置项用以定义需要监听的属性，支持多路径属性名监听。

```js
Page({
    watch: {
        // 嵌套路径监听
        'x.y': function (value, old) {
            console.log('x.y', value === old);  // x.y true
        },

        // 监听属性
        x(value, old) {
            console.log('x', value === old); // x true
        },
    }
})
```

### `computed`

计算属性并非只读属性，你完全可以覆写某个计算属性，但该计算属性会在计算依赖属性发生变化，自动重新计算。

```js
Page({

    data: {
        count: 10
    },

    computed: {
        /** 页面加载的时间戳（不依赖其他属性） */
        timestamp() {
            return Date.now();
        },

        /** count 乘以 10（依赖属性 count） */
        countByTen: {
            require: ['count'],
            fn({ count }) {
                return count * 10
            }
        },

        /** count 乘以 100（依赖另一个计算属性 countByTen）*/
        countByHundred: {
            require: ['countByTen'],
            fn({ countByTen }) {
                return countByTen * 10;
            }
        },
    }
});
```

`computed` 中的 `key:value`，如果 `value` 为函数，则表示该属性没有依赖其他属性，只在初始化时计算一次。如果 `value` 为对象，且在 `require` 字段中声明了依赖属性名称，则在相应的依赖属性发生变化后，该计算属性值会被重新计算。

## 方法

### `$setData` 

*别名：`updateData`*

在使用 patchPage 或 patchComponent 增强后的 Page 或 Component 实例拥有一个名为 `$setData` 的方法，用来设置 data 同时触发 computed 属性更新以及 watch 监听检查。

在微信小程序基础库 v2.2.2 以下版本，Page 或 Component 的 `setData` 方法由于会被定义为只读属性，无法覆写，因此必须使用 `$setData` 来触发数据更新检查。

在微信小程序基础库 v2.2.3 以上版本，Page 和 Component 的 `setData` 等效于 `$setData`，可以直接使用 `setData` 来触发数据更新。