/**
 * EventBus
 */
class EventBus {
    constructor() {
        this._events = new Map();
        this.maxListenerSize = 10;
    }
}

/**
 * 注册on方法
 * @param {String} eventType 
 * @param {Function} fn 
 */
EventBus.prototype.on = function (eventType, fn) {
    if (this._events.has(eventType)) {
        const _events = this._events.get(eventType);
        _events.push(fn);
        this._events.set(eventType, _events)
    } else {
        this._events.set(eventType, [fn])
    }
}

/**
 * 注册emit方法
 * @param {String} eventType 
 * @param  {...any} args 
 */
EventBus.prototype.emit = function (eventType, ...args) {
    if (!this._events.has(eventType)) {
        return;
    }

    const fnArray = this._events.get(eventType);
    for (let i = 0; i < fnArray.length; i++) {
        const handler = fnArray[i];
        if (args.length > 0) {
            handler.apply(this, args);
        } else {
            handler.call(this);
        }
    }
}

const eventBus = new EventBus();
// 监听同一个事件名
eventBus.on('arson', man => {
    console.log(`expel ${man}`);
});
eventBus.on('arson', man => {
    console.log(`save ${man}`);
});

eventBus.on('arson', man => {
    console.log(`kill ${man}`);
});

eventBus.emit("arson", "first");
eventBus.emit("arson", "second");