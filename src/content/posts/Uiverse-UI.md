---
title: Uiverse一个开源 UI 组件
description: 一个拥有数千个免费 UI 组件的开源生态，支持直接复制 HTML/CSS 使用。
published: 2026-02-14
image: ux-ui.png
---
## 什么是 Uiverse？

Uiverse 是一个**社区驱动的 UI 组件库**，提供大量界面元素：

![UI组件](/post-images/ui.png)

访问 [Uiverse 官网](https://uiverse.io/) 了解更多。

- Buttons  
- Cards  
- Inputs  
- Checkboxes  
- Toggles  
- Loaders  

所有组件均可自由使用，并支持商业项目。

---

## 展示 Uiverse UI

下面展示 UIverse 的 UI 库中的组件，<mark>点击或靠近</mark>：

---

<div style="margin: 30px 0; display: flex; justify-content: center; gap: 100px; align-items: center;">
  <!-- Torch Checkbox -->
  <div style="display: flex; flex-direction: column; align-items: center;">
    <label class="container">
      <div class="simple-text">Click me!</div>
      <input checked="checked" type="checkbox" />
      <div class="checkmark"></div>
      <div class="torch">
        <div class="head">
          <div class="face top">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="face left">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="face right">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="stick">
          <div class="side side-left">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="side side-right">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </label>
  </div>

  <!-- OpenAI Button -->
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div class="button-container">
      <button class="brutalist-button openai button-1">
        <div class="openai-logo">
          <svg
            class="openai-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5907 8.3829 14.6108 7.2144a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.3927-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
              fill="#10A37F"
            ></path>
          </svg>
        </div>
        <div class="button-text">
          <span>Powered By</span>
          <span>GPT-Omni</span>
        </div>
      </button>
    </div>
  </div>
</div>

<style>
/* From Uiverse.io by KSAplay */ 
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.simple-text {
  position: absolute;
  bottom: -40px;
  width: 120px;
  text-align: center;
  color: white;
  font-size: 16pt;
  font-weight: 800;
  font-family: monospace;
}

.torch {
  display: flex;
  justify-content: center;
  height: 150px;
}

.head,
.stick {
  position: absolute;
  width: 30px;
  transform-style: preserve-3d;
  transform: rotateX(-30deg) rotateY(45deg);
}

.stick {
  position: relative;
  height: 120px;
}

.face {
  position: absolute;
  transform-style: preserve-3d;
  width: 30px;
  height: 30px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  background-color: #000000;
}

.top {
  transform: rotateX(90deg) translateZ(15px);
}

.left {
  transform: rotateY(-90deg) translateZ(15px);
}

.right {
  transform: rotateY(0deg) translateZ(15px);
}

.top div,
.left div,
.right div {
  width: 102%;
  height: 102%;
}

.top div:nth-child(1),
.left div:nth-child(3),
.right div:nth-child(3) {
  background-color: #ffff9760;
}

.top div:nth-child(2),
.left div:nth-child(1),
.right div:nth-child(1) {
  background-color: #ffd80060;
}

.top div:nth-child(3),
.left div:nth-child(4),
.right div:nth-child(4) {
  background-color: #ffffff60;
}

.top div:nth-child(4),
.left div:nth-child(2),
.right div:nth-child(2) {
  background-color: #ff8f0060;
}

.side {
  position: absolute;
  width: 30px;
  height: 120px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: repeat(8, 12.5%);
  cursor: pointer;
  translate: 0 12px;
}

.side-left {
  transform: rotateY(-90deg) translateZ(15px) translateY(8px);
}

.side-right {
  transform: rotateY(0deg) translateZ(15px) translateY(8px);
}

.side-left div,
.side-right div {
  width: 103%;
  height: 103%;
}

.side div:nth-child(1) {
  background-color: #443622;
}

.side div:nth-child(2),
.side div:nth-child(2) {
  background-color: #2e2517;
}

.side div:nth-child(3),
.side div:nth-child(5) {
  background-color: #4b3b23;
}

.side div:nth-child(4),
.side div:nth-child(10) {
  background-color: #251e12;
}

.side div:nth-child(6) {
  background-color: #292115;
}

.side div:nth-child(7) {
  background-color: #4b3c26;
}

.side div:nth-child(8) {
  background-color: #292115;
}

.side div:nth-child(9) {
  background-color: #4b3a21;
}

.side div:nth-child(11),
.side div:nth-child(15) {
  background-color: #3d311d;
}

.side div:nth-child(12) {
  background-color: #2c2315;
}

.side div:nth-child(13) {
  background-color: #493a22;
}

.side div:nth-child(14) {
  background-color: #2b2114;
}

.side div:nth-child(16) {
  background-color: #271e10;
}

.container input:checked ~ .torch .face {
  filter: drop-shadow(0px 0px 2px rgb(255, 255, 255))
    drop-shadow(0px 0px 10px rgba(255, 237, 156, 0.7))
    drop-shadow(0px 0px 25px rgba(255, 227, 101, 0.4));
}

.container input:checked ~ .torch .top div:nth-child(1),
.container input:checked ~ .torch .left div:nth-child(3),
.container input:checked ~ .torch .right div:nth-child(3) {
  background-color: #ffff97;
}

.container input:checked ~ .torch .top div:nth-child(2),
.container input:checked ~ .torch .left div:nth-child(1),
.container input:checked ~ .torch .right div:nth-child(1) {
  background-color: #ffd800;
}

.container input:checked ~ .torch .top div:nth-child(3),
.container input:checked ~ .torch .left div:nth-child(4),
.container input:checked ~ .torch .right div:nth-child(4) {
  background-color: #ffffff;
}

.container input:checked ~ .torch .top div:nth-child(4),
.container input:checked ~ .torch .left div:nth-child(2),
.container input:checked ~ .torch .right div:nth-child(2) {
  background-color: #ff8f00;
}

.container input:checked ~ .torch .side div:nth-child(1) {
  background-color: #7c623e;
}

.container input:checked ~ .torch .side div:nth-child(2),
.container input:checked ~ .torch .side div:nth-child(2) {
  background-color: #4c3d26;
}

.container input:checked ~ .torch .side div:nth-child(3),
.container input:checked ~ .torch .side div:nth-child(5) {
  background-color: #937344;
}

.container input:checked ~ .torch .side div:nth-child(4),
.container input:checked ~ .torch .side div:nth-child(10) {
  background-color: #3c2f1c;
}

.container input:checked ~ .torch .side div:nth-child(6) {
  background-color: #423522;
}

.container input:checked ~ .torch .side div:nth-child(7) {
  background-color: #9f7f50;
}

.container input:checked ~ .torch .side div:nth-child(8) {
  background-color: #403320;
}

.container input:checked ~ .torch .side div:nth-child(9) {
  background-color: #977748;
}

.container input:checked ~ .torch .side div:nth-child(11),
.container input:checked ~ .torch .side div:nth-child(15) {
  background-color: #675231;
}

.container input:checked ~ .torch .side div:nth-child(12) {
  background-color: #3d301d;
}

.container input:checked ~ .torch .side div:nth-child(13) {
  background-color: #987849;
}

.container input:checked ~ .torch .side div:nth-child(14) {
  background-color: #3b2e1b;
}

.container input:checked ~ .torch .side div:nth-child(16) {
  background-color: #372a17;
}

/* From Uiverse.io by 0xnihilism */ 
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* Common styles for both buttons */
.brutalist-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 142px;
  height: 142px;
  color: #e5dede;
  font-weight: bold;
  text-decoration: none;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Styles for the first button */
.button-1 {
  background-color: #063525;
  border: 3px solid #42c498;
  border-radius: 12px;
  box-shadow: 4px 4px 1px #000000;
}

.button-1:hover {
  background-color: #1a5c46;
  border-color: #030504;
  transform: translate(-6px, -6px) rotate(1deg);
  box-shadow: 10px 10px 0 #000000, 15px 15px 20px rgba(64, 164, 122, 0.2);
}

.button-1::before,
.button-1::after {
  content: "";
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.6s;
}

.button-1::before {
  left: -100%;
}
.button-1::after {
  left: 100%;
}

.button-1:hover::before {
  animation: swipeRight 1.5s infinite;
}
.button-1:hover::after {
  animation: swipeLeft 1.5s infinite;
}

@keyframes swipeRight {
  100% {
    transform: translateX(200%) skew(-45deg);
  }
}

@keyframes swipeLeft {
  100% {
    transform: translateX(-200%) skew(-45deg);
  }
}

/* Hover effects */
.brutalist-button:hover .openai-logo {
  transform: translateY(-10px);
}

.brutalist-button:hover .openai-icon {
  width: 40px;
  height: 40px;
}

.bruta.brutalist-button:hover .openai-text {
  opacity: 1;
  max-height: 60px;
  margin-top: 8px;
}

/* Styles for the OpenAI logo and text */
.openai-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 3;
}

