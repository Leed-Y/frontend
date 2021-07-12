#### 运行时绑定的This

##### This的值是怎么获取的？

###### 调用场景角度分析this指向

一般来说，`this`存在几种调用场景：

1. 作为对象调用时，指向该对象。

   ```javascript
   var obj = {
     a:1,
     b:function(){
       console.log(this.a)
     }
   };
   obj.b(); // 1
   ```

2. 作为函数独立调用时，指向全局window。

   ```javascript
   var b = function(){
     console.log(this);
   };
   b();
   
   ```

3. 作为构造函数调用时，this指向当前实例对象。

   ```javascript
   var b = function() {
     console.log(this);
   };
   var x = new b();
   ```

4. 作为call与apply调用时，this指向当前的object。

   ```javascript
   var a = {x:1};
   var b = {
     x:2,
     func:function(){
       console.log(this.x);
     }
   };
   b.func();//2
   b.func.call(a);//1
   ```

