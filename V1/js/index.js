/**
 * 类Vue的构造函数
 * @param {*} data 数据
 * @param {*} el 可挂载DOM元素
 * @param {*} exp 待监听的属性名
 */
function SelfVue (data, el, exp) {
  this.data = data;
  observe(data);
  el.innerHTML = this.data[exp];  // 初始化模板数据的值

  // 添加属性的监听操作
  new Watcher(this, exp, function(value, oldVal) {
    el.innerHTML = value;
  })
}