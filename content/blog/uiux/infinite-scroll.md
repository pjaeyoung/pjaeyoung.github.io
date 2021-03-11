---
title: infinite scroll
date: 2021-03-11 14:03:82
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<h1 style="border-bottom:0;"> Infinite Scroll 구현 </h1>

### 공통으로 사용되는 ScrollList 클래스 
- items라는 배열이 어디에서(start) 어디까지(end) 렌더링이 되었는지 기억하고 렌더링 가능한 횟수만큼 콜백을 실행시키는 기능을 갖춘 클래스 
- items 데이터 형태의 제약이 없도록 외부에서 `createElement` 함수를 받도록 구현함 
    - `createElement(item:any):Node`
- `isAllItemsRendered` 메소드 : items 모두 렌더링되었는지 여부 
- `getLastRenderedItem` 메소드 : 현재 렌더링된 items 중 마지막 item 반환
- `render` 메소드 : items 개수가 모두 렌더링될 때까지 일정 개수(perItem)만큼 로드

```js
// ScrollList.js
export default class ScrollList {
  constructor({ $target, items, renderPerItem, createElement }) {
    if (
      this.isInvalidConstructorArgs({
        $target,
        items,
        renderPerItem,
        createElement,
      })
    ) {
      throw new Error(ScrollList.messages.invalidConstructorArgs);
    }

    this.$target = $target;
    this.items = items;
    this.renderPerItem = renderPerItem;
    this.createElement = createElement;
    this.currentLastIndex = -1;

    this.render();
  }

  isInvalidConstructorArgs({ $target, items, renderPerItem, createElement }) {
    return (
      !($target instanceof HTMLElement) ||
      !Array.isArray(items) ||
      typeof renderPerItem !== "number" ||
      typeof createElement !== "function"
    );
  }

  isAllItemsRendered() {
    return this.currentLastIndex + 1 === this.items.length;
  }

  getLastRenderedItem() {
    return this.$target.children[this.currentLastIndex];
  }

  render() {
    if(this.isAllItemsRendered()) return;

    const startIndex = this.currentLastIndex + 1;
    const endIndex = startIndex + this.renderPerItem;

    this.items.slice(startIndex, endIndex).forEach((anItem) => {
      this.$target.appendChild(this.createElement(anItem));
      this.currentLastIndex++;
    });
  }
}

ScrollList.messages = {
  invalidConstructorArgs: "잘못된 인자로 ScrollList 인스턴스를 생성했습니다.",
  notNumberArg: "인자 타입이 숫자가 아닙니다.",
  lastIndexOverItemsCount: "lastIndex 값이 items 개수보다 큽니다.",
};


```


### 1. 스크롤 위치 계산하여 구현하는 방법

#### :book: 사전 지식
- `document.documentElement`는 `html`을 가리킴 
- `html.scrollHeight`은 스크롤에 감춰진 영역을 포함한 전체 높이 값을 의미함
- `window.innerHeight`은 브라우저의 탭/주소입력/북마크 바를 제외한 보여지는 영역을 의미함.
- `window.scrollY`는 스크롤 가능한 영역 사이에 위치한 값 
- 스크롤 가능한 영역은 별다른 엘리먼트 태그가 없다면 스크롤에 감춰진 영역, 즉 `html.scrollHeight - window.innerHeight` 값

