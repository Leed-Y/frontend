/**
 * 桶排序的思想就是将数据分到有限数量的桶里，每个桶再作排序，最后将每个桶作合并
 * 1.如何保证不同桶之间的排序顺序
 * 首先先获取到输入数据的最大值和最小值，取其差值除以桶的数量，这样就能获取到每个桶需要存储的数据范围，遍历输入数据，
 * 每个数据与最小值的差值再除以每个桶需要存储的数据范围，就能得到数据对应的桶
 *
 * 2.如何保证桶内的排序
 * 桶内的数据是一个逐步增加的过程，可以使用插入排序完成排序
 */

function sort(array, bucketCount) {
    let min = array[0];
    let max = array[0];
    const buckets = [];
    console.time("桶排序耗时:");

    array.forEach(ele => {
        min = Math.min(min, ele);
        max = Math.max(max, ele);
    });

    const space = (max - min) / bucketCount;

    array.forEach(ele => {
        const bucketIndex = Math.floor((ele - min) / space);
        if (buckets[bucketIndex]) {
            // 有数据，作插入排序
            let insertIndex = buckets[bucketIndex].length - 1;
            while (insertIndex >= 0 && ele < buckets[bucketIndex][insertIndex]) {
                // 调整
                buckets[bucketIndex][insertIndex + 1] = buckets[bucketIndex][insertIndex];
                insertIndex--;
            }
            buckets[bucketIndex][insertIndex + 1] = ele;
        } else {
            buckets[bucketIndex] = [ele];
        }
    })
    const result = buckets.flatMap(x => x);
    console.timeEnd("桶排序耗时:");
    return result
}

const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(sort(arr, 4));
