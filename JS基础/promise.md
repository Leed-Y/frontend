### Promise

#### Promise 状态

```javascript
/**
 * Promise存在三种状态
 * 1. Pending（等待Promise执行完成的状态）
 * 2. Fulfilled（Promise执行成功）
 * 3. Rejected（Promise执行失败）
 */
const Pending = "pending";
const Fulfilled = "fulfilled";
const Rejected = "rejected";
```

#### Promise 的基本属性

```javascript
/**
 * MockPromise，定义三个属性：
 * 1. state 存储当前promise的状态
 * 2. value 存储promise成功后的值
 * 3. reason 存储promise失败的原因
 * @param {Function} executor 以resolve与reject为参数
 */
function MockPromise(executor) {
  this.state = "pending";
  this.value = undefined;
  this.reason = undefined;

  let resolve = (value) => {
    if (this.state === "pending") {
      this.value = value;
      this.state = "fulfilled";
    }
  };

  let reject = (reason) => {
    if (this.state === "pending") {
      this.reason = reason;
      this.state = "rejected";
    }
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}
```

#### Promise 的 then 方法

##### 初始版

```javascript
/**
 * 实现then then方法参数是两个函数
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 */
MockPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.state === "fulfilled") {
    onFulfilled(this.value);
  }
  if (this.state === "rejected") {
    onRejected(this.value);
  }
};
```

初始版的`Promise`已经具备了基础能力。但是还缺少两个能力：

1. 异步调用的能力
2. 链式调用的能力

##### 实现异步调用

实现异步调用的核心思想在于，`通过判断Promise的状态，当Promise为pending状态时，将回调方法暂存起来，然后在最终结果出来后，依次调用回调函数`；

```javascript
function MockPromise(executor) {
  this.state = "pending";
  this.value = undefined;
  this.reason = undefined;

  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  let resolve = (value) => {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      this.onFulfilledCallbacks.forEach((func) => func());
    }
  };

  let reject = (reason) => {
    if (this.state === "pending") {
      this.state = "rejected";
      this.reason = reason;
      this.onRejectedCallbacks.forEach((func) => func());
    }
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MockPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.state === "pending") {
    this.onFulfilledCallbacks.push(() => {
      onFulfilled(this.value);
    });
    this.onRejectedCallbacks.push(() => {
      onRejected(this.reson);
    });
  }

  if (this.state === "fulfilled") {
    onFulfilled(this.value);
  }
  if (this.state === "rejected") {
    onRejected(this.reson);
  }
};
```

##### 实现链式调用

实现链式调用的核心思想在于，`在then方法结束后返回promise实例，同时对于then方法中使用回调函数生成的值做解析处理，如果回调函数生成的值还是promise，就要继续进行处理`。

```javascript
const resolvePromise = (promise, value, resolve, reject) => {
  if (promise === value) {
    // 不能闭环调用
    reject("can not cycle");
  }

  if (value instanceof MockPromise) {
    let then = value.then;
    if (typeof then === "function") {
      let called = false;
      try {
        // 如果value为promise对象，手动执行then方法
        then.call(
          value,
          (value2) => {
            if (called) return;
            called = true;
            resolvePromise(promise, value2, resolve, reject);
          },
          (error) => {
            if (called) return;
            called = true;
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(value);
    }
  } else {
    resolve(value);
  }
};

MockPromise.prototype.then = function (onFulfilled, onRejected) {
  // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  // onRejected如果不是函数，就忽略onRejected，直接扔出错误
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err;
        };

  const promise2 = new MockPromise((resolve, reject) => {
    if (this.state === Pending) {
      // 实现异步调用
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          resolvePromise(promise2, onFulfilled(this.value), resolve, reject);
        }, 0);
      });
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          resolvePromise(promise2, onRejected(this.reason), resolve, reject);
        }, 0);
      });
    } else if (this.state === Fulfilled) {
      setTimeout(() => {
        resolvePromise(promise2, onFulfilled(this.value), resolve, reject);
      }, 0);
    } else if (this.state === Rejected) {
      setTimeout(() => {
        resolvePromise(promise2, onRejected(this.reason), resolve, reject);
      }, 0);
    }
  });
  return promise2;
};
```
