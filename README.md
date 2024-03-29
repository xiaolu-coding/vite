# 深入浅出Vite

深入浅出Vite小册的笔记

# 前端工程化的痛点

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

前端工具的解决方法:  在生产环境中，配合 Terser等压缩工具进行代码压缩和混淆，通过 Tree Shaking 删除未使用的代码，提供对于低版本浏览器的语法降级处理等等

> 开发效率

项目的冷启动/二次启动时间、热更新时间都可能严重影响开发效率，尤其是当项目越来越庞大的时候。因此，提高项目的启动速度和热更新速度也是前端工程的重要需求

前端工具的解决方法: 构建工具本身通过各种方式来进行性能优化，包括使用原生语言 Go/Rust、no-bundle等等思路，提高项目的启动性能和热更新的速度

# webpack启动和热更新时间过长

使用webpack的项目，一般启动都要花个几分钟，热更新需要十几秒，主要是因为：
1. 项目冷启动时必须递归打包整个项目的依赖树
2. JS语言本身的性能限制，导致构建性能遇到瓶颈，直接影响开发效率

# Vite的优势

而 Vite 很好地解决了这些问题。一方面，Vite 在开发阶段基于浏览器原生 ESM 的支持实现了no-bundle服务，另一方面借助 Esbuild 超快的编译速度来做第三方库构建和 TS/JSX 语法编译，从而能够有效提高开发效率。

除了开发效率，在其他三个维度上， Vite 也表现不俗。

1. 模块化方面，Vite 基于浏览器原生 ESM 的支持实现模块加载，并且无论是开发环境还是生产环境，都可以将其他格式的产物(如 CommonJS)转换为 ESM。

2. 语法转译方面，Vite 内置了对 TypeScript、JSX、Sass 等高级语法的支持，也能够加载各种各样的静态资源，如图片、Worker 等等。

3. 产物质量方面，Vite 基于成熟的打包工具 Rollup 实现生产环境打包，同时可以配合Terser、Babel等工具链，可以极大程度保证构建产物的质量。

# 无模块化标准阶段

在模块化标准出现之前，已经出现过多种类似模块化的开发手段:
1. 文件划分
2. 命名空间
3. IIFE

## 文件划分

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


## ##命名空间
```javascript
// module-a.js
window.moduleA = {
  data: "moduleA",
  method: function () {
    console.log("execute A's method");
  },
};
```
```javascript
// module-b.js
window.moduleB = {
  data: "moduleB",
  method: function () {
    console.log("execute B's method");
  },
};
```
```html
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
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data);
      moduleB.method();
    </script>
  </body>
</html>
```
这样一来，每个变量都有自己专属的命名空间，我们可以清楚地知道某个变量到底属于哪个模块，同时也避免全局变量命名的问题
   
## IIFE 
  
IIFE会创 建私有作用域(块级作用域), 通过闭包 访问内部的数据，其他模块内同名属性无法访问到闭包内部 

但实际上，无论是命令空间还是IIFE，都是为了解决全局变量所带来的命名冲突及作用域不明确的问题，也就是在文件划分方式中所总结的问题 1 和问题 2，而并没有真正解决另外一个问题——模块加载。如果模块间存在依赖关系，那么 script 标签的加载顺序就需要受到严格的控制，一旦顺序不对，则很有可能产生运行时 Bug。

不过前端的模块化规范统一也经历了漫长的发展阶段，即便是到现在也没有实现完全的统一。接下来，我们就来熟悉一下业界主流的三大模块规范: CommonJS、AMD 和 ES Module。


# Vite no-bundle

Vite 所倡导的no-bundle理念的真正含义: 利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载，而不是先整体打包再进行加载。相比 Webpack 这种必须打包再加载的传统构建模式，Vite 在开发阶段省略了繁琐且耗时的打包过程，这也是它为什么快的一个重要原因。

所谓的no-bundle是对源代码而言，而对node_modules中的第三方依赖代码，Vite还是会bundle的，使用速度极快的打包器Esbuild来完成这一过程，达到秒级的依赖编译速度。

