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

    if (self.isTextNode(node) && reg.test(text)) {
      self.compileText(node, reg.exec(text)[1]);
    }

    if (node.childNodes && node.childNodes.length > 0) {
      // 继续向下遍历节点
      self.compileElement(node);
    }
  })
}

// 初始化View，并初始化Watcher
Compile.prototype.compileText = function(node, exp) {
  var self = this;
  var initText = this.vm[exp];
  this.updateText(node, initText);

  new Watcher(this.vm, exp, function(value, oldVal) {
    self.updateText(node, value);
  });
}

// 更新节点的文本
Compile.prototype.updateText = function(node, value) {
  node.textContent = typeof value == 'undefined' ? '' : value;
}

// 判断节点是否为文本节点
Compile.prototype.isTextNode = function(node) {
  return node.nodeType == 3; 
}