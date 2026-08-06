import process from 'process';
window.process = process;
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import './styles/index.css';
import './blocks/mdtblock.js';   // 这会执行该模块，注册自定义块
import './generators/mlogjs.js';
import {blocks, unregisterProcedureBlocks} from '@blockly/block-shareable-procedures';
import DarkTheme from '@blockly/theme-dark';
import * as zhHans from 'blockly/msg/zh-hans';
import * as mlogjs from 'mlogjs';

Blockly.setLocale(zhHans);

// ---- 初始化 Blockly 工作区 ----
var blocklyDiv = document.getElementById('blocklyDiv');

var workspace = Blockly.inject(blocklyDiv, {
    media: 'media/',
    toolbox: document.getElementById('toolbox'),
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.5,
        scaleSpeed: 1.05
    },
    grid: {
        spacing: 20,
        length: 1,
        colour: '#475a68'
    },
    trashcan: true,
    scrollBar: true,
	theme: DarkTheme,
	renderer: "zelos",
});

// ---- 窗口缩放自适应 ----
var onresize = function(e) {
    Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize);
Blockly.svgResize(workspace);

// ---- 自动保存 ----
const hasSaved = loadWorkspace(workspace);

// 自动保存监听器（防抖动，避免频繁写入）
let saveTimer = null;
workspace.addChangeListener((event) => {
  // 忽略选中、移动等事件（仅在有实际改动时保存）
  if (event.isUiEvent) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveWorkspace(workspace);
    saveTimer = null;
  }, 300); // 300ms 防抖
});

// ---- 代码更新（带防抖） ----
let compileTimeout;

function myUpdateFunction(event) {
    // 1. 生成并显示 JavaScript 源代码
    const jsCode = javascriptGenerator.workspaceToCode(workspace);
    document.getElementById('code').textContent = jsCode || '';
	
    // 2. 防抖编译 MLog
    clearTimeout(compileTimeout);
    compileTimeout = setTimeout(() => {
        const mlogOutput = document.getElementById('mlogCode');
        try {
			
            const compiler = new mlogjs.Compiler();
            const [code, error, locations] = compiler.compile(jsCode);
                
            if (error)
			{
                mlogOutput.textContent = '# 编译错误：' + error.message;
            }
			else
			{
                mlogOutput.textContent = code;
            }
        } catch (e) {
            mlogOutput.textContent = '# 编译异常：' + e.message;
        }
    }, 300); // 防抖延迟 300ms
}

// 添加监听器
workspace.addChangeListener(myUpdateFunction);

// 初始生成一次（立即执行，不用防抖）
setTimeout(() => myUpdateFunction(null), 100);

// ---- 复制功能 ----
var copyBtn = document.getElementById('copyBtn');
var codeEl = document.getElementById('code');

copyBtn.addEventListener('click', function() {
    var text = codeEl.textContent || '';
    if (!text.trim()) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<span class="copy-icon">⚠️</span><span>无代码</span>';
        setTimeout(function() {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<span class="copy-icon">📋</span><span>复制</span>';
        }, 1200);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<span class="copy-icon">✅</span><span>已复制</span>';
            setTimeout(function() {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<span class="copy-icon">📋</span><span>复制</span>';
            }, 1600);
        }).catch(function() {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
});

function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<span class="copy-icon">✅</span><span>已复制</span>';
        setTimeout(function() {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<span class="copy-icon">📋</span><span>复制</span>';
        }, 1600);
    } catch (e) {
        alert('复制失败，请手动选择代码复制。');
    }
    document.body.removeChild(ta);
}

// ---- 复制 MLog 代码 ----
const copyMlogBtn = document.getElementById('copyMlogBtn');
const mlogCodeEl = document.getElementById('mlogCode');

copyMlogBtn.addEventListener('click', function() {
    const text = mlogCodeEl.textContent || '';
    if (!text.trim()) {
        copyMlogBtn.innerHTML = '<span class="copy-icon">⚠️</span><span>无代码</span>';
        setTimeout(() => {
            copyMlogBtn.innerHTML = '<span class="copy-icon">📋</span><span>复制</span>';
        }, 1200);
        return;
    }
    
    // 使用已有的复制函数（如 fallbackCopy 或 clipboard API）
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            copyMlogBtn.innerHTML = '<span class="copy-icon">✅</span><span>已复制</span>';
            setTimeout(() => {
                copyMlogBtn.innerHTML = '<span class="copy-icon">📋</span><span>复制</span>';
            }, 1600);
        }).catch(() => fallbackCopyMLog(text));
    } else {
        fallbackCopyMLog(text);
    }
});

function fallbackCopyMLog(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        copyMlogBtn.innerHTML = '<span class="copy-icon">✅</span><span>已复制</span>';
        setTimeout(() => {
            copyMlogBtn.innerHTML = '<span class="copy-icon">📋</span><span>复制</span>';
        }, 1600);
    } catch (e) {
        alert('复制失败，请手动选择代码复制。');
    }
    document.body.removeChild(ta);
}

// 保存工作区状态到 localStorage
export function saveWorkspace(workspace) {
  const state = Blockly.serialization.workspaces.save(workspace);
  const json = JSON.stringify(state);
  localStorage.setItem('mLogEditor_workspace', json);
  console.log('✅ 工作区已自动保存');
}

// 从 localStorage 加载工作区状态
export function loadWorkspace(workspace) {
  const saved = localStorage.getItem('mLogEditor_workspace');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      Blockly.serialization.workspaces.load(state, workspace);
      console.log('✅ 工作区已从 localStorage 恢复');
      return true;
    } catch (e) {
      console.error('加载失败:', e);
      return false;
    }
  }
  return false;
}

function saveWorkspaceToLocal(workspace) {
    const state = Blockly.serialization.workspaces.save(workspace);
    localStorage.setItem('mLogEditor_workspace', JSON.stringify(state));
}

// ----- 导出按钮 -----
document.getElementById('exportBtn').addEventListener('click', () => {
    const state = Blockly.serialization.workspaces.save(workspace);
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MLogEditor_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// ----- 导入按钮 -----
document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importInput').click();
});

document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const state = JSON.parse(ev.target.result);
            // 清空当前工作区并加载新状态
            Blockly.serialization.workspaces.load(state, workspace);
            // 立即保存到 localStorage 覆盖旧的
            saveWorkspaceToLocal(workspace);
            console.log('✅ 导入成功并已保存');
            //alert('导入成功！');
        } catch (err) {
            alert('导入失败：文件格式无效');
            console.error(err);
        }
    };
    reader.readAsText(file);
    // 重置 input，允许重复选择同一文件
    e.target.value = '';
});

document.getElementById('newBtn').addEventListener('click', function() {
    // 弹出确认对话框
    const userConfirmed = confirm('确定要新建工作区吗？当前所有未导出的内容将丢失。');
    if (userConfirmed) {
        // 清空工作区
        workspace.clear();
        // 保存空状态到 localStorage
        saveWorkspaceToLocal(workspace);
        // 手动触发代码更新（如果您的更新函数是监听器，它会自动触发）
        // 但为了确保立即更新，可以调用您的更新函数
        if (typeof myUpdateFunction === 'function') {
            myUpdateFunction();
        }
        // 可选：显示提示信息
        console.log('✅ 已新建空工作区');
        // 可选：轻提示（如果您有 toast 组件）
        // alert('已新建空工作区');
    }
});