# 为什么需要预构建？

先抛出问题：

为什么在开发阶段我们要对第三方依赖进行预构建? 如果不进行预构建会怎么样？

当在请求loadsh这种库时，使用一个方法，会发起很多请求，导致页面加载十分缓慢，但是在预编译之后，会将loadsh这个库打包成一个文件，因此请求量会骤然减少，页面加载也快了许多。

依赖预构建做了两件事：

1. 将其他格式(UMD或CommonJS)的产物转换为ESM格式，使其在浏览器通过 <script type="module"><script>的方式正常加载。
2. 打包第三方库的代码，将各个第三方库分散的文件合并到一起，减少 HTTP 请求数量，避免页面加载性能劣化。

而Vite的预构建是通过Esbuild完成，这也是Vite项目启动飞快的一个核心原因。

# 自动开启预构建

在项目启动成功后，你可以在根目录下的node_modules中发现.vite目录，这就是预构建产物文件存放的目录

在浏览器访问页面后，打开 Dev Tools 中的网络调试面板，你可以发现第三方包的引入路径已经被重写，并且对于依赖的请求结果，Vite 的 Dev Server 会设置强缓存，缓存过期时间被设置为一年，表示缓存过期前浏览器对 react 预构建产物的请求不会再经过 Vite Dev Server，直接用缓存结果。

当然，除了 HTTP 缓存，Vite 还设置了本地文件系统的缓存，所有的预构建产物默认缓存在node_modules/.vite目录中。如果以下 3 个地方都没有改动，Vite 将一直使用缓存文件:

1. package.json 的 dependencies 字段
2. 各种包管理器的 lock 文件
3. optimizeDeps 配置内容

# 手动开启预构建

而少数场景下我们不希望用本地的缓存文件，比如需要调试某个包的预构建结果，我推荐使用下面任意一种方法清除缓存，还有手动开启预构建:

1. 删除node_modules/.vite目录。
2. 在 Vite 配置文件中，将server.force设为true。
3. 命令行执行npx vite --force或者npx vite optimize。

# include

将一些按需加载的放在includes中，因为按需加载是动态加载，有时候不会被Vite预构建识别，因此会发生二次预构建，需要刷新页面并重新请求所有模块，因此要避免二次预构建，因此要把按需加载的依赖都放进includes数组中


# 双引擎

Esbuild 作为构建的性能利器，Vite 利用其 Bundler 的功能进行依赖预构建，用其 Transformer 的能力进行 TS 和 JSX 文件的转译，也用到它的压缩能力进行 JS 和 CSS 代码的压缩。

在 Vite 当中，无论是插件机制、还是底层的打包手段，都基于 Rollup 来实现，可以说 Vite 是对于 Rollup 一种场景化的深度扩展，将 Rollup 从传统的 JS 库打包场景扩展至完整 Web 应用打包，然后结合开发阶段 no-bundle 的核心竞争力，打造出了自己独具一格的技术品牌。


# RollUP

如果把路径别名，全局变量注入和代码压缩等场景与核心的打包逻辑写在一起，一来打包器本身的代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。因此 ，Rollup 设计出了一套完整的插件机制，将自身的核心逻辑与插件逻辑分离，让你能按需引入插件功能，提高了 Rollup 自身的可扩展性。

Rollup的打包过程中，会定义一套完整的构建生命周期，中间会经历一些标志性的阶段，并且在不同阶段会自动执行对应的插件钩子函数(Hook)。对Rollup插件来讲，最重要的就是钩子函数，因为其说明了what(定义了插件机制)，when(声明了插件的作用阶段)。

## Rollup构建过程

对于一次完整的构建过程而言， Rollup 会先进入到 Build 阶段，解析各模块的内容及依赖关系，然后进入Output阶段，完成打包及输出的过程。

### Build Hook 
在这个阶段主要进行模块代码的转换、AST 解析以及模块依赖的解析，那么这个阶段的 Hook 对于代码的操作粒度一般为模块级别，也就是单文件级别。

