/**
 * 给你一个二维整数数组 envelopes ，其中 envelopes[i] = [wi, hi] ，表示第 i 个信封的宽度和高度。
 * 当另一个信封的宽度和高度都比这个信封大的时候，这个信封就可以放进另一个信封里，如同俄罗斯套娃一样。
 * 请计算 最多能有多少个 信封能组成一组“俄罗斯套娃”信封（即可以把一个信封放到另一个信封里面）。
 */
/**
 * 1.状态定义
 * dp[i]位为第i个信封作为最大信封组成的俄罗斯套娃信封所需要的信封数量
 * 
 * 2.状态转移
 * (1).当wi>wj && hi>hj时，dp[i] = max(dp[i],dp[j] + 1)
 * (2).如果不存在j，满足上述条件的话，dp[i] = 1
 * 
 * @param {number[][]} envelopes
 * @return {number}
 */
var maxEnvelopes = function (envelopes) {
    envelopes.sort((a, b) => a[0] - b[0]);
    const dp = new Array(envelopes.length).fill(1);

    for (let i = 0; i < envelopes.length; i++) {
        for (let j = 0; j < i; j++) {
            if (envelopes[i][0] > envelopes[j][0] && envelopes[i][1] > envelopes[j][1]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    console.log(dp);
    return Math.max(...dp)
};



var maxEnvelopes2 = function (envelopes) {
    // 升序数组
    envelopes.sort((a, b) => {
        if (a[0] === b[0]) {
            return b[1] - a[1]
        } else {
            return a[0] - b[0]
        }
    });
    console.log(envelopes)


    const f = [envelopes[0][1]];
    for (let i = 1; i < envelopes.length; ++i) {
        const num = envelopes[i][1];
        if (num > f[f.length - 1]) {
            f.push(num);
        } else {
            let low = 0, high = f.length - 1;
            while (low < high) {
                const mid = Math.floor((high - low) / 2) + low;
                if (f[mid] < num) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            f[low] = num;
        }
        console.log(f)
    }

    console.log(f);
    return f.length
};

// console.log(maxEnvelopes2([[5, 4], [6, 4], [6, 7], [2, 3]]));
// console.log(maxEnvelopes2([[1, 1], [1, 1], [1, 1]]));
// console.log(maxEnvelopes2([[4, 5], [4, 6], [6, 7], [2, 3], [1, 1]]))


/**
 * 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
 */
/**
 * 1.状态定义
 * dp[i]是以i下标结束的数组最大的连续子数组的和
 * 
 * 2.状态转移
 * dp[i] = max(nums[i], dp[i-1] + nums[i])
 * 对于j===0来说
 * dp[i] = nums[0]
 * 
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    const dp = new Array(nums.length);

    for (let i = 0; i < nums.length; i++) {
        if (i === 0) {
            dp[i] = nums[0];
        } else {
            dp[i] = Math.max(nums[i], dp[i - 1] + nums[i])
        }
    }
    return Math.max(...dp)
};
// console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
// console.log(maxSubArray([-2, 1]))

/**
 * 给你一个整数数组 nums ，请你找出数组中乘积最大的连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
 * 设dp[i]为以下标为i的连续子数组的最大乘积
 * dp[i] = max(nums[i],dp[i-1]*nums[i])
 * 正负影响
 * 当nums[i] < 0，则dp[i-1]最好取最小的值
 * 当nums[i] > 0，则dp[i-1]最好取最大的值
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
    const symbolDp = new Array(nums.length).fill(new Array(2));
    const dp = new Array(nums.length);

    for (let i = 0; i < nums.length; i++) {
        if (i === 0) {
            symbolDp[i] = nums[0] > 0 ? [nums[0], 1] : [1, nums[0]];
            dp[i] = nums[0];
        } else {
            if (nums[i] > 0) {
                symbolDp[i] = [Math.max(nums[i], symbolDp[i - 1][0] * nums[i]), Math.min(nums[i], symbolDp[i - 1][1] * nums[i])];
            } else {
                symbolDp[i] = [Math.max(nums[i], symbolDp[i - 1][1] * nums[i]), Math.min(nums[i], symbolDp[i - 1][0] * nums[i])]
            }
            dp[i] = Math.max(...symbolDp[i]);
        }
    }
    return Math.max(...dp)
};

var maxProduct2 = function (nums) {
    let maxF = nums[0];
    let minF = nums[0];
    let ans = nums[0];

    for (let i = 1; i < nums.length; i++) {
        const max = maxF;
        const min = minF;
        maxF = Math.max(max * nums[i], Math.max(nums[i], nums[i] * min));
        minF = Math.min(min * nums[i], Math.min(nums[i], nums[i] * max));
        ans = Math.max(ans, maxF);
    }
    return ans
};
// console.log(maxProduct([2, 3, -2, 4]));
console.log(maxProduct2([-2, 3, -4]));
