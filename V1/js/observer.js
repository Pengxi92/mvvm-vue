/**
 * 设置Observe
 */

function defineProperty(data, key, val) {
  // 递归遍历对象属性
  observe(val);
  var dep = new Dep(); 
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    set: function(newVal) {
      if (val === newVal) {
        console.log('属性' + key + '被监听了，不执行更新操作');
        return;
      }
      val = newVal;
      console.log('属性' + key + '被监听了，值为：“' + newVal.toString() + '”');
      dep.notify();
    },
    get: function() {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    }
  })
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  Object.keys(data).forEach(function(key) {
    defineProperty(data, key, data[key]);
  })
}

/**
 * 设置Dep
 */

function Dep() {
  this.subs = [];
}

// 添加watcher
Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
}

// 遍历执行watcher的更新操作
Dep.prototype.notify = function notify() {
  this.subs.forEach(function(sub) {
    sub.update();
  })
}

Dep.target = null;