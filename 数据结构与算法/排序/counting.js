/**
 * 用到了桶的概念
 * 计数排序是非比较排序的一种排序方法，要求输入数据必须是限定范围内的整数
 * 排序是使用了数组下标天然排序的特点
 * 
 * 1.为什么是整数
 * 因为计数排序用到了桶的概念，在计数排序中，会以输入数据的值作为key存储输入数据同样值出现的次数，所以必须是整数
 *
 * 2.为什么是限定范围内
 * 因为计数排序需要用输入数据的值作为key，如果不限定范围，会导致使用大量的空间，如：
 * [1,2]使用的空间是长度为2的连续空间
 * [1,100]使用的是长度为100的连续空间
 */

function sort(array) {
    console.time("计数排序耗时:")
    const bucket = [];

    array.forEach(element => {
        bucket[element] = bucket[element] ? bucket[element] + 1 : 1;
    });

    let sortIndex = 0;
    bucket.forEach((count, element) => {
        if (count && count > 0) {
            let limit = count;
            while (limit > 0) {
                array[sortIndex] = element;
                sortIndex++;
                limit--;
            }
        }
    })
    console.timeEnd("计数排序耗时:")
    return array
}

const arr = [2, 2, 3, 8, 7, 1, 2, 2, 2, 7, 3, 9, 8, 2, 1, 4, 2, 4, 6, 9, 2];
console.log(sort(arr));