### Ouput Hook
主要进行代码的打包，对于代码而言，操作粒度一般为 chunk级别(一个 chunk 通常指很多文件打包到一起的产物)。

除了根据构建阶段可以将 Rollup 插件进行分类，根据不同的 Hook 执行方式也会有不同的分类，主要包括Async、Sync、Parallel、Squential、First这五种。

### 1. Async & Sync

首先是Async和Sync钩子函数，两者其实是相对的，分别代表异步和同步的钩子函数，两者最大的区别在于同步钩子里面不能有异步逻辑，而异步钩子可以有。

### 2. Parallel

这里指并行的钩子函数。如果有多个插件实现了这个钩子的逻辑，一旦有钩子函数是异步逻辑，则并发执行钩子函数，不会等待当前钩子完成(底层使用 Promise.all)。

比如对于Build阶段的buildStart钩子，它的执行时机其实是在构建刚开始的时候，各个插件可以在这个钩子当中做一些状态的初始化操作，但其实插件之间的操作并不是相互依赖的，也就是可以并发执行，从而提升构建性能。反之，对于需要依赖其他插件处理结果的情况就不适合用 Parallel 钩子了，比如 transform。

### 3. Sequential

Sequential 指串行的钩子函数。这种 Hook 往往适用于插件间处理结果相互依赖的情况，前一个插件 Hook 的返回值作为后续插件的入参，这种情况就需要等待前一个插件执行完 Hook，获得其执行结果，然后才能进行下一个插件相应 Hook 的调用，如transform。

### 4. First

如果有多个插件实现了这个 Hook，那么 Hook 将依次运行，直到返回一个非 null 或非 undefined 的值为止。比较典型的 Hook 是 resolveId，一旦有插件的 resolveId 返回了一个路径，将停止执行后续插件的 resolveId 逻辑。

# Rollup插件总结

Rollup 的插件开发整体上是非常简洁和灵活的，总结为以下几个方面:

1. 插件逻辑集中管理
2. 插件 API 简洁，符合直觉
3. 插件间的互相调用

# Vite插件

一般情况下要考虑到外部传参，因此实现一个返回插件对象的工厂函数，如下代码所示：

```typescript
// myPlugin.js
export function myVitePlugin(options) {
  console.log(options)
  return {
    name: 'vite-plugin-xxx',
    load(id) {
      // 在钩子逻辑中可以通过闭包访问外部的 options 传参
    }
  }
}

// 使用方式
// vite.config.ts
import { myVitePlugin } from './myVitePlugin';
export default {
  plugins: [myVitePlugin({ /* 给插件传参 */ })]
}
```

## 给配置再加点料: config

Vite 在读取完配置文件（即vite.config.ts）之后，会拿到用户导出的配置对象，然后执行 config 钩子。在这个钩子里面，你可以对配置文件导出的对象进行自定义的操作，如下代码所示:

```typescript
// 返回部分配置（推荐）
const editConfigPlugin = () => ({
  name: 'vite-plugin-modify-config',
  config: () => ({
    alias: {
      react: require.resolve('react')
    }
  })
})
```


1. config: 用来进一步修改配置。
2. configResolved: 用来记录最终的配置信息。
3. configureServer: 用来获取 Vite Dev Server 实例，添加中间件。
4. transformIndexHtml: 用来转换 HTML 的内容。
5. handleHotUpdate: 用来进行热更新模块的过滤，或者进行自定义的热更新处理。

# HMR

HMR 的全称叫做Hot Module Replacement，即模块热替换或者模块热更新。通过HMR技术可以实现局部刷新，状态保存。

Vite 作为一个完整的构建工具，本身实现了一套 HMR 系统，值得注意的是，这套 HMR 系统基于原生的 ESM 模块规范来实现，在文件发生改变时 Vite 会侦测到相应 ES 模块的变化，从而触发相应的 API，实现局部的更新。

# 代码分割

在传统的单 chunk 打包模式下，当项目代码越来越庞大，最后会导致浏览器下载一个巨大的文件，从页面加载性能的角度来说，主要会导致两个问题:

