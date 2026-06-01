# 项目部署指南

本指南涵盖了 `学科忍者：知识乱斗` 的常见运行与部署方式。

## 1. 本地运行
在开发阶段，我们推荐使用 Vite 提供的本地开发服务器：
```bash
npm install
npm run dev
```
> **注意**：Vite 默认会在 `http://localhost:5173` 启动。因为是在 `localhost` 环境下，浏览器允许直接调用摄像头 API。

## 2. 本地打包
要将项目编译并打包用于生产环境：
```bash
npm run build
```
打包产物会生成在根目录的 `dist/` 文件夹中。你可以使用以下命令在本地预览打包后的产物：
```bash
npm run preview
```

## 3. Vercel 部署
部署到 Vercel 非常简单。由于本项目是标准的 Vite 结构，Vercel 会自动识别并配置：
1. 将代码推送到 GitHub / GitLab。
2. 在 Vercel 控制台导入该仓库。
3. Framework Preset 选择 `Vite`（通常会自动识别）。
4. 点击 `Deploy` 即可。

## 4. Netlify 部署
与 Vercel 类似：
1. 在 Netlify 控制台导入仓库。
2. Build command 填写 `npm run build`。
3. Publish directory 填写 `dist`。
4. 点击 `Deploy site`。

## 5. GitHub Pages 部署注意事项
如果你希望将项目部署到 GitHub Pages 的子路径下（例如 `https://username.github.io/subject-ninja/`），你需要修改 Vite 的基础路径配置。

在 `vite.config.ts` 中加入 `base` 配置：
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 如果你的项目部署在 https://<USERNAME>.github.io/<REPO>/
  // 则将 base 设置为 '/<REPO>/'，或者简单的相对路径 './'
  base: './',
})
```
> *注：当前代码库的 `vite.config.ts` 保持默认，未强制添加 `base`，以确保根路径部署和本地开发的通用性。如果你要部署到 GitHub Pages，请按上述说明自行添加。*

## 6. HTTPS 环境要求
由于游戏核心玩法依赖摄像头（`navigator.mediaDevices.getUserMedia`），现代浏览器出于隐私安全考虑，**强制要求该 API 必须在 HTTPS 环境下运行**。
唯一的例外是 `localhost` 和 `127.0.0.1`。
如果你在局域网内通过 IP 地址（如 `http://192.168.1.100:5173`）访问进行手机测试，摄像头将被浏览器静默拦截。你需要使用内网穿透工具（如 ngrok）或者配置 Vite 的 HTTPS 证书插件（`@vitejs/plugin-basic-ssl`）来解决此问题。

## 7. 子路径部署
如第 5 点所述，只要非域名根目录的部署环境，都需要正确配置 Vite 的 `base` 选项，以防打包后的 js / css / image 资源 404 报错。