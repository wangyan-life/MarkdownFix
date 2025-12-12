// ==UserScript==
// @name         Fix Markdown Bold with Chinese Quotes
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修复 **“中文内容”** 不能正确渲染粗体的问题，将其转换为 “<b>中文内容</b>”
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('MarkdownFix: Script loaded');

    // 正则：匹配 **“xxx”** 的模式
    // 使用 [\s\S] 匹配包括换行符在内的所有字符，并支持可选的闭合引号
    const pattern = /\*\*“([\s\S]*?)(”)?\*\*/g;

    function fixBoldQuotes(rootNode) {
        // 忽略脚本、样式和可编辑区域（避免破坏编辑器源码）
        if (!rootNode || 
            rootNode.nodeName === 'SCRIPT' || 
            rootNode.nodeName === 'STYLE' || 
            rootNode.isContentEditable) {
            return;
        }

        // 如果传入的是文本节点，直接检查
        if (rootNode.nodeType === Node.TEXT_NODE) {
            processTextNode(rootNode);
            return;
        }

        // 遍历子节点中的文本节点
        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 跳过父节点是 script/style/textarea 等的情况
                    const parentName = node.parentNode.nodeName;
                    if (parentName === 'SCRIPT' || 
                        parentName === 'STYLE' || 
                        parentName === 'TEXTAREA' ||
                        node.parentNode.isContentEditable) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodesToReplace = [];
        let currentNode;
        
        // 先收集所有匹配的节点，避免在遍历时修改 DOM 导致 walker 失效
        while ((currentNode = walker.nextNode())) {
            if (pattern.test(currentNode.nodeValue)) {
                nodesToReplace.push(currentNode);
            }
        }

        // 执行替换
        nodesToReplace.forEach(processTextNode);
    }

    function processTextNode(textNode) {
        const text = textNode.nodeValue;
        // 重置正则索引，确保从头匹配
        pattern.lastIndex = 0;
        
        if (!pattern.test(text)) return;

        console.log('MarkdownFix: Replacing content in', textNode);

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        
        // 重置正则索引再次执行匹配
        pattern.lastIndex = 0;

        while ((match = pattern.exec(text)) !== null) {
            // 1. 添加匹配内容之前的普通文本
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            }

            // match[0] 是完整字符串 **“内容”**
            // match[1] 是内容
            // match[2] 是可选的闭合引号 ”

            // 2. 添加左引号
            fragment.appendChild(document.createTextNode('“'));

            // 3. 添加粗体元素
            const strong = document.createElement('strong');
            strong.textContent = match[1];
            fragment.appendChild(strong);

            // 4. 添加右引号 (如果存在)
            if (match[2]) {
                fragment.appendChild(document.createTextNode(match[2]));
            }

            lastIndex = pattern.lastIndex;
        }

        // 5. 添加剩余的文本
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        // 用新的片段替换旧的文本节点
        textNode.parentNode.replaceChild(fragment, textNode);
    }

    // 初始修复
    fixBoldQuotes(document.body);

    // 监听 DOM 变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.addedNodes) {
                m.addedNodes.forEach(n => fixBoldQuotes(n));
            }
        });
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
