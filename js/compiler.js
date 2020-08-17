class Compiler {

  constructor(el, vm) {
    this.el = el
    this.vm = vm
    this.createFragment()
  }

  createFragment() {
    let element = document.querySelector(this.el)
    let fragment = document.createDocumentFragment() // 创建空的文档片段fragment
    let node
    while (node = element.firstChild) { // 将element中的节点移入到fragment中
      this.compile(node) // 对每个节点进行编译，匹配其中的{{}}和v-model指令
      fragment.appendChild(node)
    }
    element.appendChild(fragment) // 将fragment添加到element中，显示在页面上
  }

  compile(node) {
    // 节点为元素节点
    if (node.nodeType === 1) {
      if (node.attributes.hasOwnProperty('v-model')) { // 是否具有v-model属性
        let attrValue = node.attributes['v-model'].value
        let keyArr = attrValue.split('.')
        let data = this.vm
        while (keyArr.length > 1) { // 对v-model的值进行遍历，获取data的key
          data = data[keyArr.shift()]
        }
        let key = keyArr.shift()
        new Watcher(data, key, () => { // 创建watcher，并定义watcher更新函数
          node.value = data[key]
        })
        node.value = data[key]
        node.addEventListener('input', e => { // 监听节点的输入事件
          data[key] = e.target.value
        })
      }
    }
    // 节点为文本节点
    else if (node.nodeType === 3) {
      let reg = /\{\{(.*)\}\}/ // 正则表达式，匹配{{}}
      if (reg.test(node.textContent)) {
        let nodeText = node.textContent
        let keyArr = RegExp.$1.split('.')
        let data = this.vm
        while (keyArr.length > 1) { // 对匹配的字符串进行遍历，获取data的key
          data = data[keyArr.shift()]
        }
        let key = keyArr.shift()
        new Watcher(data, key, () => { // 创建watcher，并定义watcher更新函数
          node.textContent = nodeText.replace(reg, data[key])
        })
        node.textContent = nodeText.replace(reg, data[key])
      }
    }
    if (node.childNodes.length > 0) { // 若节点存在子节点，则进一步编译子节点
      Array.from(node.childNodes).forEach(item => {
        this.compile(item)
      })
    }
  }

}