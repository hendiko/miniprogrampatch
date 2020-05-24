# computed 定义格式

标准计算属性定义格式为：

```typescript
{
  computed: {
    [key:string]: {
      require?: Array<string>;
      fn: function(data:object):any;
      keen: boolean;
    }
  }
}
```

标准的单个计算属性的配置项：

- `require`(可选) 数组，包含当前计算属性所依赖的其他属性名称（包括路径表达式）。
- `fn`（必选）函数，它接受一个对象作为参数，该参数对象为当前计算属性所有依赖属性名称与值。
- `keen`（可选）布尔，默认值为`false`。如果该参数为 `true`，则表示当前计算属性处于敏锐观察模式，当前属性所依赖的属性有任何操作都将重新计算当前属性值。参见[关于 computed 敏锐模式](./docs/about_keen.md)

## 其他定义格式

为便捷起见，miniprogrampatch 支持以下计算属性的定义格式，但无论哪种定义格式，在 miniprogrampatch 内部最后都将被转换为标准计算属性定义。

### 格式一：函数

```typescript
{
  computed: {
    [key:string]: function;
  }
}
```

以上定义了一个无依赖的计算属性，该计算属性值只在页面或组件初始化时计算一次。

```js
{
  computed: {
    // foo 的值为 'foo'。
    foo: function() {
      return 'foo';
    }
  }
}
```

### 格式二：字符串

> `1.3.0+` 支持。

```typescript
{
  computed: {
    [key:string]: string;
  }
}
```

以上定义了一个恒等计算属性，`value:string` 表示另一个属性的路径表达式，`key:string` 定义的计算属性值将保持与 `value:string` 属性值相等。

```js
{
  computed: {
    // foo 的值为 'hello world'
    foo: "hello.world",
  },

  data: {
    hello: {
      world: 'hello world'
    }
  }
}
```

### 格式三：数组

> `1.3.0+` 支持。

```typescript
{
  computed: {
    [key:string]: array;
  }
}
```

使用数组定义计算属性，array 格式如下：

```
let [require, fn, keen] = array;
```

- require `string|array<string>` 定义依赖属性的路径表达式。
- fn `function(...args)` 计算函数。计算函数的返回值即为计算属性值。
- keen `boolean` 敏锐模式。

##### 计算函数

计算函数接受的参数为依赖属性值，且参数顺序与定义的依赖属性顺序一致。

如果未定义计算函数，miniprogrampatch 内置了一个缺省计算函数。

缺省计算函数的返回值取决于定义的依赖属性个数。

- 若只有单个依赖属性，缺省计算函数返回该依赖属性值。
- 若有多个依赖属性，缺省计算函数返回依赖属性值组成的数组，且值顺序与依赖定义顺序一致。

> 注意：如果计算函数定义为箭头函数，`this` 将不能指向 Page 或 Component 实例。

```js
{
  computed: {


    // [require] 定义依赖属性 hello。
    // [fn] 定义计算函数缺省。
    // foo 的值为 'hello'。
    foo: ['hello'],

    // [require] 定义依赖属性 hello 和 world。
    // [fn] 定义计算函数缺省。
    // foo 的值为 ['hello', 'world']
    bar: [['hello', 'world']],

    // [require] 定义依赖属性 hello 和 world。
    // [fn] 定义一个箭头函数作为计算函数。
    // foo 的值为 'hello world!'
    gee: [
      ['hello', 'world'],
      (x, y) => `${x} ${y}!`
    ]
  },

  data: {
    hello: 'hello',
    world: 'world'
  }
}
```