1. 无法做到按需加载，即使是当前页面不需要的代码也会进行加载。
2. 线上缓存复用率极低，改动一行代码即可导致整个 bundle 产物缓存失效。

首先说第一个问题，一般而言，一个前端页面中的 JS 代码可以分为两个部分: Initital Chunk和Async Chunk，前者指页面首屏所需要的 JS 代码，而后者当前页面并不一定需要，一个典型的例子就是 路由组件，与当前路由无关的组件并不用加载。而项目被打包成单 bundle 之后，无论是Initial Chunk还是Async Chunk，都会打包进同一个产物，也就是说，浏览器加载产物代码的时候，会将两者一起加载，导致许多冗余的加载过程，从而影响页面性能。而通过Code Splitting我们可以将按需加载的代码拆分出单独的 chunk，这样应用在首屏加载时只需要加载Initial Chunk 即可，避免了冗余的加载过程，使页面性能得到提升。

其次，线上的缓存命中率是一个重要的性能衡量标准。对于线上站点而言，服务端一般在响应资源时加上一些 HTTP 响应头，最常见的响应头之一就是cache-control，它可以指定浏览器的强缓存，表示资源过期时间为一年，在过期之前，访问相同的资源 url，浏览器直接利用本地的缓存，并不用给服务端发请求，这就大大降低了页面加载的网络开销。不过，在单 chunk 打包模式下面，一旦有一行代码变动，整个 chunk 的 url 地址都会变化，由于构建工具一般会根据产物的内容生成哈希值，一旦内容变化就会导致整个 chunk 产物的强缓存失效，所以单 chunk 打包模式下的缓存命中率极低，基本为零。

而进行code splitting后，代码的改动只会影响部分的chunk哈希改动，也就是说，在改动 A 的代码后，B、C、D的 chunk 产物 url 并没有发生变化，从而可以让浏览器复用本地的强缓存，大大提升线上应用的加载性能。

# Vite默认拆包策略

在生产环境下，Vite拆包也是基于Rollup来完成的。

1. 一方面 Vite 实现了自动 CSS 代码分割的能力，即实现一个 chunk 对应一个 css 文件，这样做也能提升 CSS 文件的缓存复用率。
2. 而另一方面， Vite 基于 Rollup 的manualChunksAPI 实现了应用拆包的策略:
> 对于 Initital Chunk 而言，业务代码和第三方包代码分别打包为单独的 chunk，在上述的例子中分别对应index.js和vendor.js。需要说明的是，这是 Vite 2.9 版本之前的做法，而在 Vite 2.9 及以后的版本，默认打包策略更加简单粗暴，将所有的 js 代码全部打包到 index.js 中。 
> 对于 Async Chunk 而言 ，动态 import 的代码会被拆分成单独的 chunk，如上述的Dynacmic组件。


Vite 默认拆包的优势在于实现了 CSS 代码分割与业务代码、第三方库代码、动态 import 模块代码三者的分离，但缺点也比较直观，第三方库的打包产物容易变得比较臃肿。

# 网络优化

传统的 HTTP 1.1 存在队头阻塞的问题，同一个 TCP 管道中同一时刻只能处理一个 HTTP 请求，也就是说如果当前请求没有处理完，其它的请求都处于阻塞状态，另外浏览器对于同一域名下的并发请求数量都有限制，比如 Chrome 中只允许 6 个请求并发（这个数量不允许用户配置），也就是说请求数量超过 6 个时，多出来的请求只能排队、等待发送。

使用http2请求

多路复用。将数据分为多个二进制帧，多个请求和响应的数据帧在同一个 TCP 通道进行传输，解决了之前的队头阻塞问题。而与此同时，在 HTTP2 协议下，浏览器不再有同域名的并发请求数量限制，因此请求排队问题也得到了解决。
Server Push，即服务端推送能力。可以让某些资源能够提前到达浏览器，比如对于一个 html 的请求，通过 HTTP 2 我们可以同时将相应的 js 和 css 资源推送到浏览器，省去了后续请求的开销。

# Vite源码

## 依赖预构建原理
