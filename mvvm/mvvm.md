### MVVM

#### 基本概念

**MVVM**，即**Model**，**View**，**ViewModel**

- **ViewModel**，内部集成了数据绑定引擎，当**View**或**Model**某一方发生变化时，自动更新另一方。实现了**View**与**Model**的双向绑定。
- **View**，主要表示UI组件
- **Model**，数据

目前流行的框架，Vue，React以及Angular都是**MVVM**的一种实现。



#### Vue的运行机制

可以从`Vue`的运行机制中，找出`MVVM`模式核心的几个点。

1. 创建Vue实例对象。
2. 初始化生命周期，初始化渲染，初始化`data`，`props`，`computed`等数据，在这个阶段使用`Object.setPrototypeOf`与内部闭包`Dep`对象重写`getter`，`setter`完成`数据劫持`。执行`beforeCreated`，`created`等周期函数。
3. 初始化后，调用`$mounted`对Vue实例进行挂载。
4. Vue实例上如果没有定义`render`函数的话，会先进行`编译阶段`将`模版`编译成`render`函数。在`render`函数渲染时，会读取Vue实例中和视图相关的响应式数据，此时会触发`getter`函数进行`依赖收集`，创建一个观察者`Watcher`存放到当前闭包的订阅者`Dep`的`sub`中。
5. `render`函数渲染完成后，会生成虚拟Dom树。
6. 虚拟dom树生成完成后，会调用`update`方法将虚拟dom转化为真实Dom。
7. 在响应式数据发生变化时，会触发`setter`函数，通知所有当前闭包的订阅者，渲染虚拟dom，批量更新成真实dom。

由上面的流程可以看到，`MVVM`核心的几个点在于：

- 数据劫持
- 模版编译
- 数据双向绑定

结合上面`MVVM`的概念定义，所以，如果要实现一个`MVVM`，就必须包含如下几项：

1. 实现一个数据监听器`Observer`用于监听所有数据，如果有数据变动通知`订阅者`。
2. 实现一个指令解析器`Compile`，用于解析模版，完成依赖收集，绑定相应的更新函数。
3. 实现一个观察者`Watcher`，用于连接`Observer`与`Compile`，当数据发生变化时，执行指令绑定的回调函数。



#### 实现一个简易版的MVVM

##### Observer

数据监听器`Observer`使用`Object.defineProperty`重写`getter`,`setter`。完成数据劫持。

```javascript
function Observer(data) {
    if (!data || typeof data !== 'object') return;

    Object.keys(data).forEach((k) => {
        let dep = new Dep();
        let value = data[k];
        // 深度监听
        Observer(value);
        Object.defineProperty(data, k, {
            configurable: true,
            get() {
                Dep.target && dep.add(Dep.target);
                return value
            },
            set(newVal) {
                if (value === newVal) {   // 设置的值和以前值一样就不理它
                    return;
                }
                value = newVal;
                // 深度监听
                Observer(newVal);
                dep.notify();
            }
        })
    })
}
```



##### Watcher

观察者`Watcher`负责链接`Model`与`ViewModel`，当解析模版工作时，遇到响应式数据相关的内容后，创建一个`Watcher`用于监听该数据属性的变化，以及当数据变化时应该触发的操作。

```javascript
// 订阅中心
function Dep() {
    this.subs = []
}
Dep.prototype.add = function (sub) {
    this.subs.push(sub)
}

Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update())
}

// 观察者
function Watcher(data, key, fn) {
    Dep.target = this;
    this.fn = fn;
    this.currentValue = data[key];
    Dep.target = null;
}

Watcher.prototype.update = function () {
    this.fn()
}

```

`Dep`指的是订阅中心，当`Observer`数据属性时，创建一个`dep`实例，使用闭包储存关于该数据属性值的所有`Watcher`，当该值发生变化时，触发`dep.notify()`更新所有数据。

`Watcher`是指观察者，定义`target`是为了关联`Dep`与`Watcher`。



##### Compile

`Compile`函数用于解析模版，在遇到响应式数据相关的模版时，创建一个`Watcher`，传入`data`，`key`，`update`，当`Watcher`创建时,`data[key]`就触发了`getter`函数，从而将该`watcher`加入该对象的`dep`里，完成依赖收集。

```javascript
// 简易版的模版解析，依赖收集
function compile(el, vmData, key) {
        new Watcher(vmData, key, () => {
            document.getElementById(el).innerText = vmData[key];
        })
    }
```



#### Proxy

`Vue2`是基于`Object.defineProperty`实现的`数据劫持`，考虑到`性能`上的影响，并没做`根据数组下标修改数据的响应式`，`Vue2`对于数组数据响应式的支持仅仅局限于数组内置的方法。

`Proxy`与`Object.defineProperty`的对比：

1. `Object.defineProperty`需要对数据进行遍历，修改数据的`getter`，`setter`，劫持数据属性，而`Proxy`是直接代理数据对象

2. `Object.defineProperty`新增属性时，需要手动进行`Observer`

3. `Proxy`支持多种拦截操作，这是 `defineProperty `所不具有的。比如：`get`，`set`，`has`，`deleteProperty`等。

4. 作为新增的标准，长远的说，`JS`引擎会持续优化`Proxy`。`getter`，`setter`基本上不会有新的优化。

5. `Proxy`兼容性差。尤其是`IE`。

   

