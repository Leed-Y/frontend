### Vue

#### 组件间通信

1. `props`，`emit`。`props`是由父组件向子组件传值。`emit`是子组件通过抛出一个父组件可监听的事件进行传值。`props`的值不能被子组件直接修改。
2. `provide`，`inject`。父级组件可以使用`provide`注入一个值，子级组件可以通过`inject`获取这个值。`provide`的值不能被修改。
3. `vuex`。`vuex`作为一个状态管理系统，也可以做组件间通信，不过未免大材小用。
4. `EventBus`。使用事件总线也能做到组件间通信。
5. `ref`与`$refs`。`vue`可以使用`ref`关键字定义元素属性，如果元素是组件的话，`refs`的值就会指向元素对应的组件，可以直接获取此组件的值，方法等。
6. `$parent`,`$children`。可以直接使用`$parent`,`$children`获取自身的父组件与子组件，并对其进行操作。
7. `$attrs`与`$listeners`。为了解决组件间隔代通信的需求，引入了`$attrs`与`$listeners`，子组件可以通过定义`inheritAttrs`选项来决定是否要获取`attrs`里的值。
8. `localstorge`。通过`window.localStorage.getItem(key)`获取数据。通过`window.localStorage.setItem(key,value)`存储数据。



#### 虚拟Dom

##### 概念

虚拟`Dom`是用`Js`按照`Dom结构`实现的树形结构。因为在`MVVM`模式中，数据的更新也会影响到视图的更新，如果直接去操作`真实DOM`的话，造成的开销太大，而且容易引起浏览器的重绘与回流，影响系统使用流畅度，所以使用了`虚拟DOm`来替代`真实Dom`，在一次`EventLoop`后，`diff虚拟Dom`，将不同之处批量更新至`真实DOM`中。



#### 虚拟Dom比较规则

在采取diff算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较。

1. 判断newNode与oldNode是否是相同的Vnode
2. 不是的话，直接用newNode替换oldNode
3. 如果是同一node的话，进行子node的比较，分几种情况处理：
   - oldNode有子节点，newNode没有，删除
   - oldNode没有子节点，newNode有，插入
   - 都只有文本节点，对比值，不一样时替换
   - 都只有子节点，继续进行比较。



#### 计算属性与监听属性

##### 计算属性与监听属性概念

计算属性`computed`是依赖一项或多项数据生成的数据。

监听属性`watch`是通过监听某一项数据，完成一段复杂业务逻辑。



##### 用法异同点

1. 相同点
   - `computed`与`watch`都是监听/依赖数据，并进行处理
2. 不同点
   - `computed`主要用于同步数据的处理。
   - `watch`主要用于观测某个值的变化完成复杂业务逻辑



##### computed初始化

将`computed`属性中使用到的`响应式数据`的`Dep`中，都添加一个`Watcher`，`Watcher`传参的`update`为一个赋值函数，完成计算属性的依赖收集。



##### watcher初始化

给`watch`监听的数据增加一个`watcher`，将`watch`中定义的回调函数当作`update`函数传入`watcher`。



