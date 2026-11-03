# 摇摇木筏 · Wobble Raft

独立可玩的单游戏版本。根目录 `index.html` 直接进入游戏，没有双游戏选择页，也没有跳转到其他游戏的按钮。

[完整 ZIP 下载](https://github.com/wentaopeng714-cmd/wobble-raft/archive/refs/heads/main.zip)

## 使用

作为 HTML5 网页项目导入，入口为根目录 `index.html`。保留全部 JS、CSS、shared/vendor 和 shared/models 文件的相对位置。所有玩法源码、Three.js 和所用 3D 模型均已包含，不需要安装依赖、API Key 或外部资源 CDN。

本地可用 `npm start`，然后访问 http://127.0.0.1:4194/ 。请通过 HTTP 运行，不要直接双击 file:// 页面。

支持触屏及键盘，存档保存在当前浏览器。已验证单独加载；Loopit 内部导入未实测。

模型来源和 CC0 许可信息位于 `shared/models/SOURCES.txt`，Three.js MIT 许可位于 `shared/vendor/THREE-LICENSE.txt`。
