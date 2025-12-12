# Fix Markdown Bold with Chinese Quotes

## 简介 (Introduction)
这是一个油猴（Tampermonkey）脚本，专门用于修复在 ChatGPT、Gemini 和 Google AI Studio 等 AI 对话网站上，Markdown 粗体语法 `**` 遇到中文全角引号 `“ ”` 时无法正确渲染的问题。

## 问题背景 (The Problem)
Markdown 与 CJK（中日韩）排版之间存在长期的兼容性问题。在某些 Markdown 渲染引擎中，当粗体标记 `**` 紧邻中文全角引号时（例如 `**“重点内容”**`），渲染器往往无法正确识别边界，导致直接显示为原始的星号文本，而不是粗体样式。

这个脚本通过监听页面变化，自动检测并操作 DOM 节点，将这些未正确渲染的文本转换为标准的 HTML 粗体标签，从而完美修复显示效果。

## 功能特点 (Features)
- **精准修复**：将 `**“内容”**` 智能转换为 `“<b>内容</b>”`，保留引号并加粗内部文字。
- **复杂场景支持**：
  - 支持包含换行符的多行文本。
  - 支持句子内部嵌套其他标点符号（如 `**“效率”，解决了中国“穷”的问题**`）。
- **动态监听**：内置 `MutationObserver`，完美支持 SPA（单页应用）和 AI 流式输出的内容。
- **安全防误触**：智能跳过 `<script>`、`<style>`、`<textarea>` 及 `contentEditable` 区域，确保不会破坏代码块或输入框中的原始内容。

## 支持网站 (Supported Sites)
- **ChatGPT**: `https://chatgpt.com/*`, `https://chat.openai.com/*`
- **Google Gemini**: `https://gemini.google.com/*`
- **Google AI Studio**: `https://aistudio.google.com/*`

## 安装方法 (Installation)
1. 确保您的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2. 在 Tampermonkey 管理面板中创建一个新脚本。
3. 将 `MarkdownFix.user.js` 文件中的代码完整复制并粘贴到编辑器中。
4. 保存脚本（Ctrl+S）。
5. 刷新 ChatGPT 或 Gemini 页面即可生效。

## 调试 (Debugging)
如果脚本似乎没有生效，可以按 `F12` 打开开发者工具，在 Console 控制台中查看日志。
- 脚本加载成功会显示：`MarkdownFix: Script loaded`
- 发生替换时会显示：`MarkdownFix: Replacing content in ...`

## 许可证 (License)
MIT License
