## 如何构造一个PDF Editor？

### 产品原型

产品原型来自于国内的迅捷PDF编辑器，迅捷PDF编辑器的功能均购自于https://pspdfkit.com/。

### 技术选型

#### 第三方库介绍

此次PDF Editor的技术选型为：

* PDF.js（https://mozilla.github.io/pdf.js/）
* Fabric.js（http://fabricjs.com/）
* pdf-lib.js（https://pdf-lib.js.org/）

##### PDF.js

PDF.js在lms中已经大量使用，主要用于PDF文件的预览展示，不多做介绍。



##### Fabric.js

Fabric官方解释：

> Fabric provides **interactive object model** on top of canvas element ;

Fabric.js是一个强大的H5 canvas框架，在原生canvas之上提供了交互式对象模型，通过简洁的api就可以在画布上进行丰富的操作。在之前的Inclass blackboard模块功能的开发中，使用该库提供的api完成了我们的业务需求，主要应用场景有：任意划线，构造形状等。



##### Pdf-lib.js

Pdf-lib.js是一个用于生成新的PDF文件的库，提供了PDF文件一部分的高级API，单就暴露出的高级API而言，根本无法满足我们的业务需求，所以在第一次Spike结束后，创建PDF文件的库并没有确定下来。但值得庆幸的是，Pdf-lib虽然没有将PDF文件结构所有的功能都作为高级API暴露出来，但是通过其底层的模型构建，再加上对PDF文件结构的深入了解，是完全可以构造出想要的PDF文件，所以第二次Spike结束后，确定了Pdf-lib作为创建PDF文件的库。



#### 第三方库的角色定位

如果将PDF Editor的功能进行拆分，其大致可分为三个主要功能：

1. PDF的预览功能（展示层）
2. PDF的编辑功能（编辑层）
3. PDF的下载，可保存功能（服务层）

三个第三方库正对应三种功能。PDF.js负责展示层，Fabric.js负责编辑层，Pdf-lib.js负责服务层。同时也可以确定了，最终PDF Editor的项目结构，服务层隐于幕后，界面展示由底而上顺序为，展示层，编辑层。



### 项目模型分析

#### 产品分析
从产品UI提供的图出发，根据产品上的功能可分为以下几类：

1. 笔刷划线的生成（划线按钮）
2. 手工批注的生成（批注按钮，包括：正确批注，错误批注，普通批注）
3. 删除上述划线，批注的功能（撤销，删除，清空按钮）
4. 还原上述划线，批注的功能（撤销按钮）
5. 下载，可保存的功能（下载按钮）



#### 模型分析

##### 核心模型的转换

根据上述产品分析的结果，不难发现，所有的产品功能都围绕着两个模型，即划线产生的*Graphics*，批注功能产生的*TextAnnotation*。即上面根据产品功能所实现的类型划分，亦可根据模型进行类型划分如下：

1. *Graphics*模型的生成（划线按钮）
2. *Graphics*模型的隐藏（删除，清空，撤销按钮）
3. *Graphics*模型的显示（撤销按钮）
4. *Graphics*模型的保存（下载按钮）
5. *TextAnnotation*模型的生成（批注按钮，包括：正确批注，错误批注，普通批注）
6. *TextAnnotation*模型的隐藏（删除，清空，撤销按钮）
7. *TextAnnotation*模型的显示（撤销按钮）
8. *TextAnnotation*模型的保存（下载按钮）



##### 核心模型的二次抽取

根据*Graphics*与*TextAnnotation*展示出的统一性，可进一步抽取模型*WGPDFObject*，同时确定*WGPDFObject*服务层与编辑层的中间转换对象，此时*WGPDFObject*应当具备如下能力：

* *WGPDFObject*必须具备在编辑层生成对应元素的能力
* *WGPDFObject*必须具备在编辑层隐藏对应元素的能力
* *WGPDFObject*必须具备在编辑层显示对应元素的能力
* *WGPDFObject*必须具备在服务层保存对应元素的能力

**为了便于扩展，*WGPDFObject*的定义需要与PDF文档结构中的模型定义保持一致！**



##### 产品工具模型

核心模型确定后，亦可从产品分析后的结果确定产品工具功能的模型。根据各功能对编辑层的影响进行分类，可简单分为两种类型：

1. 可激活型工具，指的是要求编辑层的属性发生一定的变化，且有明显的注册，注销行为，这一类工具包括：划线，批注，橡皮擦。
2. 非激活型工具，指的是对编辑层无任何要求，这一类工具包括：撤销，清空，全屏，下载。

针对可激活型的工具，可抽取模型*Tool*，根据业务需求的要求，*Tool*功能如下：

* *Tool*必须具备修改编辑层属性进行注册的能力
* *Tool*必须具备还原编辑层属性进行注销的能力
* *Tool*必须具备显式激活功能的能力（用于各可激活型工具进行切换）

