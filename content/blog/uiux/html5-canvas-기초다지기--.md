---
title: HTML5 Canvas 기초다지기
date: 2021-04-01 16:04:17
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

> SPICY YOGHURT님의 GAME DEVELOPMENT TUTORIALS에서 알게 된 Canvas 기본 개념과 사용법을 정리했습니다.

## 목차

1. <a href="#content1">Canvas 기본 다지기</a>
   - <a href="#content1-1">Canvas 란</a>
   - <a href="#content1-2">Canvas 태그 살피기</a>
   - <a href="#content1-3">Javascript로 Canvas 접근하기</a>
2. <a href="#content2">Canvas로 도형, 선, 텍스트 그리기</a>
   - <a href="#content2-1">사각형 그리기</a>
   - <a href="#content2-2">패스로 모양 그리기</a>
   - <a href="#content2-3">원 그리기</a>
   - <a href="#content2-4">선 그리기</a>
   - <a href="#content2-5">삼각형 그리기</a>
   - <a href="#content2-6">SVG 경로 그리기</a>
   - <a href="#content2-7">텍스트 그리기</a>
3. <a href="#content3">Canvas로 애니메이션 만들기</a>
   - <a href="#content3-1">requestAnimationFrame</a>
   - <a href="#content3-2">애니메이션 동작 원리</a>

<section>
<h1 id="content1">1. Canvas 기본 다지기</h1>

<h2 id="content1-1">Canvas란</h2>

- javascript를 사용해서 도형, 선, 텍스트, 이미지를 그릴 수 있는 그래픽 컨테이너
- 기본적으로 `img` 태그처럼 동작하나 `src` 속성을 사용해 외부 소스를 가져오는 `img` 태그와 달리 직접 그림
- 최근 브라우저에서는 우클릭으로 `canvas` 태그의 현재 상태의 이미지를 저장할 수 있음
- 애니메이션과 게임의 기본 원리는 그리기와 지우기를 빠르게 반복하는 것

<h2 id="content1-2">Canvas 태그 살피기</h2>

- 구 브라우저일 경우를 대비해 `canvas` 태그 사이에 대체 콘텐츠 삽입할 것

```html
<canvas id="canvas1">
  사용하시는 브라우저가 HTML5 canvas 태그를 지원하지 않습니다.
</canvas>
```

- `width`, `height` 속성 선택사항
  - 미지정시 너비 300, 높이 150 (단위 px)
  - css 로도 지정 가능

<h2 id="content1-3">Javascript로 Canvas 접근하기</h2>

- `canvas.getContext('2d')`를 사용해서 `CanvasRenderingContext2D` 객체를 얻을 수 있음
- `CanvasRenderingContext2D` 객체는 도형, 선, 택스트, 이미지를 그리기 위한 메서드들을 가지고 있음

```js
const canvas = document.getElementById('canvas1')
const context = canvas.getContext('2d')
```

</section>

<br>

<section>
<h1 id="content2">2. Canvas로 도형, 선, 텍스트 그리기</h1>

- 캔버스 작업의 작동방식은 (1)스타일을 정의한 후 (2) 채우기 혹은 그리기
  - 비유하자면 (1) 붓에 물감을 묻히고 (2) 붓으로 모양을 그리기
