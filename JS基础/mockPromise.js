
/**
 * Promise存在三种状态
 * 1. Pending（等待Promise执行完成的状态）
 * 2. Fulfilled（Promise执行成功）
 * 3. Rejected（Promise执行失败）
 */
const Pending = "pending";
const Fulfilled = "fulfilled";
const Rejected = "rejected";

/**
 * MockPromise，定义三个属性：
 * 1. state 存储当前promise的状态
 * 2. value 存储promise成功后的值
 * 3. reason 存储promise失败的原因
 * @param {Function} executor 以resolve与reject为参数
 */
function MockPromise(executor) {
    this.state = Pending;
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
        if (this.state === Pending) {
            this.state = Fulfilled;
            this.value = value;
            this.onFulfilledCallbacks.forEach(func => func())
        }

    }

    let reject = (reason) => {
        if (this.state === Pending) {
            this.state = Rejected;
            this.reason = reason;
            this.onRejectedCallbacks.forEach(func => func())
        }
    }

    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

/**
 *  resolvePromise
 * @param {MockPromise} promise 
 * @param {null | MockPromise} value 
 * @param {Function} resolve 
 * @param {Function} reject 
 */
const resolvePromise = (promise, value, resolve, reject) => {
    if (promise === value) {
        // 不能闭环调用
        reject("can not cycle")
    }

    if (value instanceof MockPromise) {
        let then = value.then;
        if (typeof then === "function") {
            let called = false;
            try {
                // 如果value为promise对象，手动执行then方法
                then.call(value, (value2) => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise, value2, resolve, reject)
                }, (error) => {
                    if (called) return;
                    called = true;
                    reject(error)
                })

            } catch (error) {
                reject(error)
            }
        } else {
            resolve(value)
        }
    } else {
        resolve(value)
    }

}

/**
 * 实现then 
 * then方法参数是两个函数
 * @param {Function} onFulfilled 
 * @param {Function} onRejected 
 */
MockPromise.prototype.then = function (onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    const promise2 = new MockPromise((resolve, reject) => {
        if (this.state === Pending) {
            // 实现异步调用
            this.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    resolvePromise(promise2, onFulfilled(this.value), resolve, reject)
                }, 0)
            })
            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    resolvePromise(promise2, onRejected(this.reason), resolve, reject)
                }, 0)
            })
        } else if (this.state === Fulfilled) {
            setTimeout(() => {
                resolvePromise(promise2, onFulfilled(this.value), resolve, reject)
            }, 0)
        } else if (this.state === Rejected) {
            setTimeout(() => {
                resolvePromise(promise2, onRejected(this.reason), resolve, reject)
            }, 0)
        }
    })
    return promise2
}

/**
 * promise catch
 * @param {Function} fn callback
 */
MockPromise.prototype.catch = function (fn) {
    this.then(null, fn);
}

/**
 * 返回一个resolve状态的promise
 * @param {any} value 
 * @returns MockPromise
 */
MockPromise.resolve = function (value) {
    return new MockPromise((resolve) => {
        resolve(value)
    })
}

/**
 * 返回一个reject状态的promise
 * @param {any} error 
 * @returns MockPromise
 */
MockPromise.reject = function (error) {
    return new MockPromise((__, reject) => {
        reject(error)
    })
}

/**
 * all
 * @param {Array<MockPromise>} mockPromises 
 * @returns MockPromise
 */
MockPromise.all = function (mockPromises) {
    const result = [];
    return new MockPromise((resolve, reject) => {
        mockPromises.forEach((promise, index) => {
            promise.then((value) => {
                result.push(value)
                if (index === mockPromises.length - 1) {
                    resolve(result)
                }
            }).catch((error) => {
                reject(error)
            })
        })
    })
}


new MockPromise((resolve, reject) => {
    setTimeout(() => {
        resolve("mockPromise")
    }, 1000)
}).then((value) => {
    console.log(value);
    return MockPromise.reject("mock reject")
}).then((value) => {
    console.log(value)
}).catch((error) => {
    console.log(error)
})

MockPromise.all([MockPromise.resolve("mock promise1"), MockPromise.resolve("mock promise2")]).then((result) => {
    console.log(result)
})

MockPromise.all([MockPromise.resolve("mock promise1"), MockPromise.reject("mock reject promise2")]).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})