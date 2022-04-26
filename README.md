# #深入浅出Vite

深入浅出Vite小册的笔记

# #前端工程化的痛点

从古至今，所有的前端构建工具都是为了解决前端工程化的痛点而存在的

那么痛点是什么？

1. 前端的模块化需求
2. 兼容浏览器，编译高级语法
3. 线上代码的质量
4. 开发效率

> 前端的模块化需求:

业界的模块化标准非常多: AMD、CMD、CommonJS、ESM等等，前端工程需要保证这些模块正常加载，以及兼容不同的模块规范，以适应不同的执行环境

前端工具的解决方法: 提供模块加载方案，并兼容不同的模块规范

> 兼容浏览器，编译高级语法

typescript、JSX这些高级语法要在浏览器中正常运行的话，就需要通过工具编译成浏览器规范认识的形式

前端工具的解决方法: 配合 Sass、TSC、Babel 等前端工具链，完成高级语法的转译功能，同时对于静态资源也能进行处理，使之能作为一个模块正常加载

> 线上代码的质量

生产环境中，我们不仅要考虑代码的安全性、兼容性问题，保证线上代码的正常运行，也需要考虑代码运行时的性能问题

前端工具的解决方法: 在生产环境中，配合 Terser等压缩工具进行代码压缩和混淆，通过 Tree Shaking 删除未使用的代码，提供对于低版本浏览器的语法降级处理等等

> 开发效率

项目的冷启动/二次启动时间、热更新时间都可能严重影响开发效率，尤其是当项目越来越庞大的时候。因此，提高项目的启动速度和热更新速度也是前端工程的重要需求

前端工具的解决方法: 构建工具本身通过各种方式来进行性能优化，包括使用原生语言 Go/Rust、no-bundle等等思路，提高项目的启动性能和热更新的速度

# #无模块化标准阶段

在模块化标准出现之前，已经出现过多种类似模块化的开发手段:
1. 文件划分
2. 命名空间
3. IIFE

## ##文件划分

文件划分模式是最原始的模块化，通过script标签引入不同的文件，将状态和逻辑分散到不同地方，下面是文件划分的例子:

```javascript
// module-a.js
let a = 'a'
```

```javascript
// module-b.js
let b = 'b'
function showB() {
  console.log(b)
}
```

```html
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      console.log(a)
      showB()
    </script>
  </body>
</html>
```

这种操作有很多的问题:

1. 模块变量相当于在全局声明和定义，会有变量名冲突的问题。比如 module-b 可能也存在data变量，这就会与 module-a 中的变量冲突。
2. 由于变量都在全局定义，我们很难知道某个变量到底属于哪些模块，因此也给调试带来了困难。
3. 无法清晰地管理模块之间的依赖关系和加载顺序。假如module-a依赖module-b，那么上述 HTML 的 script 执行顺序需要手动调整，不然可能会产生运行时错误。
