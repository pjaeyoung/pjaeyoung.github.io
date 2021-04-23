---
title: eye tracking
date: 2021-04-23 21:04:39
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

![ezgif com-gif-maker](https://user-images.githubusercontent.com/47022167/115872035-4bd3be00-a47c-11eb-9d3b-63d687bfa631.gif)

마우스 움직임을 눈동자가 따라다니는 애니메이션을 따라 만들었습니다. 눈만 달랑 있으면 심심할까 텍스트 hover 효과도 주었지만 여기서는 '눈동자 모션'에 집중해볼까 합니다.

마우스를 브라우저 화면에 올리기 전 초기 화면은 눈동자가 정면을 바라보게 했습니다.

```html
<div class="eyes">
  <div class="eye">
    <div class="pupil"></div>
  </div>
  <div class="eye">
    <div class="pupil"></div>
  </div>
</div>
```

```css
.eye {
  position: relative;
  width: 50px;
  height: 50px;
  border: 2px solid var(--color-blue);
  border-radius: 25px;
}

.pupil {
  position: absolute;
  top: calc(50% - 10px); /* 화면 정면 응시를 위한 y축 중앙 배치 */
  left: calc(50% - 10px); /* 화면 정면 응시를 위한 x축 중앙 배치 */
  width: 20px;
  height: 20px;
  background-color: var(--color-blue);
  border-radius: 10px;
}
```

마우스가 브라우저 위에 올려지면 `top`과 `left`를 좌측 최상단에 놓습니다. 눈동자 크기를 고려해서 값을 조정합니다.

```js
const $pupils = document.querySelectorAll('.pupil')

document.body.addEventListener('mouseenter', () => {
  $pupils.forEach($pupil => {
    $pupil.style.top = '2px'
    $pupil.style.left = '2px'
  })
})
```

눈동자 움직임 원리는 간단합니다. 눈동자를 움직여야 한다고 눈동자의 위치를 조정하지 않습니다. 참고한 사이트는 top과 left 값을 변경하는데 이는 reflow를 발생시켜 좋지 않습니다. 대신 아닌 눈을 마우스 방향으로 회전(`transform`)합시다.

회전 각도 계산은 [유튜브](https://youtu.be/WqgKe3dcXxg)를 참고했습니다.

```js
class Eye {
  constructor({ $target }) {
    this._$target = $target
    this._width = this._$target.clientWidth
    this._height = this._$target.clientHeight
    // 브라우저 화면 상에서 엘리먼트가 그려지는 좌측 시작점 위치
    this._left = this._$target.getBoundingClientRect().left
    // 브라우저 화면 상에서 엘리먼트가 그려지는 우측 시작점 위치
    this._top = this._$target.getBoundingClientRect().top
  }

  get x() {
    // 브라우저 화면 x축 선상에서 눈의 정중앙 위치
    return this._left + this._width / 2
  }

  get y() {
    // 브라우저 화면 y축 선상에서 눈의 정중앙 위치
    return this._top + this._height / 2
  }

  set rotate(degree) {
    this._$target.style.transform = `rotate(${degree}deg)`
  }
}

function calcRotateDegree(eye, mouse) {
  // 마우스 위치와 눈 위치 간 거리에서 구한 radian입니다.
  const rad = Math.atan2(mouse.x - eye.x, mouse.y - eye.y)

  // radian을 degree로 변환하는 공식입니다. 마우스를 따라가는 속도가 어긋나는 것 같으면 220 숫자를 변경하세요!
  const result = rad * (180 / Math.PI) * -1 + 220
  return result
}

const eyes = [...document.querySelectorAll('.eye')].map(
  $eye => new Eye({ $target: $eye })
)

document.body.addEventListener('mousemove', e => {
  eyes.forEach(eye => {
    eye.rotate = calcRotateDegree(eye, e)
  })
})
```

### 참고 사이트

[Anand Upender](https://www.anandupender.com/) <br/>
[Animated Eyes Follow Mouse Cursor | Javascript Mousemove](https://youtu.be/WqgKe3dcXxg)
