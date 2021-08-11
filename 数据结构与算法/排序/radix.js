/**
 * 基数排序，与桶排序类似，都使用到了桶的概念。不同的是，桶排序的key是通过桶的数量，数据的最大值，最小值计算出来的
 * 基数排序桶的key值就是其在对应位数上的值。
 * 比如：[3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
 * 第一次排序以个位上的值为key作计数排序,排序后结果为：
 * [50, 2, 3, 4, 44, 5, 15, 36, 26, 46, 47, 27, 38, 48, 19]
 * 第二次排序以十位上的值为key作计数排序，排序后结果为:
 * [2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]
 * 排序完成
 */


/**
 * 基数排序
 * @param {Array} array 输入数据
 * @param {Number} maxDigit 位数
 * @returns 
 */
function sort(array, maxDigit) {
    let buckets = [];
    let mod = 10;
    let dev = 1;
    console.time("基数排序耗时:")

    for (let digit = 0; digit < maxDigit; digit++, mod *= 10, dev *= 10) {
        // 计数排序法
        array.forEach(element => {
            // 获取数据在当前位数上的值，以此为key构造bucket
            const bucketIndex = parseInt(element % mod / dev);
            if (!buckets[bucketIndex]) {
                buckets[bucketIndex] = [];
            }
            buckets[bucketIndex].push(element);
        });

        let insertIndex = 0;
        buckets.forEach((bucket) => {
            if (bucket) {
                while (bucket.length > 0) {
                    array[insertIndex++] = bucket.shift();
                }
            }
        })

        // 当前位数完成，清空buckets
        buckets = [];
    }
    console.timeEnd("基数排序耗时:")
    return array

}
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(sort(arr, 2))