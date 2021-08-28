### Webpack

#### 基本概念

##### 入口(entry)

`入口(entry)`指`webpack`应该处理的模块的起点文件，由起点文件开始，`webpack`会找出有哪些模块和库是起点文件所依赖的。

支持配置多起点文件，常见场景如下：

- 分离应用程序文件与第三方库

  一般来说，第三方库的文件不会被修改，所以打包成独立的`chunk`有利于浏览器缓存，减少加载时间。

- 多页面应用程序

  在同一应用中，会出现不同业务场景的页面，使用多入口的方式可以使业务间独立。

示例如下：

```javascript
module.exports = {
  entry: {
    main: "./src/app.js",
    vendor: "./src/vendor.js",
  },
};
```

##### 输出(output)

`输出(output)`指`webpack`处理模块后应该输出的文件名称及路径。`webpack`要求只存在一个`output`配置，当存在多个入口时，可以通过占位符为每个入口生成名称不同的文件。

示例如下：

```javascript
module.exports = {
  entry: {
    main: "./src/app.js",
    vendor: "./src/vendor.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
};
// 写入到硬盘：./dist/app.js, ./dist/search.js
```

##### loader

`loader`用于对模块的源代码进行转换。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader，它是一个转换器，将 A 文件进行编译成 B 文件。

###### 使用 loader

1. 配置方式

   在 **webpack.config.js** 文件中指定 loader。配置文件允许配置多个 loader，loader 执行顺序为**由右至左**，或**由下至上**。

   示例如下：

   ```javascript
   module.exports = {
     module: {
       rules: [
         {
           test: /\.css$/,
           use: [
             // [style-loader](/loaders/style-loader)
             { loader: "style-loader" },
             // [css-loader](/loaders/css-loader)
             {
               loader: "css-loader",
               options: {
                 modules: true,
               },
             },
             // [sass-loader](/loaders/sass-loader)
             { loader: "sass-loader" },
           ],
         },
       ],
     },
   };
   // 对于css文件，优先进行`sass-loader`,`css-loader`,`style-loader`
   ```

2. 内联方式

   可以在 `import` 语句指定 loader。使用 `!` 将资源中的 loader 分开。每个部分都会相对于当前目录解析。

###### 常见的 loader

1. 样式类
   - `sass-loader`，将`sass`或`scss`文件编译为`CSS`。
   - `css-loader`，会对 `@import` 和 `url()` 进行处理，将 `CSS `转化成 `CommonJS` 模块，使`css`可以像`js`文件一样被引用。
   - `style-loader`，将`CSS`插入到`Dom`中
2. JS 文件编译类
   - `vue-loader`，将定义过的其他规则复制并应用到`.vue`文件中相应语言的块，比如`<script lang="js">`就会被设置了`/\.js$/`的规则识别。样式也类似。
   - `ts-loader`，将`.ts`，`.tsx`编译成`js`，`ts-loader`内部调用了`TypeScript`的`tsc`指令，所以`ts-loader`与`tsc`共享`tsconfig.json`。
   - `babel-loader`，根据`babel.config.js`可以处理`js`文件，一般用于将`Es6`语法转换成浏览器可执行的`js`语法，可以配置`cacheDirectory`选项用于缓存`babel-loader`处理的结果。
3. 其他
   - `file-loader`，用于处理在`js`文件中直接引用的资源文件，`file-loader`会将该文件生成到输出目录，并在`js`引用处返回该文件的地址。
   - `svg-sprite-loader`，将`svg`文件生成`icon`雪碧图

##### 插件(plugin)

**插件** 是 webpack 的主要功能。Webpack 自身也是构建于你在 webpack 配置中用到的 **相同的插件系统** 之上。插件目的在于解决**loader**无法实现的**其他事**。基于`Tapable`的`compiler`是核心。

`plugin`是一个扩展器，针对的是`loader`结束后，`webpack`打包的整个过程，不直接操作文件，而是基于事件机制工作，会监听`webpack`打包过程中某些节点，执行自定义任务。

##### target

由于 JavaScript 既可以编写服务端代码也可以编写浏览器代码，所以 webpack 提供了多种部署 _target_，你可以在 webpack 的配置文件中进行设置。默认为`web`。

```javascript
module.exports = {
  target: "node",
};
```

多`target`配置如下：

```javascript
const path = require("path");
const serverConfig = {
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "lib.node.js",
  },
  //…
};

const clientConfig = {
  target: "web", // <=== 默认为 'web'，可省略
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "lib.js",
  },
  //…
};

module.exports = [serverConfig, clientConfig];
// 将会在 dist 文件夹下创建 lib.js 和 lib.node.js 文件。
```

#### Webpack5 的重大改动

##### 长期缓存

- 真正的内容哈希

  当使用 `[contenthash]` 时，Webpack 5 将使用真正的文件内容哈希值。之前它 "只" 使用内部结构的哈希值。

##### 性能优化

- 持久缓存

  现在有一个文件系统缓存。可以通过`cache`选项启用。
