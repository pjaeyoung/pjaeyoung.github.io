---
title: search-bar-animation
date: 2021-07-26 15:07:43
category: uiux
thumbnail: { thumbnailSrc:"https://user-images.githubusercontent.com/47022167/127015218-2d52aebf-ceb9-418f-ab6a-2db87faf0294.gif" }
draft: false
---

![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/47022167/127015218-2d52aebf-ceb9-418f-ab6a-2db87faf0294.gif)

[freeCodeCamp](https://codepen.io/freeCodeCamp/full/wGqEga/)에서 제공하는 예제 중 위키피디아 랜덤 검색 미니 프로젝트가 있는데 거기서 검색바 인터렉션이 좋아서 따라 만들어봤습니다.  
  
html 구조는 다음과 같습니다. 

```html

<div id="search-bar">
    <form id="search-bar__form">
        <input id="search-bar__input" type="text" autocomplete="off" />
        <div id="btn-close"></div>
      </form>
      <div id="search-bar__guide-msg">Click Icon to Search</div>
</div>

```
  
돋보기 모양이었다가 검색바로 자연스럽게 변하는 모션을 어떻게 구현하는지가 포인트입니다. 콘솔을 사용해서 css를 어떻게 처리하는 지 힌트를 살폈습니다.  
  
input에 주황색 border를 줄 거라 예상했지만 form에 디자인을 줬습니다. 그리고 form의 가상요소 선택자(before)에 돋보기 손잡이를 만들었습니다.   
  
form의 width를 가지고 transition을 적용해서 검색 아이콘이 검색바로 변합니다. 

```css
#search-bar__form {
  position: relative;
  height: 45px;
  width: 45px;
  border-radius: 100px;
  background-color: var(--indigo-color);
  border: 4px solid var(--orange-color);
  cursor: pointer;
  transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
}

#search-bar__form.open {
  width: 300px;
}

```
마찬가지로 검색아이콘 막대기도 transition을 활용했습니다. 

```css

#search-bar__form::before {
  position: absolute;
  top: 35px;
  right: 0px;
  content: "";
  width: 4px;
  height: 20px;
  background-color: var(--orange-color);
  transform: rotate(-40deg);
  transition: height 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035) 0.3s;
}

#search-bar__form.open::before {
  height: 0;
}


```

검색 종료 아이콘은 `btn-close` id를 가진 div 태그의 가상요소 선택자(before,after)를 사용해서 만들었습니다.

```css
#btn-close {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  right: 20px;
  top: 12px;
}

#search-bar__form.open #btn-close {
  opacity: 1;
  visibility: visible;
}

#btn-close::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 15px;
  background-color: var(--orange-color);
  transition: all 0.3s linear 0.5s;
  transform: rotate(30deg) translateY(10px);
}

#btn-close::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 15px;
  background-color: var(--orange-color);
  transition: all 0.3s linear 0.5s;
  transform: rotate(-30deg) translateY(10px);
}

#btn-close.show::before {
  transform: rotate(30deg) translateY(0px);
}

#btn-close.show::after {
  transform: rotate(-30deg) translateY(0px);
}
```
 javascript로 `btn-close` 태그와 그 부모인 `search-bar__form` 태그 모두 click 이벤트를 등록했기 때문에 '이벤트 버블링'이 일어납니다. 버블링 때문에 `btn-close`를 클릭했음에도 최종적으로는 검색바가 열린상태를 유지하기 때문에 버블링을 중단하는 코드(`e.stopPropagation()`)을 작성했습니다. 문제는 검색바가 열려있지 않은 상태에서 실수로 `btn-close` 태그를 클릭했을 경우 버블링이 없어 클래스를 open으로 변경하지 못하는 현상이 발생합니다. 그래서 검색바가 열려있지 않을 경우에는 `btn-close`의 click 이벤트를 감지하지 못하도록 visibility를 hidden 시켰습니다. 

```js
 const $searchBarForm = document.querySelector("#search-bar__form");
  const $btnClose = document.querySelector("#btn-close");
  $searchBarForm.addEventListener("click", () => {
    $searchBarForm.classList.add("open");
    $btnClose.classList.add("show");
  });

  $btnClose.addEventListener("click", (e) => {
    e.stopPropagation();
    $searchBarForm.classList.remove("open");
    $btnClose.classList.remove("show");
  });

```

css 최종코드는 아래와 같습니다. 
```css
* {
  padding: 0;
  margin: 0;
  outline: none;
  box-sizing: border-box;
}

:root {
  --orange-color: #d96f32;
  --indigo-color: #092b40;
}

body {
  width: 100%;
  height: 100vh;
  background-color: var(--indigo-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

#search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#search-bar__form {
  position: relative;
  height: 45px;
  width: 45px;
  border-radius: 100px;
  background-color: var(--indigo-color);
  border: 4px solid var(--orange-color);
  cursor: pointer;
  transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
  -webkit-border-radius: 100px;
  -moz-border-radius: 100px;
  -ms-border-radius: 100px;
  -o-border-radius: 100px;
  -webkit-transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
  -moz-transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
  -ms-transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
  -o-transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
}

#search-bar__form::before {
  position: absolute;
  top: 35px;
  right: 0px;
  content: "";
  width: 4px;
  height: 20px;
  background-color: var(--orange-color);
  transform: rotate(-40deg);
  transition: height 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035) 0.3s;
  -webkit-transform: rotate(-40deg);
  -moz-transform: rotate(-40deg);
  -ms-transform: rotate(-40deg);
  -o-transform: rotate(-40deg);
  -webkit-transition: height 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035) 0.3s;
  -moz-transition: height 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035) 0.3s;
  -ms-transition: height 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035) 0.3s;
  -o-transition: height 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035) 0.3s;
}

#search-bar__form.open {
  width: 300px;
}

#search-bar__form.open::before {
  height: 0;
}

#search-bar__guide-msg {
  color: #fff;
  margin-top: 30px;
  cursor: default;
}

#search-bar__input {
  opacity: 0;
  color: #fff;
  height: 100%;
  width: 100%;
  padding: 10px 30px 10px 15px;
  border: none;
  border-radius: 100px;
  background-color: var(--indigo-color);
  transition: opacity 0.3s linear 0.3s;
  cursor: pointer;
  -webkit-border-radius: 100px;
  -moz-border-radius: 100px;
  -ms-border-radius: 100px;
  -o-border-radius: 100px;
  -webkit-transition: opacity 0.3s linear 0.3s;
  -moz-transition: opacity 0.3s linear 0.3s;
  -ms-transition: opacity 0.3s linear 0.3s;
  -o-transition: opacity 0.3s linear 0.3s;
}

#search-bar__form.open #search-bar__input {
  opacity: 1;
  cursor: text;
}

#btn-close {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  right: 20px;
  top: 12px;
}

#search-bar__form.open #btn-close {
  opacity: 1;
  visibility: visible;
}

#btn-close::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 15px;
  background-color: var(--orange-color);
  transition: all 0.3s linear 0.5s;
  transform: rotate(30deg) translateY(10px);
  -webkit-transform: rotate(30deg) translateY(10px);
  -moz-transform: rotate(30deg) translateY(10px);
  -ms-transform: rotate(30deg) translateY(10px);
  -o-transform: rotate(30deg) translateY(10px);
  -webkit-transition: all 0.3s linear 0.5s;
  -moz-transition: all 0.3s linear 0.5s;
  -ms-transition: all 0.3s linear 0.5s;
  -o-transition: all 0.3s linear 0.5s;
}

#btn-close::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 15px;
  background-color: var(--orange-color);
  transition: all 0.3s linear 0.5s;
  transform: rotate(-30deg) translateY(10px);
  -webkit-transform: rotate(-30deg) translateY(10px);
  -moz-transform: rotate(-30deg) translateY(10px);
  -ms-transform: rotate(-30deg) translateY(10px);
  -o-transform: rotate(-30deg) translateY(10px);
  -webkit-transition: all 0.3s linear 0.5s;
  -moz-transition: all 0.3s linear 0.5s;
  -ms-transition: all 0.3s linear 0.5s;
  -o-transition: all 0.3s linear 0.5s;
}

#btn-close.show::before {
  transform: rotate(30deg) translateY(0px);
  -webkit-transform: rotate(30deg) translateY(0px);
  -moz-transform: rotate(30deg) translateY(0px);
  -ms-transform: rotate(30deg) translateY(0px);
  -o-transform: rotate(30deg) translateY(0px);
}

#btn-close.show::after {
  transform: rotate(-30deg) translateY(0px);
  -webkit-transform: rotate(-30deg) translateY(0px);
  -moz-transform: rotate(-30deg) translateY(0px);
  -ms-transform: rotate(-30deg) translateY(0px);
  -o-transform: rotate(-30deg) translateY(0px);
}

```