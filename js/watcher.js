class Watcher {

  constructor(data, key, fn) {
    // 数据改变时调用的更新函数
    this.update = fn

    // 创建watcher时，赋值给Dep.target
    Dep.target = this

    // 获取一次数据，调用数据的get方法，将watcher添加到dep中
    data[key]

    // watcher添加到dep后，赋值为null
    Dep.target = null
  }

}