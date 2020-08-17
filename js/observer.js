class Observer {

  constructor(data) {
    this.data = data

    // 使用Object.defineProperty对data进行数据劫持，定义getter和setter实现数据的响应式
    this.definedReactive(this.data)
  }

  // 数据劫持
  definedReactive(data) {
    let _this = this
    Object.keys(data).forEach(dataKey => { // 遍历data的属性，定义对应的getter和setter
      let dep = new Dep()
      let dataValue = data[dataKey]
      Object.defineProperty(data, dataKey, {
        enumerable: true,
        configurable: true,
        get() {
          Dep.target && dep.addSub(Dep.target) // 在对HTML模板中的{{}}和v-model指令进行编译时，创建watcher添加到dep.subs中
          return dataValue
        },
        set(newValue) {
          if (dataValue === newValue) {
            return
          }
          if (newValue && typeof newValue === 'object') { // 若新设置的属性值为对象类型，则进一步劫持
            _this.definedReactive(newValue)
          }
          dataValue = newValue
          dep.notify() // 数据发生改变时，通知dep.subs中的watcher更新
        }
      })
      if (dataValue && typeof dataValue === 'object') { // 若属性值为对象类型，则进一步劫持
        _this.definedReactive(dataValue)
      }
    })
  }

}