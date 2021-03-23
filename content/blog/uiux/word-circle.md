---
title: word circle
date: 2021-03-23 16:03:67
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<div style="text-align:center;">
  <img src="https://user-images.githubusercontent.com/47022167/112135107-c35dc580-8c10-11eb-95f5-2d5a4525c69d.gif" alt="circle words">
</div>

저번 [rocket loading](https://pjaeyoung.github.io/uiux/rocket_loading/)에서 알게 된 팁들을 활용해서 글자들이 원형으로 돌아가는 애니메이션을 따라 만들었습니다.

글자 수(32자)가 굉장히 많기 때문에 html에 하드 코딩으로는 도저히 못하겠다 싶어 javascript로 태그를 생성하는 방법을 택했습니다.

<br/>

만드는 과정은 다음과 같습니다.

<br/>

글자들을 담을 부모 엘리먼트를 하나 만듭니다.

```html
<div class="circle-wrap"></div>
```

이 부모 엘리먼트가 360도 돌아가도록 할 것입니다.

```css
.circle-wrap {
  position: fixed;
  left: 50px;
  bottom: 50px;
  width: 200px;
  height: 200px;
  animation: rotateCircle 10s linear infinite;
  z-index: 10;
}

@keyframes rotateCircle {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

그 다음 글자 엘리먼트를 생성할 javascript 코드를 작성합니다.
문자열을 콤마 기준으로 split하여 배열로 변환한 후 각 문자를 span의 의사 요소 before의 content에 넣기 위해 dataset으로 저장했습니다.

```js
const $circleWrap = document.querySelector('.circle-wrap')
const words = 'G,E,N,T,L,E,M,A,N,,E,Y,E,,G,L,A,S,S,E,S,,G,E,N,T,L,E,M,A,N,T'

function createAWord({ order, text }) {
  const $span = document.createElement('span')
  $span.style.setProperty('--i', `${order}`)
  $span.dataset.before = text
  return $span
}

function createWords(words) {
  words.split(',').forEach((word, index) => {
    $circleWrap.appendChild(createAWord({ order: index + 1, text: word }))
  })
}

createWords(words)
```

사실 처음엔 `document.createElement` 대신 문자열로 태그를 생성하려고 했는데 이상하게도 `attr(data-before)`가 작동이 되지 않았습니다. 원인이 무엇인지 잘 모르겠습니다. 혹시 아는 분이 있으시면 댓글 달아주세요!

```js
function createWords(words) {
  $circleWrap.innerHTML = words
    .split(',')
    .forEach((word, index) => {
      return `<span style="--i:${index + 1};" data-before:${word}></span>`
    })
    .join('')
}
```

이번에 새롭게 안 사실인데 style에 --i를 넣어 css에서 var함수와 함께 변수처럼 활용하는 것처럼 `dataset`에 지정한 값도 `attr()`함수로 변수처럼 접근해서 사용할 수 있습니다.

`window.getComputedStyle( document.querySelector('someSpanId'), ":before")`
로 content를 읽는 것은 가능하나 수정은 불가능합니다. 그래서 `dataset`과 `attr()`을 사용해서 동적으로 값을 지정하게 했습니다.

```css
.circle-wrap span {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(calc(11deg * var(--i)));
}

.circle-wrap span:before {
  position: absolute;
  top: 15px;
  left: 15px;
  color: var(--font-color);
  content: attr(data-before);
  transform: rotate(311deg);
}
```

span의 의사 요소 before에도 `rotate` 시켜줘야합니다. 그렇지 않으면 아래처럼 정갈하지 않은 글자들이 렌더링됩니다.

![스크린샷, 2021-03-23 20-45-51](https://user-images.githubusercontent.com/47022167/112141600-ceb4ef00-8c18-11eb-9709-4532a1f607e4.png)

### 참고 사이트

[Landing Page Design, Mouse scroll slider, Infinite text scrolling, Sidebar menu HTML, CSS & JQUERY](https://youtu.be/ezunNVYPJDs)
