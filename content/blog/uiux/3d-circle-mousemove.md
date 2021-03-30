---
title: 3D circle mousemove
date: 2021-03-30 15:03:81
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<div style="text-align:center;">
    <img src="https://user-images.githubusercontent.com/47022167/112943264-3a90dd80-916c-11eb-9235-32816e565c2b.gif" alt="3d circle mousemove">
</div>

지난 [3D circle text](https://pjaeyoung.github.io/uiux/3d-circle-text/)에 이어 마우스로 원통형을 움직이고 추가적으로 주변에 화려한 효과를 준 애니메이션을 따라 만들었습니다.

애니메이션을 무한 적용한 대신 `mousemove` 이벤트 리스너에서 실시간으로 `rotate` 시켰습니다. 기존 코드를 약간만 수정하면 되기 때문에 그다지 어렵지 않았습니다.

우선 애니메이션을 적용했던 부분을 다 지워줍니다.

그 다음 `window`에서 `mousemove`이벤트 리스너를 등록합니다. 콜백 함수 인자로 `event` 객체를 받습니다. `event`객체는 `pageX`, `pageY` 속성을 갖고 있습니다. 각각 스크롤을 포함한 브라우저 화면에서 왼쪽으로 얼마만큼(pageX), 위쪽에서 얼마만큼(pageY) 떨어져있는지 알려줍니다. 비슷하게 `clientX`, `clientY`가 있는데 `page`와 `client` 차이는 단지 스크롤을 포함하느냐 포함하지 않느냐입니다. 현재 제 코드는 스크롤이 없기 때문에 `page`와 `client`가 동일한 값을 갖습니다. 그래서 `clientX`와 `clientY`라는 속성을 써도 무방합니다.

```js
window.addEventListener('mousemove', event => {
  $circle.style.transform = `rotateY(${event.pageX /
    4}deg) rotateX(${(event.pageY / 4) * 0.2}deg)`
})
```

`rotate` 시킬 때 마우스 위치 값을 그대로 넣게 되면 엄청난 속도로 원통형이 회전하기 때문에 마우스 위치 값을 작게 계산해서 각도를 적절히 맞춰줍니다.

원통형 주변을 떠도는 글자들은 구현할 때 막혀서 모범 답안을 참고했습니다. 똑같은 원통형을 여러 개 만드는 줄 알았지만 `text-shadow`를 사용해서 간편하게 여러 개의 복사본을 만들 수 있었습니다.

```css
text-shadow: 200px -200px 5px rgba(185, 185, 185, 0.774), 600px 300px 0px rgba(185, 185, 185, 0.8),
  600px 300px 0px rgba(185, 185, 185, 0.8), 300px 200px 5px rgba(185, 185, 185, 0.5),
  600px -200px 0px rgba(185, 185, 185, 0.8), 600px 0px 0px rgba(185, 185, 185, 0.8),
  400px 300px 0px rgba(185, 185, 185, 0.8), 400px -300px 0px rgba(185, 185, 185, 0.8),
  400px 100px 2px rgba(185, 185, 185, 0.5), 200px 500px 0px rgba(185, 185, 185, 0.8),
  200px -500px 0px rgba(185, 185, 185, 0.8);
```

### 참고 사이트

[3D Circle Text Rotation Effects on mousemove using CSS & Javascript | Splitting.js](https://youtu.be/QvERvfZl8qc)<br/>
[clientX, offsetX, pageX, screenX의 차이](http://megaton111.cafe24.com/2016/11/29/clientx-offsetx-pagex-screenx%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90/)
