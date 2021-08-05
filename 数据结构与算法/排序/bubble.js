/**
 * 算法描述：
 * 比较相邻的数据，如果第一个比第二个大，就进行交换。对每一对数据作同样的操作，这样在每一次排序后最后的元素就是最大的数。
 */

/**
 * 冒泡排序，普通的冒泡排序将所有的数据全遍历
 * 冒泡排序的算法意味着，每一次排序完成都会出现一个排序后的`最大值`或`最小值`，所以优化也是基于此特点进行优化
 * 普通版冒泡排序：
 * 时间复杂度：O(n^2)，最好情况：O(n^2)，最坏情况：O(n^2)
 * @param {Array} array 排序数组
 */
function bubbleSort(array){
    console.time('冒泡排序耗时');
    for (let i = 0; i < array.length; i++) {
        //外层的循环每次都会确定一个最大值
        for (let j = 0; j < array.length-1-i; j++) {
            if(array[j] > array[j+1]){
                const temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
            }
        }
    }
    console.timeEnd('冒泡排序耗时');
    return array
}

/**
 * 主要设置一个变量pos，pos用于记录每次排序完成后的位置，减少遍历数
 * 标志位冒泡排序
 * 时间复杂度：O(n^2)，最好情况：O(n)，最坏情况：O(n^2)
 * @param {Array} array 数组
 */
function bubbleSort2(array){
    console.time('改进后冒泡排序耗时');
    // 将标志位设为最后一位
    let index = array.length - 1;
    // 循环条件：标志位为0
    while(index > 0){
        let pos = 0;
        for (let i = 0; i < index; i++) {
            if(array[i] > array[i+1]){
                // 记录排序时的position，pos一定是当前排序完成的最后一个
                pos = i;
                const temp = array[i];
                array[i] = array[i+1];
                array[i+1] = temp;
            }
        }
        // pos位置后的列表一定已经排序完成，所以下一次排序只需要扫描到pos位置即可
        index = pos
    }
    console.timeEnd('改进后冒泡排序耗时');
    return array
}

/**
 * 基于传统的冒泡算法每次排序只得到一个`最大值`或`最小值`，改进后的冒泡算法考虑在每次排序中进行正向，反向排序，一次得到两个最终值。
 * 相较于单向冒泡算法，双向冒泡能有效的处理`乌龟问题`，即当一个长数组中，最小的值处于最后的位置时
 * 时间复杂度：O(n^2)，最好情况：O(n)，最坏情况：O(n^2)
 * @param {Array} array 数组
 */
function bubbleSort3(array){
    let lowIndex = 0;
    let highIndex = array.length - 1;

    console.time('双向冒泡排序耗时');
    while(lowIndex < highIndex){
        // 正向冒泡，找最大值
        for (let i = lowIndex; i < highIndex; i++) {
            if(array[i] > array[i+1]){
                const temp = array[i];
                array[i] = array[i+1];
                array[i+1] = temp;
            }
        }
        // 最大值index前移
        highIndex--;

        // 反向冒泡，找最小值
        for (let j = highIndex; j > lowIndex; j--) {
            if(array[j] < array[j-1]){
                const temp = array[j];
                array[j] = array[j-1];
                array[j-1] = temp;
            }
        }
        // 最小值index后移
        lowIndex++;
    }
    console.timeEnd('双向冒泡排序耗时');
    return array;
}

// 混乱排序测试
console.log(bubbleSort([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.100ms
console.log(bubbleSort2([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.018ms
console.log(bubbleSort3([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.021ms

// 完全正向排序测试
console.log(bubbleSort([2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]));//0.132ms
console.log(bubbleSort2([2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]));//0.007ms
console.log(bubbleSort3([2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]));//0.015ms

// 完全逆向排序测试
console.log(bubbleSort([2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50].reverse()));//0.102ms
console.log(bubbleSort2([2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50].reverse()));//0.022ms
console.log(bubbleSort3([2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50].reverse()));//0.022ms

//乌龟问题排序测试
console.log(bubbleSort([3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50,2 ]));//0.100ms
console.log(bubbleSort2([3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50,2]));//0.022ms
console.log(bubbleSort3([3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50,2]));//0.017ms