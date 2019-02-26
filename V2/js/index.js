/**
 * 类Vue的构造函数
 * @param {*} option 配置数据
 */
function SelfVue (option) {
  this.vm = this;
  this.data = option.data;
  var self = this;
  Object.keys(this.data).forEach(function(key) {
    self.proxyKeys(key); // 不直接使用this，应该这里this指向Object.keys(data)
  });
  observe(this.data);
  new Compile(option.el, this.vm);
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