- 스타일의 경우 단 한 번 지정하면 변경하기 전까지 똑같이 적용됨
  - 마치 붓 물감을 갈지 않고 계속 그리는 것과 같음
    ![스크린샷, 2021-04-01 21-30-34](https://user-images.githubusercontent.com/47022167/113294152-9a84b100-9331-11eb-9767-f1a9b2fbcc07.png)

```js
context.fillStyle = BLUE // 색상을 한 번 지정한 후
context.fillRect(100, 50, 100, 75) // A
// 색상 변경이 없으면 스타일이 변함없이 적용된다
context.fillRect(100, 150, 50, 50) //B
```

<h2 id="content2-1">사각형 그리기</h2>

- 직사각형, 정사각형은 `fillRect`, `strokeRect`를 사용

  - `fillRect`는 면 색상
  - `strokeRect`는 선 색상

<h2 id="content2-2">패스로 모양 그리기</h2>

- 원, 선, 삼각형 및 기타 여러 모양은 `path`를 사용해서 그릴 수 있음
- 공통적으로 `beginPath()`를 호출하여 시작하고 끝낼 때는 `fill()` 혹은 `stroke()`을 호출함

<h2 id="content2-3"> 원 그리기 </h2>

- `arc` 함수로 원 모양 그리기
  - `context.arc(원중심 x , 원중심 y , 반지름, 시작 라디안 각도, 끝 라디안 각도)`

```js
context.fillStyle = PINK
context.beginPath()
context.arc(300, 100, 50, 0, 2 * Math.PI)
context.fill()
```

- 위 코드를 실행했을 때 아래 원본처럼 그려짐
  - 반지름을 25로 했을 때와 끝 각도를 Math.PI로 했을 때와 함께 비교

![스크린샷, 2021-04-01 21-51-57](https://user-images.githubusercontent.com/47022167/113296486-81c9ca80-9334-11eb-8c2e-96931d6ab596.png)

<h2 id="content2-4"> 선 그리기 </h2>

- `moveTo()`로 선 그리기 시작 좌표 설정
- `lineTo()`로 선 시작 좌표와 연결시킬 끝 좌표 설정

```js
context.strokeStyle = PINK
context.lineWidth = 5
context.beginPath()
context.moveTo(50, 50)
context.lineTo(150, 150)
context.stroke()
```

![스크린샷, 2021-04-01 22-02-52](https://user-images.githubusercontent.com/47022167/113297790-079a4580-9336-11eb-81ac-062d1cce8120.png)

<h2 id="content2-5"> 삼각형 그리기 </h2>

![스크린샷, 2021-04-01 22-16-58](https://user-images.githubusercontent.com/47022167/113299594-010ccd80-9338-11eb-8fdc-d58495fdba8a.png)

- 면을 칠하는 경우 `lineTo()`를 두 번만 호출해도 `fill()`함수가 호출할 때 자동으로 연결됨
- 선을 칠하는 경우에는 `lineTo()`를 두 번만 호출하면 두 번째 그림처럼 나타남
  - 삼각형처럼 그리려면 `lineTo()`를 세 번 호출해야 함

```js
// 첫 번째 삼각형
context.fillStyle = 'orange'
context.beginPath()
context.moveTo(100, 100)
context.lineTo(200, 100)
context.lineTo(150, 25)
context.fill()

// 두 번째 삼각형
context.strokeStyle = 'orange'
context.beginPath()
context.moveTo(250, 100)
context.lineTo(350, 100)
context.lineTo(300, 25)
context.stroke()

// 세 번째 삼각형
context.beginPath()
context.moveTo(400, 100)
context.lineTo(500, 100)
context.lineTo(450, 25)
context.lineTo(400, 100)
context.stroke()
```

<h2 id="content2-6"> SVG 경로 그리기 </h2>

- 복잡한 모양은 툴을 사용해서 SVG로 만든 후 SVG에 들어있는 경로정보를 인자로 `Path2D` 생성자 함수가 반환한 값을 `stroke()`함수에 넘겨주면 됨

```js
let path = new Path2D('svg 경로')

context.beginPath()
context.stroke(path)
context.fill(path)
```

<h2 id="content2-7"> 텍스트 그리기 </h2>

- `fillText()`를 사용해서 텍스트 그릴 수 있음
- 특이하게 `fillStyle`로 텍스트 색상을 선택함

```js
context.fillStyle = 'black'
context.font = '25px Arial'
context.textAlign = 'center'
context.textBaseline = 'center'
context.fillText('Some text', 200, 50)
```

- 텍스트 정렬 방식이 기존에 알던 방식과 정 반대

- textAlign
  ![스크린샷, 2021-04-01 22-39-02](https://user-images.githubusercontent.com/47022167/113302497-146d6800-933b-11eb-9b70-282305fa607a.png)

- textBaseline
  ![스크린샷, 2021-04-01 22-42-33](https://user-images.githubusercontent.com/47022167/113302980-93fb3700-933b-11eb-8b4d-390eba776f2b.png)

</section>

<section>

<h1 id="content3">Canvas로 애니메이션 만들기</h1>

- `canvas`에 그려진 모형에 움직임이나 색상 변화 등을 주기 위해서는 변경사항이 발생할 때마다 새롭게 그려줘야 함
  - 스톱모션([stop motion](https://ko.wikipedia.org/wiki/%EC%8A%A4%ED%86%B1_%EB%AA%A8%EC%85%98))으로 비유할 수 있음

<h2 id="content3-1">requestAnimationFrame</h2>

- `web api`에서 제공하는 `requestAnimationFrame`을 사용해서 새롭게 그릴 부분을 브라우저에 반영함
- `requestAnimationFrame(callback)`에서 콜백함수는 반드시 `requestAnimationFrame`을 재귀적으로 호출하도록 해야 함

```js
function loop() {
  draw()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
```

<h2 id="content3-2">애니메이션 동작 원리</h2>

<figure>
<img src="https://user-images.githubusercontent.com/47022167/113306319-ed189a00-933e-11eb-97ba-9a1ba7819d77.png" alt="animation cycle">
<figcaption style="text-align:center; color:grey">출처 : GAME DEVELOPMENT TUTORIALS </figcaption>
</figure>

- 애니메이션으로 만들기 위해서는 update, clear, draw 과정을 거쳐야 함
  - update : 변경점을 만들기 ex) 좌표값 변경
  - clear : 이전에 캔버스에 그려진 것들을 삭제 ex) 이전 좌표값에 그려진 원을 지우기
  - draw : 변경점에 맞춰 새로 그리기 ex) 새로운 좌표값에 원 그리기

```js
const canvas = document.getElementById('canvas1')
const context = canvas.getContext('2d')

let posX = 0
let posY = 0
context.fillStyle = 'pink'

function update() {
  posX += 1
  posY += 1
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height) // 캔버스 크기에 속한 모든 모형들 지우기
}

function draw() {
  context.fillRect(posX, posY, 10, 10)
}

function loop() {
  update()
  clear()
  draw()

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
```

<figure style="width:100%;border: 1px solid black;">
<img  src="https://user-images.githubusercontent.com/47022167/113308982-abd5b980-9341-11eb-98e4-5c953c13aadb.gif">
</figure>

</section>

### 참고 자료

[GAME DEVELOPMENT TUTORIALS - by. SPICY YOGHURT](https://spicyyoghurt.com/tutorials/html5-javascript-game-development/setup-html5-canvas-game)<br>
[MDN - Canvas Tutorial](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
