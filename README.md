# Mindustry 逻辑编辑器 (mLogEditor)

基于 Blockly 的Mindustry Logic可视化编程工具。通过拖拽积木块，快速生成 `mlog` 汇编代码。

---

## 特性

- 拖拽式逻辑编程，基于 Blockly
- 实时代码生成：积木 → mlog 汇编
- 自动保存至浏览器本地
- 工作区导入/导出
- 简体中文界面
- Zelos 渲染器

---

## 技术栈

| 组件 | 说明 |
|------|------|
| [Blockly](https://github.com/RaspberryPiFoundation/blockly) | 可视化编程框架 |
| [mlogjs](https://github.com/mlogjs/mlogjs) | JavaScript → mlog 编译器 |
| Webpack | 模块打包 |
| Node.js | 构建与开发环境 |

---

## 构建与开发

### 环境要求
- Node.js >= 16.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm start
```
启动 Webpack Dev Server，默认端口 8080，支持热模块替换（HMR）。

### 生产构建
```bash
npm run build
```
输出目录：`dist/`

### 部署
项目包含 GitHub Actions 工作流（`.github/workflows/deploy.yml`），推送至 `main` 分支时自动构建并部署到 `gh-pages` 分支。

手动部署：
```bash
npx gh-pages -d dist
```

---

## 项目结构

```
mLogEditor/
├── .github/workflows/       # CI/CD 自动部署配置
├── public/media/            # Blockly 静态资源（图标、音效）
├── src/
│   ├── blocks/              # 自定义积木定义（JSON）
│   ├── generators/          # mlog 代码生成器
│   ├── styles/              # CSS
│   ├── index.html           # 页面模板
│   └── index.js             # 应用入口
├── webpack.config.js        # 构建配置
└── package.json
```

---

## 使用指南

### 添加积木
从左侧工具箱拖拽积木到工作区，按照逻辑顺序拼接。

### 生成代码
工作区每次变更会自动在右侧面板生成对应的 mlog 代码。

### 复制代码
点击代码面板右上角的“复制”按钮，可将代码复制到剪贴板。

### 导出与导入
- 导出：将当前工作区保存为 JSON 文件（头部工具栏中的“导出”按钮）。
- 导入：从 JSON 文件恢复工作区（“导入”按钮）。
- 新建：清空工作区（会弹出确认对话框）。

### 自动恢复
页面刷新或重新打开时，自动从浏览器本地存储加载上次保存的工作区。

---

## 贡献

欢迎提交 Issue 和 Pull Request！请确保：
- 代码符合 ESLint 规则（项目已集成）。
- 提交前测试功能正常运行。
- 如果是新功能，请同时更新相关文档。

---

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 开源协议。  
您可以在遵守许可证条款的前提下自由使用、修改和分发本项目。

---

## 致谢

- [Blockly 团队](https://github.com/RaspberryPiFoundation/blockly) 提供可视化编程框架
- [mlogjs](https://github.com/mlogjs/mlogjs) 的 JavaScript 到 mlog 编译器
- [Mindustry](https://github.com/anuken/mindustry) 游戏本身
- 本项目使用 Deepseek V4 辅助开发

---

**Happy Logic Crafting!**