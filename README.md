# TLCSDM 快速访问插件

一个用于快速访问 tlcsdm 域名下各个站点的浏览器扩展插件，支持 Chrome 和 Edge 浏览器。

## 功能特性

点击插件图标后，可以快速访问以下站点：

- 🏠 **主站** - www.tlcsdm.com
- 📚 **文档** - docs.tlcsdm.com
- 📄 **PDF** - pdf.tlcsdm.com
- ✏️ **博客** - blog.tlcsdm.com
- 📁 **文件** - file.tlcsdm.com
- ⚙️ **Jenkins** - jenkins.tlcsdm.com
- 📋 **简历** - resume.tlcsdm.com

## 项目结构

```
tlcsdm-quick-access-plugin/
├── src/
│   ├── shared/          # 共享代码（popup界面）
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── chrome/          # Chrome 特定配置
│   │   └── manifest.json
│   └── edge/            # Edge 特定配置
│       └── manifest.json
├── icons/               # 插件图标
├── scripts/             # 构建脚本
├── dist/                # 构建输出目录
├── build.sh             # 构建脚本
└── package.json
```

## 安装

### 开发者模式安装

#### Chrome 浏览器

1. 构建项目：
   ```bash
   npm install
   npm run generate-icons
   npm run build
   ```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`

3. 开启右上角的「开发者模式」

4. 点击「加载已解压的扩展程序」

5. 选择 `dist/chrome` 目录

#### Edge 浏览器

1. 构建项目：
   ```bash
   npm install
   npm run generate-icons
   npm run build
   ```

2. 打开 Edge 浏览器，访问 `edge://extensions/`

3. 开启左侧的「开发人员模式」

4. 点击「加载解压缩的扩展」

5. 选择 `dist/edge` 目录

## 开发

### 环境要求

- Node.js >= 14
- npm >= 6

### 构建命令

```bash
# 安装依赖
npm install

# 生成图标
npm run generate-icons

# 构建所有平台
npm run build

# 构建后的文件在 dist/ 目录下
# - dist/chrome/                 Chrome 扩展目录
# - dist/edge/                   Edge 扩展目录
# - dist/tlcsdm-quick-access-chrome.zip   Chrome 扩展包
# - dist/tlcsdm-quick-access-edge.zip     Edge 扩展包
```

### 项目特点

- **Manifest V3**: 使用最新的 Manifest V3 规范
- **多平台支持**: 支持 Chrome 和 Edge 浏览器
- **共享代码**: 核心功能代码在两个平台间共享
- **简洁界面**: 清晰直观的快速访问界面

## 许可证

[MIT License](LICENSE)
