/**
 * 归并排序
 * 算法理念：分而治之的理念，将待排序的数组拆分为多个子序列，归并排序后合并
 */

/**
 * 归并排序最终的数组一定是单数据数组与单数据数组，所以排序只需要关注两个数组内的第一个数据大小
 * @param {Array} left 数组
 * @param {Array} right 数组
 */
 function merge(left,right){
     const result = [];

     while(left.length && right.length){
         if(left[0] > right[0]){
            result.push(right.shift());
         }else {
            result.push(left.shift());
         }
     }

     while (left.length){
         result.push(left.shift())
     }

     while (right.length){
        result.push(right.shift())
    }
    return result;
}

/**
 * 归并排序
 * @param {Array} array 数组
 */
function sort(array) {
    if(array.length < 2){
        return array;
    }
    const middle = Math.floor(array.length / 2);
    const left = array.slice(0,middle);
    const right = array.slice(middle);
    return merge(sort(left),sort(right));
}

console.log(sort([3,44,38,5,47,15,36,26,27,2,46,4,19,50,48]));//