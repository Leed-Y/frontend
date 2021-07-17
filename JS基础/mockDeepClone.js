function isObject(obj) {
    // typeof null的值也是object，这是因为typeof查询的是对象的存储机器码，而null的机器码为0x00，所以会返回object
    return typeof obj === "object" && obj !== null;
}

function mockDeepClone(source) {
    // 1. 判断source是否是object
    if (!isObject(source)) return source;

    // 2.新建一个对象用于存储返回值
    let result = source instanceof Array ? [] : {};
    Object.keys(source).forEach((key) => {
        result[key] = mockDeepClone(source[key]);
    })
    return result;
}

var objWithFunction = {
    data: {
        x: 1
    },
    array: [{ b: 1 }],
    func: function () {
        console.log("oooo");
    }
}

var objWithFunction2 = mockDeepClone(objWithFunction);
objWithFunction.data.x = 2;
objWithFunction.array[0].b = 3;

console.log(objWithFunction);
console.log(objWithFunction2);

function mockDeepClone2(source) {
    let map = new WeakMap()

    function deepClone(source2) {
        var existObj = map.get(source2);
        if (existObj) {
            return existObj
        }
        // 1. 判断source是否是object
        if (!isObject(source2)) return source2;

        // 2.新建一个对象用于存储返回值
        let result = source2 instanceof Array ? [] : {};
        map.set(source2, result);
        Object.keys(source2).forEach((key) => {
            result[key] = mockDeepClone(source2[key]);
        })
        return result;
    }
    return deepClone(source)
}

var obj = {
    a: {
        name: 'a'
    },
    b: {
        name: 'b'
    },
    c: {

    }
};
obj.c.e = obj.a;

var copy = mockDeepClone2(obj);
console.log(copy);