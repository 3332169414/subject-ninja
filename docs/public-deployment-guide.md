# 公网部署指南

本项目经过配置，支持“一键式”无缝部署到各大主流前端托管平台（如 Vercel、Netlify、Cloudflare Pages 等）。

## 一、推荐部署方式：Vercel

**步骤：**
1. 把项目上传到 GitHub。
2. 打开 Vercel，点击 `New Project`。
3. 选择刚才上传的 GitHub 仓库。
4. Framework 选择 `Vite`（Vercel 通常会自动识别根目录的 `vercel.json`）。
5. Build Command 确认是：`npm run build`。
6. Output Directory 确认是：`dist`。
7. 点击 Deploy。
8. 部署完成后，Vercel 会自动分配一个 HTTPS 链接，直接复制该链接发给别人即可游玩。

## 二、Netlify 部署方式

**步骤：**
1. 上传项目到 GitHub。
2. 打开 Netlify 控制台，点击 `Add new site`。
3. 选择 GitHub 仓库。
4. 由于项目中已包含 `netlify.toml`，Netlify 会自动读取构建配置。
5. Build command：`npm run build`。
6. Publish directory：`dist`。
7. 点击 Deploy。

## 三、Cloudflare Pages 部署方式

**步骤：**
1. 上传项目到 GitHub。
2. 打开 Cloudflare Pages，点击 `Create a project`。
3. 连接并选择 GitHub 仓库。
4. Framework preset 选择 `Vite`。
5. Build command：`npm run build`。
6. Build output directory：`dist`。
7. 点击 Deploy。

## 四、GitHub Pages 注意事项

如果你决定部署到 GitHub Pages 的子路径（例如：`https://<username>.github.io/<repo>/`），可能需要在 `vite.config.ts` 中设置 base 路径，以防止打包后找不到资源：

```typescript
export default defineConfig({
  plugins: [react()],
  base: './' // 或者 base: '/你的仓库名/'
})
```

## 五、摄像头与公网访问注意事项

1. **HTTPS 限制**：现代浏览器（Chrome / Edge / Safari）处于隐私保护，**强制要求摄像头 API（`getUserMedia`）必须在 HTTPS 环境下运行**。
2. **Localhost 豁免**：只有 `localhost` 或 `127.0.0.1` 这种本地开发环境能在普通 HTTP 下调用摄像头。
3. **公网 HTTP 失效**：如果你用内网穿透或者配置了普通的 `http://` 域名发给朋友，摄像头将被静默拦截。请务必使用上述 Vercel 等平台自动提供的 HTTPS 链接分享。
4. **兼容与兜底**：如果遇到打不开摄像头的情况（如无设备、被占用或 HTTP 环境），游戏**会自动触发降级保护**，并提供“鼠标调试模式”供玩家完整体验。
5. **推荐浏览器**：强烈推荐使用 Chrome 或 Edge 最新版。

## 六、发给别人玩的建议文案

你可以复制以下文案发给朋友进行测试：

> “这是我的前端互动游戏《学科忍者：知识乱斗》，建议用电脑 Chrome / Edge 打开。允许摄像头权限后，你可以用双手食指像切水果一样切中掉落的学科物件！如果摄像头不方便，也可以选择首页的「鼠标调试模式」直接用鼠标游玩~”