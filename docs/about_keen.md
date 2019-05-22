# 关于 computed 敏锐模式

在 `computed` 属性配置中可以通过设置 `keen` 为 `true` 开启计算属性的敏锐模式。

## 什么是敏锐模式？

敏锐计算属性会非常小心地观察着它的依赖对象，依赖对象上的任何风吹草动都会触发敏锐计算属性的重新计算。

## 为什么需要敏锐模式？

试看以下示例：

```js
Component({
  data: {
    time: {
      hours: 10,
      minutes: 10,
      seconds: 10
    }
  },

  computed: {
    timeStr: {
      require: ["time"],
      fn({time}) {
        let {hours, minutes, seconds} = time;
        return `${hours}:${minutes}:${seconds}
      }
    }
  }
})
```

此时 `timeStr` 初始值为 `10:10:10`，然后以下两步操作。

第一步：

```js
this.$setData({
  time: {
    hours: 11,
    minutes: 11,
    seconds: 11
  }
});
```

此时 `time` 值为 `{hours: 11, minutes: 11, seconds: 11}`，`timeStr` 为 `11:11:11`。

第二步：

```js
this.$setData({ "time.hours": 12 });
```

此时 `time` 值为 `{hours: 12, minutes: 11, seconds: 11}`，但 `timeStr` 仍然为 `11:11:11` 而不是期待的 `12:11:11`。

这是因为第一步因为直接更新了 `time` 值，因此 `timeStr` 观察到了 `time` 发生了变化，于是重新计算了自身的值。

而第二步使用路径表达式直接在原来的 `time` 属性上修改了 `hours` 属性，`time` 本身是没有变的，仍然是原来那个对象，`timeStr` 观察到 `time` 没有变化，因此没有更新自身的值。

解决第二步操作中 `timeStr` 无法更新的方法有两种。

方法一：修改 `timeStr` 的计算属性配置，尽可能地使用路径表达式来精准标明依赖关系，而不是将依赖目标锁定到父节点属性上，然后在计算函数中再从父节点属性中取值进行计算。

```js
{
  computed: {
    timeStr: ["time.hours", "time.minutes", "time.seconds"],
    fn({"time.hours": hours, "time.minutes": minutes, "time.seconds": seconds}) {
      return `${hours}:${minutes}:${seconds}`
    }
  }
}
```

这样 `timeStr` 一旦观察到 `time` 的 `hours`,`minutes`,`seconds` 有任何变化，都会重新计算自身值。但书写上稍显麻烦。

方法二：在 `timeStr` 计算属性上设置 `keen` 为 `true`

```js
  computed: {
    timeStr: {
      require: ["time"],
      fn({time}) {
        let {hours, minutes, seconds} = time;
        return `${hours}:${minutes}:${seconds}
      },
      keen: true
    }
  }
```

当 `keen` 为真时，`time` 上任何变化都会触发 `timeStr` 重新计算。这也意味着 `this.$setData({"time.year": 2019})` 也将触发 `timeStr` 的更新。

## 什么时候开启敏锐模式？

计算属性的敏锐模式默认是关闭的，滥用敏锐模式，不仅增加程序运行的开销，如使用不当甚至可能造成计算死循环。

尽量避免使用笼统的依赖关系，尽可能准确地定义依赖关系，如上文所示。

尽量避免定义多重路径，尽量定义根节点属性，简化数据结构。例如：

不推荐：

```js
{
  data: {
    goods: {
      ids: [1, 2, 3, 4],
      total: 4
    }
  }
}
```

推荐：

```js
{
  data:  {
    goodsIds: [1, 2, 3, 4],
    goodsTotal: 4
  }
}
```

尽量避免原地修改属性，尽量给于属性新值。例如：

```js
{
  data: {
    goodsIds: [1, 2, 3, 4],
    goodsTotal: 4
  },

  // 不推荐：原地修改
  addGoods(id) {
    let {goodsIds} = this.data;
    goodsIds.push(id);
    this.$setData({goodsIds})
  },

  // 推荐：更新 goodsIds
  addGoods(id) {
    let {goodsIds} = this.data;
    this.$setData({goodsIds: goodsIds.concat([id])})
  }
}
```

尽量遵循以上原则，如果需要使用敏锐模式，也只用在需要的地方，避免滥用：

```js
{
  data: {
    // 开关集合
    switches: [true, false, true, false];
  },

  computed: {
    // 计算有多少个开关处于打开状态
    openings: {
      require: ["switches"],
      fn({switches}) {
        let open = 0;
        for (let i = 0; i < switches.length; i++) {
          if(switches[i]) open++;
        }
        return open;
      },
      keen: true
    }
  },

  // 打开或关闭开关
  toggle(index, state) {
    this.$setData({[`switches[${index}]`]: !!state});
  }
}
```

`openings` 初始值为 2， 调用 `this.toggle(1, true)` 后，`openings` 自动更新为 3。
