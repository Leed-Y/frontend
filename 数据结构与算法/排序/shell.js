/**
 * 希尔排序
 * 希尔排序是基于直接插入排序的优化版，直接插入排序的问题在于，每次移动的范围有限。
 * 希尔排序的理论依据是：在最后的直接插入排序之前，批量优化数据的有序性
 * 希尔排序的实现思路：
 * 设置增量，根据增量将待排序数组分为多组直接排序，优化待排序数组的有序性。最后进行直接插入排序；
 * 假设待排序数组长度为10：
 * 当增量为4时，需要进行如下几组排序：
 * [0,4,8]
 * [1,5,9]
 * [2,6,10]
 * [3,7]
 * 依此类推：
 * 随着增量的减少，待排序数据的有序性会越来越高,一直等到增量为1时，进行直接插入排序。
 * 
 * 时间复杂度：
 * 最好情况：O(nlog^2n)
 * 最坏情况：O(nlog^2n)
 * 平均情况：O(nlog^2n)
 */

/**
 * 希尔排序
 * @param {Array} array 
 */
function sort(array){
    console.time("希尔排序耗时");
    let gap = 4;
    for (gap; gap > 0; gap = Math.floor(gap/2)) {
        for (var i = gap; i < array.length; i++) {
            const temp = array[i];
            for (var j = i-gap; j >= 0 && array[j] > temp; j-=gap) {
                array[j+gap] = array[j];
            }
            array[j+gap] = temp;
        }
    }
    console.timeEnd("希尔排序耗时");
    return array;
}
console.log(sort([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.098ms