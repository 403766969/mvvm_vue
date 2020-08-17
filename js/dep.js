class Dep {

  static target = null // 在对HTML模板中的{{}}和v-model指令进行编译时，存放创建的watcher

  constructor() {
    this.subs = [] // watcher数组
  }

  // 添加watcher
  addSub(sub) {
    this.subs.push(sub)
  }

  // 同时watcher更新
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }

}