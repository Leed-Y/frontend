/**
 * 选择排序
 * 选择排序的原理很简单，在未排序的数组里持续找出最小值，然后按顺序放至已排序的数组中
 * 时间复杂度：O(n^2)，最坏情况：O(n^2)，最好情况：O(n^2)
 * 数据规模越小越好
 * 选择排序，狗都不用
 */

/**
 * 选择排序
 * @param {Array} array 数组
 */
function selectionSort(array){
    // 定义一个最小值的index，默认为0
    let minIndex = 0;
    console.time("选择排序耗时");

    for (let i = 0; i < array.length - 1; i++) {
        minIndex = i;

        for(let j = i + 1; j < array.length; j++) {
            if(array[j] < array[minIndex]){
                // 记录最小值的index
                minIndex = j;
            }
        }

        const temp = array[i];
        array[i] = array[minIndex];
        array[minIndex] = temp;
    }
    console.timeEnd("选择排序耗时");
    return array
}

// 混乱排序测试
console.log(selectionSort([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.822ms