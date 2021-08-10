/**
 * 快速排序
 * 算法理念：
 * 1.选取一个基准值
 * 2.以基准值为标准分为两个分区，作分区排序
 * 3.对每个分区都做递归快速排序
 * 最佳情况：T(n) = O(nlogn)
 * 最差情况：T(n) = O(n2)
 * 平均情况：T(n) = O(nlogn)
 *
 */

/**
 * 数据交换函数
 * @param {Array} arr 数组
 * @param {Number}} i 交换数据Index
 * @param {Number} j 交换数据Index
 */
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/**
 * 1.设置基准值
 * 2.从left开始遍历数组数据，到right结束
 * 3.与基准值进行比较，小于基准值将基准值与基准值进行交换
 * @param {Array} array 待分区数组
 * @param {Number} left 数组分区的开始index
 * @param {Number} right 数组分区的结束index
 */
function partition(array, left, right) {
    // 设置基准值
    const pivotVal = array[left];
    // 基准值最终插入的数据索引
    let pivotIndex = left;

    // 遍历数据
    for (let i = left + 1; i <= right; i++) {
        // 小于基准index值时
        if (array[i] < pivotVal) {
            // pivotIndex自增，表示基准值前应多出一个位置放至新数据
            pivotIndex++;
            // 移动数据，此时基准值的数据位置仍是left位置
            swap(array, i, pivotIndex);
        }
    }
    //将基准值与最终插入的基准值数据索引位置作交换
    swap(array, left, pivotIndex);
    return pivotIndex;
}

function sort(arr, left, right) {
    var len = arr.length,
        partitionIndex,
        left = typeof left != 'number' ? 0 : left,
        right = typeof right != 'number' ? len - 1 : right;

    if (left < right) {
        partitionIndex = partition(arr, left, right);
        sort(arr, left, partitionIndex - 1);
        sort(arr, partitionIndex + 1, right);
    }
    return arr;
}


const arr = [5, 3, 7, 6, 4, 1, 0, 2, 9, 10, 8];
console.log(sort(arr, 0, arr.length - 1));
