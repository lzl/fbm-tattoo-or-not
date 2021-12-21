# fbm-tattoo-or-not

## 环境

- Node.js 16.x

## 安装依赖

```
cd client
npm i
```

```
cd server
npm i
```

## 启动后端服务

```
cd server
node app.js
```

## 构建前端页面

将 `client/src/App.js` 中的 `API_URL` 改为对应的后端地址。

```
cd client
npm run build
```

构建的页面在 `build` 目录下，可以通过 `npm run serve` 命令来启动服务器，并在浏览器中访问。

## 开始标记

将待标记的图片平级放入 `server/assets/todo` 文件夹下。

标记好的图片将会被移动到 `server/assets/done` 文件夹下。
