/**
 * mock apply
 * @param {Object} thisArg 
 * @param {Array} argsArray 
 */
Function.prototype.mockApply = function (thisArg, argsArray) {
    //1.判断是否为function
    if (typeof this !== "function") {
        throw Error("must be function")
    }

    //2.判断入参
    if (typeof argsArray === "undefined" || argsArray === null) {
        argsArray = []
    }

    //3. 判断argsArray类型
    if (typeof argsArray !== "object") {
        throw Error("must be object")
    }

    // 在外面传入的 thisArg 值会修改并成为 this 值。
    if (typeof thisArg === 'undefined' || thisArg === null) {
        thisArg = getGlobalObject();
    }

    const __fn = '__' + new Date().getTime();
    thisArg = new Object(thisArg);
    thisArg[__fn] = this;
    const result = thisArg[__fn](...argsArray);
    delete thisArg[__fn];
    return result
}

/**
 * mock call
 * @param {Object} thisArg 
 * @returns 
 */
Function.prototype.mockCall = function (thisArg) {
    var array = [];
    var argumentsLength = arguments.length;
    for (var i = 0; i < argumentsLength - 1; i++) {
        array[i] = arguments[i + 1];
    }
    return this.mockApply(thisArg, array)
}


/**
 * mock bind
 * @param {Object} thisArg 
 * @returns 
 */
Function.prototype.mockBind = function (thisArg) {
    var self = this;
    var args = [].slice.mockCall(arguments, 1);
    return function () {
        var boundArgs = [].slice.mockCall(arguments);
        return self.mockApply(thisArg, args.concat(boundArgs))
    }
}



function doSth(a, b) {
    console.log(this);
    console.log(this.name);
    console.log([a, b])
}

var student = {
    name: "xxx"
}

doSth.mockApply(student, [1, 2])
doSth.mockCall(student, [1, 2])
doSth.mockBind(student)(1, 2)

