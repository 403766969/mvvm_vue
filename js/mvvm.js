class Mvvm {

  constructor(options) {
    // 保存options
    this.$options = options
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods

    // 数据劫持，观察this.$data中数据的变化
    new Observer(this.$data)

    // 使用this代理this.$data，即this[key]===this.$data[key]
    this.proxy()

    // 编译HTML模板，即根据模板中的{{}}和v-model、v-show指令创建对应的watcher
    new Compiler(this.$el, this)
  }

  // 使用Object.defineProperty定义getter和setter实现数据代理
  proxy() {
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return this.$data[key]
        },
        set(newValue) {
          this.$data[key] = newValue
        }
      })
    })
  }

}