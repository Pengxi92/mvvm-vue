/**
 * 类Vue的构造函数
 * @param {*} data 数据
 * @param {*} el 可挂载DOM元素
 * @param {*} exp 待监听的属性名
 */
function SelfVue (data, el, exp) {
  this.data = data;
  var self = this;
  Object.keys(data).forEach(function(key) {
    self.proxyKeys(key); // 不直接使用this，应该这里this指向Object.keys(data)
  });
  observe(data);
  el.innerHTML = this[exp];  // 初始化模板数据的值

  // 添加属性的监听操作
  new Watcher(this, exp, function(value, oldVal) {
    el.innerHTML = value;
  })
}

// 针对data属性添加代理
SelfVue.prototype.proxyKeys = function(key) {
  var self = this;
  Object.defineProperty(self, key, {
    enumerable: false,
    configurable: true,
    set: function(val) {
      self.data[key] = val;
    },
    get: function() {
      return self.data[key];
    },
  });
}