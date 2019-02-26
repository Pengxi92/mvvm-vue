/**
 * 设置Watcher
 */

/**
 * Watcher的构造函数
 * @param {*} vm 类Vue对象
 * @param {*} exp 监听的属性名
 * @param {*} cb 回调函数
 */
function Watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;

  // 添加自己到Dep
  this.value = this.get();
}

Watcher.prototype.get = function() {
  Dep.target = this; // 缓存自己
  var value = this.vm.data[this.exp]; // 触发get函数
  Dep.target = null; // 释放自己
  return value;
}

// Watch更新
Watcher.prototype.update = function() {
  this.run();
}

Watcher.prototype.run = function() {
  var value = this.vm.data[this.exp];
  var oldVal = this.value;
  if (value !== oldVal) {
    this.value = value;
    this.cb.call(this.vm, value, oldVal); // 触发更新操作
  }
}