.openai-icon {
  width: 64px;
  height: 64px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.openai-text {
  font-size: 24px;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.button-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
  text-align: center;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 3;
}

.button-text span:first-child {
  font-size: 12px;
  font-weight: normal;
}

.button-text span:last-child {
  font-size: 16px;
}

/* Hover effects */
.brutalist-button:hover .openai-logo {
  transform: translateY(-10px);
}

.brutalist-button:hover .openai-icon {
  width: 40px;
  height: 40px;
}

.brutalist-button:hover .button-text,
.brutalist-button:hover .openai-text {
  opacity: 1;
  max-height: 60px;
  margin-top: 8px;
}

/* Animation for the OpenAI logo */
@keyframes spin-and-zoom {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.brutalist-button:hover .openai-icon {
  animation: spin-and-zoom 4s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
}

.brutalist-button:hover .openai-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.brutalist-button:active .openai-icon,
.brutalist-button:active .openai-text,
.brutalist-button:active .button-text {
  transform: scale(0.95);
}
</style>

---

## 为什么推荐 Uiverse？

如果你正在搭建个人网站或博客，它有几个极强的优势：

### 🚀 极快的开发速度
无需设计 UI，复制即可用。

### 🎨 社区设计质量高
很多组件达到 Dribbble 水准。

### 🧩 高度自由
你可以：

- 修改颜色
- 改动画
- 调整结构
- 甚至二次封装成组件

---

## 建议使用方式

不要直接复制几十个组件。

正确姿势：

- 挑选 2~3 种风格  
- 统一颜色体系  
- 做成自己的 UI 规范  

否则网站会变成：

> “组件拼装怪”

---

## 总结

如果你想快速提升网站颜值、减少 UI 开发时间并使用开源组件，那么 [Uiverse](https://uiverse.io/) 非常值得加入你的开发工具箱。