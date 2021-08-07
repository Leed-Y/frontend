/**
 * 插入排序
 * 算法描述：构建已排序序列，每遍历一个数据，就判断该数据在已排序序列中的位置并移动该数据到应在的位置
 * 时间复杂度：
 * 最好情况：O(n)
 * 最坏情况：O(n^2)
 * 平均：O(n^2)
 */

/**
 * 插入排序 新增数组
 * @param {Array} array 数组
 */
function sort(array){
    console.time("插入排序耗时")
    const sorted = [];
    for (const element of array) {
        if(sorted.length === 0){
            sorted.push(element);
        }else {
            // 1. 设置compare为已排序数组的最后一个元素，与element比较
            // 2. 若element > compare，在此位置插入数据
            // 3. 若element < compare， 更新compare值，继续比较
            // 4. 一直到compare值为已排序数组第一个元素
            let compareIndex = sorted.length - 1;
            let finish = false;
            while(!finish && compareIndex>=0){
                if(element > sorted[compareIndex]){
                    sorted.splice(compareIndex+1,0,element);
                    finish = true;
                }else if(compareIndex === 0){
                    sorted.unshift(element);
                    finish = true;
                }else{
                    --compareIndex;
                }
                
            }
        }
    }
    console.timeEnd("插入排序耗时")
    return sorted;
}

/**
 * 插入排序，最主要的是寻找插入位置
 * @param {Array} array 数组
 */
 function sort2(array){
    console.time("插入排序2耗时");
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        let compareIndex = i - 1;
        // 寻找插入位置
        while(compareIndex >= 0 && element < array[compareIndex]){
            // 预留插入位置
            array[compareIndex + 1] = array[compareIndex];
            compareIndex--;
        }
        array[compareIndex + 1] = element;
    }
    console.timeEnd("插入排序2耗时")
    return array;
}

/**
 * 二分法插入排序，使用二分法查找插入范围，在插入范围内为预插入值预留位置，二分法插入排序不一定要比传统插入排序效果好，但在应对大数据量乌龟问题时会有奇效
 * @param {Array} array 数组
 */
function sort3(array){
    console.time("插入排序3耗时");
    for (let i = 1; i < array.length; i++) {
        const element = array[i];
        let left = 0;
        let right = i - 1;

        // 寻找插入范围
        while(right >= left){
            const middle = parseInt((left + right) / 2);
            if(element > array[middle]){
                left = middle + 1;
            }else {
                right = middle - 1;
            }
        }

        // 预留位置
        for (var j = i - 1; j >= left; j--) {
            array[j + 1] = array[j];
        }
        array[left] = element;
    }
    console.timeEnd("插入排序3耗时");
    return array
}

console.log(sort([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.110ms
console.log(sort2([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.019ms
console.log(sort3([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//0.189ms