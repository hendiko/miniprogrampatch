# miniprogrampatch 实现原则与规范

## 设计原则

minipogrampatch 实现的 `setData` 方法与微信小程序原有 API 输入与输出保持一致，不影响微信小程序现有任何功能，同时为 `Page` 和 `Component` 实例提供 `computed` 与 `watch` 能力。

## 实现规范

### 路径式属性名的解析规则

微信小程序 `setData({key: value})` 支持 key 为路径式字符串作为属性名称，miniprogrampath 针对路径式属性名称解析规则如下：

- 以句号`.`作为路径连接符，多个连续句号视为一个连接符。例如：`ab.c..d`，解析后的路径为`["ab", "c", "d"]`。
- 连接符出现路径字符串的首尾位置视为无效。例如：`...a.b.c...` 等同于 `a.b.c`。
- 允许空字符串作为路径名称中的一部分。例如：`a.b. c` 解析后为 `["a", "b", " c"]`。
- 数组路径以 `[]` 标识，数据路径符号中间只能是数字。例如：`a[1]` 或 `a[01]` 是正确的，`a[b]` 是非法的。
- 数组路径不能作为首位路径。例如：`[1].x` 是非法的。

#### 异常路径的解析

微信小程序中 `b[1]1]2]x` 会被解析成 `["b", "[1]", "[0]", "[0]", "12x"]`，miniprogrampatch 会解析成 `["b", "[1]", "1]2]x"]`。

异常路径的解析结果不同，可能会导致非预期的结果，所以需要尽量避免书写异常的路径名称。

## miniprogrampatch 与微信小程序一些原生表现的差异

### 不允许在 Component 内部修改 properties

对于一个微信小程序 Component 实例而言，所有内部状态应声明在 `data` 中，而外部状态应声明在 `properties` 中。

但微信小程序并不像 React 那样界限分明地使用 `this.state` 读取内部状态，`this.props` 读取外部状态。小程序的内外部状态最终都保存在 `this.data` 属性中。

虽然不提倡在组件内部修改标识为外部状态的 `properties` 值，但是实际上小程序中使用 `this.setData` 方法更新一个外部状态，仍然会触发视图的重新渲染。

```js
Component({
  properties: {
    shown: false,
  },

  data: {
    msg: "",
  },

  attached() {
    // 虽然 shown 应该是一个外部状态，但在内部更新它的值仍然会触发视图重新渲染。
    this.setData({ shown: true });
  },
});
```

**`miniprogrampatch` 不允许在内部修改 `properties`。**

使用 `patchComponent` 函数增强的 Component 实例，在调用 `setData` 时会检查是否正在修改一个 properties 值，并且阻止这种修改。

```js
patchComponent(Component)({
  properties: {
    shown: false,
  },

  data: {
    msg: "",
  },

  attached() {
    // shown 是一个外部状态，在内部更新它的值视为无效操作。
    this.setData({ shown: true });
  },
});
```

### watch 和 observer 的首次触发时机

在微信小程序中定义组件的 properties 时，可以设置 `observer` 函数，例如：

```js
// Foo component
Component({
  properties: {
    foo: {
      type: Number,
      value: 0,
      observer(val) {
        console.log(val);
      },
    },
  },
});
```

使用时：

```js
<Foo foo="{{1}}"></Foo>
```

微信小程序在处理 property 的 observer 时是将接收到的初始值与定义的默认值进行对比，如果比较出差异就调用一次 `Observer` 函数。

笔者认为这会让组件静默设置 property 初始值的能力，因此在 miniprogrampatch 中，对 properties 中定义的 `Observer` 调用逻辑与微信小程序保持一致。

但是定义在 `watch` 中的监听函数，在组件初始化时不会被调用，只有被观察对象的值发生变化的时候才会被调用。

```js
// Foo component
patchComponent(Component)({
  properties: {
    foo: {
      type: Number,
      value: 0,
      observer(val) {
        // 在组件初始化时，如果 foo 传入值不等于 0，该函数会被调用。
        console.log(val);
      },
    },
  },

  watch: {
    // 无论组件初始化时 foo 的传入值是什么，该函数不会调用。
    // 只有组件生命周期内，如果 foo 值发生变化，该函数才会被调用。
    foo(val) {
      console.log("foo's new value is ", val);
    },
  },
});
```

> 笔者曾与微信小程序官方人员讨论过此问题，详情点击参阅[自定义组件初始化时因为默认值不同导致 prop 的 observer 被调用](https://developers.weixin.qq.com/community/develop/doc/0006cc062dc7e032e48791c825b800)
