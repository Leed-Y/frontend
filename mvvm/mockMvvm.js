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

// 监听对象
function Observer(data) {
    if (!data || typeof data !== 'object') return;
    let dep = new Dep();
    Object.keys(data).forEach((k) => {
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



// Compile模版解析
function Compile(vm) {
    new Watcher(vm, "a", () => {
        document.getElementById("test").innerText = vm["a"];
    })
}