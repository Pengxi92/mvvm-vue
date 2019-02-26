/**
 * 设置compile构造函数
 */

function Compile(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null;
  this.init();
}

Compile.prototype.init = function() {
  if (this.el) {
    this.fragment = this.nodeToFragment(this.el);
    this.compileElement(this.fragment);
    this.el.appendChild(this.fragment);
  } else {
    console.log('当前节点不存在');
  }
}

// 遍历节点，并添加到fragment片段中
Compile.prototype.nodeToFragment = function(el) {
  var fragment = document.createDocumentFragment();

  var child = el.firstChild;
  while(child) {
    fragment.appendChild(child);
    child = el.firstChild;
  }
  return fragment;
}

// 判断节点是否带有 '{{变量}}' 这种形式的指令，并进行相关处理
Compile.prototype.compileElement = function(el) {
  var childNodes = el.childNodes;
  var self = this;
  [].slice.call(childNodes).forEach(function(node) {
    var reg = /\{\{(.*)\}\}/;
    var text = node.textContent;

    if (self.isElementNode(node)) {
      self.compile(node);
    } else if (self.isTextNode(node) && reg.test(text)) {
      self.compileText(node, reg.exec(text)[1]);
    }

    if (node.childNodes && node.childNodes.length > 0) {
      // 继续向下遍历节点
      self.compileElement(node);
    }
  })
}

// 遍历节点的属性
Compile.prototype.compile = function(el) {
  var nodeAttrs = el.attributes;
  var self = this;
  [].slice.call(nodeAttrs).forEach(function(attr) {
    var attrName = attr.name;
    if (self.isDirective(attrName)) {
      var exp = attr.value;
      var dir = attrName.slice(2);
      if (self.isEventDirective(dir)) { // 事件指令
        self.compileEvent(el, self.vm, exp, dir);
      } else { // v-model 指令
        self.compileModel(el, self.vm, exp, dir);
      }
    }
  });
}

// 初始化View的文本节点，并初始化Watcher
Compile.prototype.compileText = function(node, exp) {
  var self = this;
  var initText = this.vm[exp];
  this.updateText(node, initText);

  new Watcher(this.vm, exp, function(value, oldVal) {
    self.updateText(node, value);
  });
}

// 初始化View的事件
Compile.prototype.compileEvent = function(node, vm, exp, dir) {
  var eventType = dir.split(':')[1];
  var cb = vm.methods && vm.methods[exp];
  if (eventType && cb) {
    node.addEventListener(eventType, cb.bind(vm), false);
  }
}

// 初始化View的V-modal，并初始化Watcher
Compile.prototype.compileModel = function(node, vm, exp, dir) {
  var self = this;
  var val = this.vm[exp];
  this.updateModel(node, val);
  new Watcher(vm, exp, function (value) {
    self.updateModel(node, val);
  });

  // 节点添加监听事件
  node.addEventListener('input', function (event) {
    var value = event.target.value;
    if (val === newValue) {
      return;
    }
    self.vm[exp] = newValue;
    val = newValue; // 形成闭包
  });
}

// 更新节点的文本
Compile.prototype.updateText = function(node, value) {
  node.textContent = typeof value == 'undefined' ? '' : value;
}

// 更新节点的value
Compile.prototype.updateModel = function(node, value) {
  node.value = typeof value == 'undefined' ? '' : value;
}

// 判断节点是否为文本节点
Compile.prototype.isTextNode = function(node) {
  return node.nodeType == 3; 
}

// 判断节点是否为element节点
Compile.prototype.isElementNode = function(node) {
  return node.nodeType == 1; 
}

// 判断节点是否有V-标签
Compile.prototype.isDirective = function(dir) {
  return dir.indexOf('v-') === 0; 
}

// 判断节点是否有on:标签
Compile.prototype.isEventDirective = function(dir) {
  return dir.indexOf('on:') === 0; 
}