## v1.2.2

1. 优化 props 触发的 computed 求值，每一轮 props 的变化，只触发一次 computed 计算。

## v1.2.1

1. 禁止在 Component 中通过 setData 修改 properties 值。

## v1.2.0

1. 重构 computed 能力，修复计算属性之间隐式依赖问题。
2. 在 `computed` 配置中增加 `keen` 选项。
3. 优化 watch 能力。
4. 修复路径表达式解析遇见空字符串未抛出异常。

## v1.1.11

1. 修复计算属性隐式依赖关系的问题。Computed 属性的 require 字段使用路径表达式时，两个属性之间可能存在隐式依赖关系，由于未能发现这种隐式依赖，会导致属性求值错误以及不能正确更新计算属性。
2. 修复 `computed.js` 中判断依赖关系函数。
3. 修复在 Component 中定义了 `lifetimes` 时会忽略 `watch` 配置的问题。
4. 修复 Component 高阶函数 `created` 钩子中的 `setData` 调用错误。
5. 重构了属性路径的解析方法，完美匹配微信小程序的解析规则。

## v1.1.10

1. 修复计算属性的 require 字段使用嵌套路径时，未监听嵌套路径的父路径属性值的变化。
