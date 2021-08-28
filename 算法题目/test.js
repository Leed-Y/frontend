/**
 * 给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素
 * 你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？
 * 示例 1:
 * 输入: [2,2,1]
 * 输出: 1
 * 示例 2:
 * 输入: [4,1,2,1,2]
 * 输出: 4
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
    return nums.reduce((result, num) => {
        return result ^ num
    }, 0)
};

/**
 * 给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。
 * 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
 * 尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。
 * 
 * 分解：
 * [2,2,1,1,1,2,2]
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {

    if (nums.length === 1) {
        return nums[0]
    }
    let candidate = nums[0];
    let count = 0;
    nums.forEach((n) => {
        if (count === 0) candidate = n;
        count += candidate === n ? 1 : -1;
    })
    return candidate
};




var searchMatrix = function (matrix, target) {
    const xMax = matrix.length - 1;
    const yMax = matrix[0].length - 1;
    let x = xMax;
    let y = 0;

    let result = false;
    while (x >= 0 && x <= xMax && y >= 0 && y <= yMax && !result) {
        console.log(`x:${x},y:${y}`)
        if (target < matrix[x][y]) {
            x--;
        } else if (target > matrix[x][y]) {
            y++;
        } else {
            result = true;
        }
    }
    return result
};

// console.log(searchMatrix([[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5));
// console.log(searchMatrix([[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20));


/**
 * 合并有序数组
 * 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
 * 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。你可以假设 nums1 的空间大小等于 m + n，这样它就有足够的空间保存来自 nums2 的元素。
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
    // 插入排序
    let compareMaxIndex = m - 1;
    let position = 0;

    for (let element of nums2) {
        let insertIndex = compareMaxIndex;
        while (insertIndex >= position && element < nums1[insertIndex]) {
            nums1[insertIndex + 1] = nums1[insertIndex];
            insertIndex--;
        }
        nums1[insertIndex + 1] = element;
        position = insertIndex + 1;
        compareMaxIndex++;
    }
    console.log(nums1);
};

// merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3);
// merge([2, 0], 1, [1], 1);


/**
 * 鸡蛋掉落
 * 动态规划问题
 * 这个问题有什么状态，有什么选择，然后穷举
 * 状态：当前拥有的鸡蛋数k，需要测试的层数n
 * 选择：选择去哪层楼f扔鸡蛋，即确定f
 * 带有状态参数的dp函数表示状态转移，for循环遍历所有选择，选择最优的选择更新状态
 * 二分优化
 * @param {number} k
 * @param {number} n
 * @return {number}
 */
var superEggDrop = function (k, n) {
    const map = new WeakMap();
    /**
     * 
     * @param {number} eggCount 鸡蛋数量
     * @param {number} floorCount 需要搜查的楼层数量
     */
    function dp(eggCount, floorCount) {
        if (eggCount === 1) return floorCount;
        if (floorCount === 0) return 0;
        if (map.has([eggCount, floorCount])) {
            return map.get([eggCount, floorCount])
        }

        let low = 1;
        let high = floorCount;
        let res;

        while (low <= high) {
            const middle = parseInt((low + high) / 2);
            // 状态1:鸡蛋碎了
            const broken = dp(eggCount - 1, middle - 1);
            // 状态2:鸡蛋没碎
            const notBroken = dp(eggCount, floorCount - middle);
            let dpRes;

            if (broken > notBroken) {
                high = middle - 1;
                dpRes = broken + 1;
            } else {
                low = middle + 1;
                dpRes = notBroken + 1;
            }

            if (res) {
                res = Math.min(res, dpRes)
            } else {
                res = dpRes;
            }
        }
        map.set([eggCount, floorCount], res);
        return res
    }
    return dp(k, n);
};

/**
 *如果将抛鸡蛋在算法的角度上来看，要想测到确切的f值，是必须要把所有的楼层都过一遍
 定义一个动态规划 dp[k][m]表示k个鸡蛋操作m次就可以完成检索整个楼层：
 dp[k][m] = n;

 如果随机挑选某一楼层，如果检索所有楼层则需要综合鸡蛋摔坏的状态与鸡蛋没有摔坏的状态再加上1
 dp[k][m] = dp[k-1][m-1] + dp[k][m-1] + 1

 * @param {number} k 
 * @param {number} n 
 */
var superEggDrop2 = function (k, n) {
    /**
     * 根据鸡蛋数和操作次数返回对应检索的楼层
     * @param {number} eggCount
     * @param {number} moves 
     */
    function dp(eggCount, moves) {
        if (eggCount === 0 || moves === 0) return 0;
        return dp(eggCount - 1, moves - 1) + dp(eggCount, moves - 1) + 1
    }

    let m = 0;
    while (dp(k, m) < n) {
        m++;
    }
    return m;
}


