<div align="center">
  <img src="apps/readest-app/public/icon.png" alt="OneRead Logo" width="128" height="128" />
  <h1>OneRead</h1>
  <p>纯本地电子书阅读器，基于 Readest 开源项目 fork 并修改</p>
</div>

## 简介

OneRead 是一个**纯本地**的电子书阅读器，移除了原版 Readest 的登录和云端同步功能，专注于本地阅读体验。

## 与原版 Readest 的主要区别

- ✅ **移除登录系统** — 无需账号，开箱即用
- ✅ **移除云端同步** — 仅保留 WebDAV 同步
- ✅ **设置页面内联** — 设置不再弹窗，改为侧边栏视图
- ✅ **笔记本功能** — 汇总查看所有书的笔记和标注
- ✅ **收藏系统** — 心形按钮一键收藏书籍
- ✅ **废纸篓恢复** — 删除的书可以恢复
- ✅ **侧边栏可收起** — 一键隐藏侧边栏文字
- ✅ **中文优化** — 界面完整中文翻译

## 支持的格式

EPUB · PDF · MOBI · AZW/AZW3 · CBZ · FB2/FBZ · TXT · Markdown

## 下载

前往 [Releases](https://github.com/JOSNIPER/readest/releases) 页面下载最新版本。

## 从源码构建

### 环境要求

- Node.js 24+ 和 pnpm
- Rust 和 Cargo

### 构建步骤

```bash
# 克隆仓库
git clone https://github.com/JOSNIPER/readest.git
cd readest

# 安装依赖
git submodule update --init --recursive
pnpm install
pnpm --filter @readest/readest-app setup-vendors

# 开发模式
pnpm tauri dev

# 打包 Windows 安装包
cd apps/readest-app
pnpm build-win-x64
```

## 许可证

基于 [Readest](https://github.com/readest/readest) 的代码，遵循 [AGPL v3](LICENSE) 协议。