针对非激活型的工具，对编辑层不存在影响，完成自身功能即可。



##### 核心模型的历史模型

非激活型工具中存在撤销工具，这意味着我们必须保存用户操作的记录，并暴露可回退操作的API，所以存在核心模型的历史模型*WGPDFObjectHistory*，根据业务要求，*WGPDFObjectHistory*功能如下：

* *WGPDFObjectHistory*必须具备保存用户操作的能力
* *WGPDFObjectHistory*必须提供回退用户操作的能力



#### 最终模型展示

##### WGPDFObject

```ts
interface WGPDFObject {
	type: WGPDFObjectType; //WGPDFObjectType,类型：ANNOTATION，Graphics
  buildPageElement: Function; //编辑层生成对应的元素
  renderPdf: Function; //服务层将对应的元素转换为PDF文件的对象
  activate: Function; //编辑层显示对应的元素
  deactivate: Function; //编辑层隐藏对应的元素
  restoreToActivate: Function; //编辑层还原对应的元素，一般为隐藏状态转为显示状态
}
```



##### WGPDFObjectHistory

```ts
interface WGPDFObjectHistory {
	type: WGPDFObjectHistoryType; //WGPDFObjectHistoryType，用户操作类型：ADD，REMOVE
  wgPdfObjects: Array<WGPDFObject>; //此次操作涉及到的WGPDFObject
  undo: Function; //撤销该操作
  redo: Function; //还原该操作
}
```



##### Tool

```ts
interface Tool {
	active: Boolean; //工具是否激活
  register: Function; //注册方法，修改编辑层对应属性
  unregister: Function; //注销方法，还原编辑层对应属性
  activate: Function; //激活方法，激活该工具
}
```



#### 真实场景中的模型变化

模拟一个用户场景如下：

1. 用户选择【笔刷划线】工具，界面划随意线段
2. 用户点击【撤销】按钮，界面线段消失
3. 用户点击【普通批注】按钮，创建随意批注
4. 用户点击【下载】按钮，生成新PDF文件

其对应的模型变化如下所示：

1. 【笔刷划线】工具依次触发**activate**，**register**方法。界面划线生成**Graphics**对象，调用**buildPageElement**在编辑层生成对应元素，同时添加类型为**ADD**的**WGPDFObjectHistory**对象进入***store***
2. 用户点击【撤销】按钮，**Graphics**对象触发**deactivate**方法，在编辑层隐藏自身元素
3. 用户点击【普通批注】按钮，依次触发【笔刷划线】工具**unregister**，【普通批注】**activate**，**register**方法。界面批注创建**TextAnnotation**对象，调用**buildPageElement**在编辑层生成对应元素，同时添加类型为**ADD**的**WGPDFObjectHistory**对象进入***store***
4. 用户点击【下载】按钮，服务层获取***store***中所有显示的**WGPDFObject**，依次调用**renderPdf**方法生成对应PDF文件对象，并由Pdf-lib创建新的PDF文件进行下载



### 项目实现中的问题

#### 预览层与编辑层的界面适配

##### 问题现象

在最初的构想中，pdf预览层的界面文档结构每一页面都存在对应的Canvas对象，可以作为fabric的初始化Canvas载体。如图所示：

<img src="/Users/administrator/Library/Application Support/typora-user-images/image-20200802180539108.png" alt="image-20200802180539108" style="zoom:50%;" />

但在实际操作中发现，当缩放比例发生变化时，pdfjs会使页面重新渲染，canvas对象也会被先销毁而后再创建。也就是说如果基于这个canvas对象构造fabric编辑层，在缩放比例发生变化时，不能保证编辑层的图形，数据保存并自适应。

##### 解决方案

1. 在pdf.js渲染的模版HTML文件中，添加与*viewer*同级的*editor*层。且*editor*在样式层面与*viewer*保持一致。
2. *editor*层中针对每一页面渲染唯一Canvas对象作为fabric初始化载体。
3. 当缩放比例发生变化时，通过监听pdf.js相关事件，*editor*层动态适应大小。 



#### 批注的中文适配

##### 问题现象

pdf-lib支持创建TextAnnotation，会将TextAnnotation的字符直接转换为Uint8Array形式进行保存，因为对于绝大多数中文字符来说，其对应的charCode都超过了Uint8的0-255范围，所以中文字符直接转换为Uint8Array会出现字节丢失的情况，最终导致的效果就是，保存的中文批注乱码。

##### 解决方案

手动处理批注的内容，将其转换为Utf8格式的Uint8Array对象，然后再传入pdf-lib的构造函数中。



### 后续扩展

PDF Editor是一个庞大的工程，如果后续需要进行更多的功能扩展，PDF的文档结构是避不开的一道坎，了解了PDF的文档结构，后续了解相关的PDF处理库也事半功倍。

https://lazymind.me/2017/10/pdf-structure/

https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/pdf_reference_archives/PDFReference.pdf