![스크린샷, 2021-03-11 15-50-06](https://user-images.githubusercontent.com/47022167/110747297-847b5780-8281-11eb-9302-c8a361d06b5f.png)


#### 동작원리
- scroll handle의 bottom의 위치가 감춰진 영역의 bottom 위치까지 도달하면 감춰진 영역은 0가 된다. 
![스크린샷, 2021-03-11 15-58-32](https://user-images.githubusercontent.com/47022167/110748237-cb1d8180-8282-11eb-8718-bcf1e7fac043.png)


- 이 때 새로운 엘리먼트들을 추가하여 감춰진 영역 크기를 만들어 계속 스크롤할 수 있게 된다. <br/>
![스크린샷, 2021-03-11 15-59-21](https://user-images.githubusercontent.com/47022167/110748278-d8d30700-8282-11eb-9c4e-0c1af07c0684.png)

```js
// index.js

import ScrollList from "./components/ScrollList.js";

function createElement(item) {
  const $li = document.createElement("li");
  $li.className = "scroll-item";
  $li.textContent = item;
  return $li;
}

function createLoadMore({ scrollList, html }) {
  return function loadMore() {
    const scrollableHeight = html.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollableHeight) {
      scrollList.render();
      return false;
    }
  };
}

function init() {
  const items = new Array(21).fill().map((_, i) => `item ${i + 1}`);
  const PER_ITEMS = 5;

  const scrollList = new ScrollList({
    $target: document.querySelector("#scroll-list"),
    items,
    renderPerItem: PER_ITEMS,
    createElement,
  });
  window.addEventListener(
    "scroll",
    createLoadMore({ scrollList, html: document.documentElement })
  );
}

init();


```


### 2. IntersectionObserver 사용하여 구현하는 방법 

#### :book: 사전지식
- `IntersectionObserver`는 타겟을 지정하고난 후 타겟이 '보여지는 영역'에 나타났는지 관찰, 감시하는 기능이 있다. 
- 생성자에 감지할 때 호출하는 콜백함수와 감지 영역 및 감지 비율을 지정하는 옵션값을 넘긴다. 
```js
    new IntersectionObserver(callback,options);
```
- `callback` : 감지할 대상으로 등록한 타겟 목록들(entries)과 observer 인스턴스 자신을 인자로 받는 형태다. 콜백이 곧바로 실행되므로 등록한 타겟이 감지되었는지 확인 후 감지되었을 때 원하는 동작을 실행해야한다.

```js

function callback(entries,observer){
    // 감지된 경우 
    if(entries[0].isIntersecting){
        // 원하는 동작 실행
    }
}
```
- `options`는 타겟을 감지할 영역(root)과 영역크기(rootMargin) 그리고 타겟이 영역에 노출된 비율(threshold)를 결정하는 객체다. 각각 문서의 뷰포트, "0px", 0 값이 디폴트다.

```js
const options = {
    root: null,
    rootMargin:"0px",
    threshold:0
}
```

#### 동작원리
- 전체 목록 중 일부만 먼저 렌더링한다.
- 마지막에 렌더링한 값만 감시한다.
![스크린샷, 2021-03-11 16-36-46](https://user-images.githubusercontent.com/47022167/110752450-a62c0d00-8288-11eb-96be-e04536d78bcd.png)
- 마지막에 렌더링한 엘리먼트가 감지되면 전체 목록에서 아직 렌더링되지 않은 값들을 추가적으로 렌더링한다. 
![스크린샷, 2021-03-11 16-39-21](https://user-images.githubusercontent.com/47022167/110752490-b217cf00-8288-11eb-9f1e-5b2b7c8afa56.png)
![스크린샷, 2021-03-11 16-41-10](https://user-images.githubusercontent.com/47022167/110752517-b93edd00-8288-11eb-8ca1-ce0b038793f2.png)

- 전체 목록이 모두 렌더링하기 전까지 위 과정을 반복한다.

```js
// index.js

import ScrollList from "./components/ScrollList.js";

const items = new Array(21).fill().map((_, i) => `item ${i + 1}`);
const PER_ITEMS = 5;

function createElement(item) {
  const $li = document.createElement("li");
  $li.className = "scroll-item";
  $li.textContent = item;
  return $li;
}

function createObserverCallback(scrollList) {
  return (entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.unobserve(entries[0].target);
    if (scrollList.isAllItemsRendered()) {
      observer.disconnect();
    } else {
      scrollList.render();
      observer.observe(scrollList.getLastRenderedItem());
    }
  };
}

function init() {
  const scrollList = new ScrollList({
    $target: document.querySelector("#scroll-list"),
    items,
    renderPerItem: PER_ITEMS,
    createElement,
  });

  const io = new IntersectionObserver(createObserverCallback(scrollList), {
    threshold: 0.8,
  });

  io.observe(scrollList.getLastRenderedItem());
}

init();



```