# 微信小程序分享落地页重定向

`miniprogrampatch` 从 `1.2.3+` 版本开始，提供 `patchOnShareAppMessage` 和 `patchRouterPage` 两个函数，用来增强小程序分享体验。

## 为什么要重定向分享落地页

小程序中分享消息数据来自于 `Page#onShareAppMessage` 的返回值，返回值为一个对象，包含以下三个字段：

- `title` 标题
- `path` 落地页路径
- `imageUrl` 图片

当从分享消息进入小程序时，小程序会清空当前的页面栈，然后直接打开落地页。此时落地页标题栏没有后退按钮（因为无路可退），用户无法很快速地返回首页（或者前往其他页面）。

为了给用户一个更好的体验，使用通过使用 `miniprogrampatch` 提供的小程序分享补丁来实现用户从分享消息进入小程序，先打开一个指定的页面（通常可能为首页）作为中转页，然后再重定向打开分享落地页，如此可以在落地页标题栏提供一个后退按钮，如用户需要离开当前页面，可以通过后退按钮快速回到我们事先指定的中转页。

## 用法

`patchOnShareAppMessage` 和 `patchRouterPage` 两个函数搭配使用，前者修改 `Page` 的 `onShareAppMessage` 方法，自动修改分享消息的落地页路径 `path`；后者修改 `Page` 的 `onLoad` 方法，使得中转页可以解析页面参数并打开落地页。

二者皆可以作为全局补丁或局部补丁，一般 `patchOnShareAppMessage` 应作用于全局页面，`patchRouterPage` 应仅作用于中转页。

### patchOnShareAppMessage(Page, options)

`patchOnShareAppMessage` 函数第一个参数为页面构造函数 `Page`，第二个参数 `options` 为一个 Plain Object，包含一个 `router` 字段，用来指定默认的中转页路径。

例如，在 `app.js` 文件中：

```js
import { patchOnShareAppMessage } from "miniprogrampatch";

Page = patchOnShareAppMessage(Page, { router: "/pages/index/index" });
```

在任意页面构造参数中，只要定义了 `onShareAppMessage` 函数，则用户从该页面发出的分享消息进入小程序时将先打开 `/pages/index/index`，然后再打开真正的落地页。

例如在 `/pages/somePage/index`:

```js
Page({
  onShareAppMessage() {
    return {
      title: "分享消息标题",
      path: "/pages/anotherPage/index", // 落地页路径为 "/pages/index/index?redirectTo=%2Fpages%2FanotherPage%2Findex"
      imageUrl: "/some/image.png"
    };
  }
});
```

你可以在 `onShareAppMessage` 函数返回值中定义 `router` 值，用来单独修改该页面的分享路径。

如果 `onShareAppMessage` 函数返回值中没有定义 `router` 字段，则使用 `patchOnShareAppMessage` 方法中设置的 `router` 作为默认中转页路径（如果没有默认中转页路径，则将小程序原生规则进行分享）。

如果 `onShareAppMessage` 函数返回值中定义了 `router` 字段，但 `router` 值为假，则表示禁用默认中转页，按照小程序原生规则分享；否则将中转页设置为 `router` 指定的路径。

```js
Page({
  onShareAppMessage() {
    return {
      title: "分享消息标题",
      path: "/pages/anotherPage/index", // 落地页路径为 "/pages/anotherPage/index"
      imageUrl: "/some/image.png",
      router: false
    };
  }
});
```

或

```js
Page({
  onShareAppMessage() {
    return {
      title: "分享消息标题",
      path: "/pages/anotherPage/index", // 真正的落地页路径为 "/pages/foo/index?redirectTo=%2Fpages%2FanotherPage%2Findex"
      imageUrl: "/some/image.png",
      router: "/pages/foo/index"
    };
  }
});
```

> 如果想传递额外的参数给中转页，可以在 `router` 字段中直接添加参数，例如上述例子中 `{router: "/pages/foo/index?name=bar"}`，最终得到 `path` 为 `/pages/foo/index?name=bar&redirectTo=%2Fpages%2FanotherPage%2Findex`
> 落地页路径会被 `encodeURIComponent` 编码后再作为 `redirectTo` 参数值。

### patchRouterPage(Page)

`patchRouterPage` 接收页面构造函数 `Page` 作为自己的参数。它的作用是在中转页解析页面参数中的 `redirectTo` 字段，然后打开落地页。

例如在上面示例中的 `/pages/foo/index` 页面：

```js
import {patchRouterPage} from "miniprogrampatch"

patchRouterPage(Page)({
  ...
})
```

> 注意 `patchRouterPage` 会解析出页面参数 `redirectTo` 作为落地页路径，而该参数值应该是一个经过 `urlencoded` 的字符串。