/**
 * 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
 */
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
    if (s == null || s.length == 0) return true;
    const isVaild = function (char) {
        return char.match(/[a-z]|[0-9]/g)
    }
    let left = 0;
    let right = s.length - 1;
    let result = true;
    while (left <= right && result) {
        if (!isVaild(s[left].toLowerCase())) {
            left++;
        } else if (!isVaild(s[right].toLowerCase())) {
            right--;
        } else if (s[left++].toLowerCase() !== s[right--].toLowerCase()) {
            result = false
        }
    }
    return result
};
// console.log(isPalindrome("A man, a plan, a canal: Panama"));
// console.log(isPalindrome("race a car"));
// console.log(isPalindrome("  "));

/**
 * 给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。
 */
/**
 * 设计一个函数用于表示字符串可以分割成多少中不同连续字串
 * 状态为子串的长度n
 * 两种状态：
 * fn(n,desc)
 * 从前到后+从后到前 dp(n) = fn(n,true) + fn(n,false)
 * 
 * 以回文串长度为key
 * "aab"
 * 1
 * [[a][a][b]]
 * 2
 * [[aa][b]]
 * [[a][ab]]
 * 3
 * [[aab]]
 * 
 * @param {string} s
 * @return {string[][]}
 */
var partition = function (s) {
    const map = new WeakMap();
    function dp(i, j) {
        if (map.has([i, j])) {
            return map.get([i, j])
        }
        let res;
        if (j - i <= 2) {
            res = s[i] === s[j]
        } else {
            res = s[i] === s[j] && dp(i + 1, j - 1)
        }

        map.set([i, j], res);
        return res;
    }
    const result = [], ans = [];
    const n = s.length;

    const dfs = (i) => {
        if (i === n) {
            result.push(ans.slice());
            return;
        }
        for (let j = i; j < n; ++j) {
            if (dp(i, j)) {
                ans.push(s.slice(i, j + 1));
                dfs(j + 1);
                ans.pop();
            }
        }
    }
    dfs(0);
    return result;
};


// console.log(partition("aab"));
// console.log(partition("a"));

/**
 * 给定一个非空字符串 s 和一个包含非空单词的列表 wordDict，判定 s 是否可以被空格拆分为一个或多个在字典中出现的单词。
 * 动态规划：
 * applepenapple
 */

/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    const context = new Array(s.length + 1).fill(false);
    context[0] = true;
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < s.length; j++) {
            if (context[j] && wordDict.includes(s.substr(j, i - j))) {
                context[i] = true;
                break;
            }
        }
    }
    return context[s.length]
};

// console.log(wordBreak("applepenapple", ["apple", "pen"]))

/**
 * 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
 * 子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。
 * 
 * 1.定义dp
 * 设dp[i]为前i个元素，以第i个数字结尾的最长上升子序列的长度
 * 
 * 2.因为要求最长递增子序列的长度，所以一个正常的上升子序列，是必须满足nums[i] > nums[j],0<j<i
 * dp[i] = max(dp[i] , dp[j] + 1)
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
    const dp = new Array(nums.length).fill(1);

    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp)
};

/**
 * 贪心算法 + 二分法
 * @param {array} nums 
 * @returns 
 */
var lengthOfLIS2 = function (nums) {
    const dp = [];
    let res = 0;

    for (let num of nums) {
        if (res === 0 || num > dp[res - 1]) {
            dp[res++] = num
        } else {
            let left = 0, right = res;
            while (left < right) {
                const middle = Math.floor((left + right) / 2);
                if (num > dp[middle]) {
                    left = middle + 1
                } else {
                    right = middle
                }
            }
            dp[right] = num;
        }
    }
    return res
};
// console.log(lengthOfLIS2([10, 9, 2, 5, 3, 7, 101, 18]));
// console.log(lengthOfLIS2([1, 3, 6, 7, 9, 4, 10, 5, 6]));


/**
 * 给定一个未排序的整数数组，找到最长递增子序列的个数。
 * [1,3,5,4,7]
 * 
 * [1,3,4,7]
 * [1,3,5,7]
 * 
 * @param {number[]} nums
 * @return {number}
 */
var findNumberOfLIS = function (nums) {
    const dp = new Array(nums.length).fill(1);
    const count = new Array(nums.length).fill(1);

    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    count[i] = count[j];
                } else if (dp[j] + 1 === dp[i]) {
                    // 说明count数据需要增加
                    count[i] += count[j];
                }
            }
        }
    }
    const maxlength = Math.max(...dp);
    return dp.reduce((res, len, i) => {
        if (maxlength === len) {
            res += count[i]
        }
        return res
    }, 0)
};

// console.log(findNumberOfLIS([1, 3, 5, 4, 7]))
console.log(findNumberOfLIS([100, 90, 80, 70, 60, 50, 60, 70, 80, 90, 100]))