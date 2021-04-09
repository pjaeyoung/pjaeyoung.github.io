---
title: Particle
date: 2021-04-08 23:04:16
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<figure style="text-align:center">
    <img style="border: 5px solid rgb(234, 234, 234)" src="https://user-images.githubusercontent.com/47022167/114046868-29f70a80-98c4-11eb-8d9a-8e6fb4b669c9.gif" alt="마우스와 캔버스 도형의 상호작용">
</figure>

지난 글 [HTML5 Canvas 기초다지기](https://pjaeyoung.github.io/uiux/html5-canvas-%EA%B8%B0%EC%B4%88%EB%8B%A4%EC%A7%80%EA%B8%B0--/)를 응용한 Canvas와 인터랙션을 다룬 [유튜브 영상](https://youtu.be/vxljFhP2krI)을 따라 만들었습니다.

먼저 html 파일에 `canvas` 태그를 하나 생성합니다.

```html
<body>
  <canvas id="canvas1"></canvas>
  <script src="index.js"></script>
</body>
```

canvas크기는 css로 조정했습니다. 아래에 다시 설명하겠지만 이 방식은 권장하지 않습니다.

```css
#canvas1 {
  width: 500px;
  height: 300px;
}
```

그 다음 javascript 파일에서 300개의 particle을 그려줍니다.

particle이 canvas에서 원형으로 그려지고 canvas 크기 안에서 x,y 방향으로 움직일 수 있다는 공통 특성이 존재하기 때문에 클래스로 구현했습니다.

```js
class Particle {
  constructor({
    x,
    y,
    dx,
    dy,
    radius,
    fillStyle,
    ctx,
    canvasHeight,
    canvasWidth,
  }) {
    this._x = x // 원의 중심 x축 위치
    this._y = y // 원의 중심 y축 위치
    this._radius = radius // 반지름
    this._dx = dx // x축으로 이동할 거리
    this._dy = dy // y축으로 이동할 거리
    this._ctx = ctx // CanvasRenderingContext2D 객체
    this._fillStyle = fillStyle // 원의 색상
    this._canvasHeight = canvasHeight // 캔버스 높이
    this._canvasWidth = canvasWidth // 캔버스 너비

    this.animate = this.animate.bind(this)
    requestAnimationFrame(this.animate) // particle 인스턴스 생성하자마자 애니메이션 활성화
  }

  // canvas 안에서 x축 이동하도록 좌우방향 지정
  get dx() {
    if (
      this._x + this._radius > this._canvasWidth ||
      this._x - this._radius < 0
    ) {
      this._dx *= -1
    }
    return this._dx
  }

  // canvas 안에서 y축 이동하도록 상하방향 지정
  get dy() {
    if (
      this._y + this._radius > this._canvasHeight ||
      this._y - this._radius < 0
    ) {
      this._dy *= -1
    }
    return this._dy
  }

  // 원의 중심을 원의 이동거리만큼 더한 값으로 갱신
  update() {
    this._x += this.dx
    this._y += this.dy
  }

  // 갱신된 원의 중심에서 원 그리기
  draw() {
    this._ctx.beginPath()
    this._ctx.fillStyle = this._fillStyle
    this._ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI)
    this._ctx.fill()
  }

  // requestAnimationFrame에 호출할 콜백함수
  animate() {
    this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
    this.update()
    this.draw()

    requestAnimationFrame(this.animate)
  }
}
```

`dx`와 `dy` 접근자 프로퍼티는 particle이 canvas를 벗어났는지 측정하여 canvas 내에 움직이도록 방향을 바꿔줍니다. 반지름을 더하거나 빼는 계산과정이 있는 이유는 particle의 면적을 기준으로 canvas를 벗어났는지 확인하기 위해서입니다. 가령, 반지름 없이 `this._x > this._canvasWidth` 로 계산하게 된다면 아래와 같이 canvas 밖으로 절반의 면적이 뚫고 나옵니다.

<figure style="display:flex; flex-direction:column;align-items:center;">
<figcaption style="color:grey;">반지름 고려하지 않은 경우</figcaption>
<img style="border: 1px solid grey; width: 80%;" src="https://user-images.githubusercontent.com/47022167/114135780-b6e1a880-9944-11eb-8977-345d52b4dfb7.png" alt="반지름 고려하지 않은 경우">
</figure>

반지름을 고려해 계산하면 정확히 particle의 면적이 canvas 밖으로 나오지 않고 방향을 바꿔 이동하게 됩니다.

<figure style="display:flex; flex-direction:column;align-items:center;">
<figcaption style="color:grey;">반지름 고려한 경우</figcaption>
<img style="border: 1px solid grey; width:80%" src="https://user-images.githubusercontent.com/47022167/114135786-b77a3f00-9944-11eb-8ffd-00f85daeb9d9.png" alt="반지름 고려한 경우">
</figure>

이제 300개의 Particle 인스턴스를 생성해봅니다.

```js
function createAParticle({ ctx, canvasHeight, canvasWidth, colors }) {
  const radius = Math.floor(Math.random() * 3)
  const diameter = radius * 2
  const x = Math.random() * (canvasWidth - diameter) + diameter
  const y = Math.random() * (canvasHeight - diameter) + diameter
  const dx = Math.random() * 1 - 0.5
  const dy = Math.random() * 1 - 0.5
  const color = colors[Math.floor(Math.random() * colors.length)]

  return new Particle({
    x,
    y,
    dx,
    dy,
    radius,
    fillStyle: color,
    ctx,
    canvasHeight,
    canvasWidth,
  })
}

function init() {
  const $canvas = document.querySelector('#canvas1')
  const ctx = $canvas.getContext('2d')

  const colors = ['#9EBCCE', '#E84925', '#CBD8E0', '#262E31']

  let count = 300

  while (count--) {
    createAParticle({
      ctx,
      colors,
      canvasHeight: $canvas.height,
      canvasWidth: $canvas.width,
    })
  }
}

init()
```

빈 화면이 나옵니다.😅

Particle 클래스 내부에 clearRect를 한 게 원인이었습니다. 제가 작성한 코드는 particle 하나를 그리면 다음에 그려질 particle에서 이전에 그려진 particle을 지우는 작업을 했던 겁니다. 하나하나 하드코딩으로 작성하다 클래스로 한 번에 그리도록 하려다가 canvas 원리에 대해 혼선이 왔습니다.

![스크린샷, 2021-04-09 15-53-12](https://user-images.githubusercontent.com/47022167/114141870-28bdf000-994d-11eb-8d59-1d5b77fa0f6e.png)
![스크린샷, 2021-04-09 15-55-31](https://user-images.githubusercontent.com/47022167/114141875-29ef1d00-994d-11eb-890a-2eb4d4049cee.png)
![스크린샷, 2021-04-09 16-03-35](https://user-images.githubusercontent.com/47022167/114141877-29ef1d00-994d-11eb-927a-c64afa39427a.png)

각각의 Particle에서 지우는 과정을 넣지 않고 모든 Particle이 그린 후 한 번에 지우도록 해줍니다.

Particle 클래스에서 canvas를 지우는 코드와 애니메이션을 실행시키는 코드를 삭제합니다.

```js
class Particle {
  constructor({
    x,
    y,
    dx,
    dy,
    radius,
    fillStyle,
    ctx,
    canvasHeight,
    canvasWidth,
  }) {
    this._x = x // 원의 중심 x축 위치
    this._y = y // 원의 중심 y축 위치
    this._radius = radius // 반지름
    this._dx = dx // x축으로 이동할 거리
    this._dy = dy // y축으로 이동할 거리
    this._ctx = ctx // CanvasRenderingContext2D 객체
    this._fillStyle = fillStyle // 원의 색상
    this._canvasHeight = canvasHeight // 캔버스 높이
    this._canvasWidth = canvasWidth // 캔버스 너비

    // this.animate = this.animate.bind(this)
    // requestAnimationFrame(this.animate)
  }

  get dx() {
    if (
      this._x + this._radius > this._canvasWidth ||
      this._x - this._radius < 0
    ) {
      this._dx *= -1
    }
    return this._dx
  }

  get dy() {
    if (
      this._y + this._radius > this._canvasHeight ||
      this._y - this._radius < 0
    ) {
      this._dy *= -1
    }
    return this._dy
  }

  update() {
    this._x += this.dx
    this._y += this.dy
  }

  draw() {
    this._ctx.beginPath()
    this._ctx.fillStyle = this._fillStyle
    this._ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI)
    this._ctx.fill()
  }

  animate() {
    // this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
    this.update()
    this.draw()

    // requestAnimationFrame(this.animate)
  }
}
```

init 함수도 아래처럼 변경해줍니다.

```js
function init() {
  const $canvas = document.querySelector('#canvas1')
  const ctx = $canvas.getContext('2d')

  const colors = ['#9EBCCE', '#E84925', '#CBD8E0', '#262E31']

  let count = 300
  const particles = []

  while (count--) {
    particles.push(
      createAParticle({
        ctx,
        colors,
        canvasHeight: $canvas.height,
        canvasWidth: $canvas.width,
      })
    )
  }

  function animateParticles() {
    // 300개의 particle들이 그려진 캔버스를 한 번에 지워주기
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)
    particles.forEach(p => p.animate())
    requestAnimationFrame(animateParticles)
  }

  requestAnimationFrame(animateParticles)
}

init()
```

그러면 particles가 제각기 다른 위치에서 다른 속도로 잘 움직입니다.
![스크린샷, 2021-04-09 16-22-57](https://user-images.githubusercontent.com/47022167/114144059-df22d480-994f-11eb-974d-abc127cbc193.png)

그런데 픽셀이 심하게 깨집니다. 컴퓨터 화질 문제인가? 해서 넘어갔습니다(그 문제가 아니야!).

이제 마우스 커서가 있는 위치에서 일정 반경으로 particle이 커지는 효과를 만듭니다.

그전에 particle들을 생성하고 마우스 커서와 충돌했는지 제어하는 코드를 한 곳에 모으기 위해 ParticleController 클래스를 생성합니다.

```js
class ParticleController {
  constructor({ ctx, $canvas, colors, count }) {
    this._ctx = ctx
    this._canvasHeight = $canvas.height
    this._canvasWidth = $canvas.width
    this._colors = colors
    this._count = count
    this._createAParticle = this._createAParticle.bind(this)
    this._particles = this._createParticles()
    this._animate = this._animate.bind(this)
    // 인스턴스를 생성하자마자 애니메이션을 실행시킵니다
    requestAnimationFrame(this._animate)
  }

  _createAParticle() {
    const radius = Math.floor(Math.random() * 3)
    const diameter = radius * 2
    const x = Math.random() * (this._canvasWidth - diameter) + diameter
    const y = Math.random() * (this._canvasHeight - diameter) + diameter
    const dx = Math.random() * 1 - 0.5
    const dy = Math.random() * 1 - 0.5
    const color = this._colors[Math.floor(Math.random() * this._colors.length)]

    return new Particle({
      x,
      y,
      dx,
      dy,
      radius,
      fillStyle: color,
      ctx: this._ctx,
      canvasHeight: this._canvasHeight,
      canvasWidth: this._canvasWidth,
    })
  }

  _createParticles() {
    // while문 대신 배열 메서드 파이프라인으로 리팩토링합니다
    return new Array(this._count).fill().map(this._createAParticle)
  }

  _clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
  }

  _animate() {
    this._clearCanvas()
    this._particles.forEach(p => p.animate())
    requestAnimationFrame(this._animate)
  }

  checkCollisions(mouse) {
    // 마우스 커서 위치 충돌 체크할 코드 작성
  }
}
```

init 함수에서 window객체에 `mousemove` 이벤트 리스너로 마우스 위치값을 받아 ParticleController의 `checkCollisions` 메서드 인자로 넘겨줍니다.

```js

function init() {
  const $canvas = document.querySelector("#canvas1");
  const ctx = $canvas.getContext("2d");

  const colors = ["#9EBCCE", "#E84925", "#CBD8E0", "#262E31"];
  let particleController = new ParticleController({
    ctx,
    $canvas,
    colors,
    count: 300,
  });

  window.addEventListener("mousemove", (e) => {
    particleController.checkCollisions({
      x: e.x,
      y: e.y,
    });
  });

```

`mousemove` 콜백 함수가 호출 될 때 마다 모든 particle들이 mouse 커서의 일정 반경에 들어왔는지 확인해줘야 합니다. 각 particle이 자신이 mouse 커서의 일정 반경에 들어왔는지 확인하도록 하고 ParticleController에서 particle들을 차례대로 순회하면서 이 과정을 진행하도록 합니다.

Particle 클래스에 충돌여부를 저장할 collided 속성과 `checkCollision`메서드를 추가합니다.

```js
class Particle {
  /* 이전 코드 생략 */

  get radius() {
    return this._radius
  }

  set radius(number) {
    // 반지름이 무한대로 커지거나 작아지지 않도록 예외처리합니다.
    if (number > 20 || number < this._initRadius) return
    this._radius = number
  }

  update() {
    this._x += this.dx
    this._y += this.dy

    // 충돌되면 반지름 크기를 늘리고 아니면 반지름 크기를 줄입니다.
    if (this._collided) {
      this.radius += 1
    } else {
      this.radius -= 1
    }
  }

  // 자신의 중심이 마우스 커서 반경(25) 사이에 존재하는 지 확인합니다.
  checkCollision(mouse) {
    this._collided =
      mouse.x - this._x < 25 &&
      mouse.x - this._x > -25 &&
      mouse.y - this._y < 25 &&
      mouse.y - this._y > -25
  }
}
```

ParticleController에서 `checkCollisions` 메서드를 구현합니다.

```js
class ParticleController {
  /* 이전 코드 생략*/

  checkCollisions(mouse) {
    this._particles.forEach(p => {
      p.checkCollision(mouse)
    })
  }
}
```

되긴 되는데 마우스 커서 위치와 너무 떨어져있습니다.🤪

![스크린샷, 2021-04-09 16-52-07](https://user-images.githubusercontent.com/47022167/114147721-f4016700-9953-11eb-9f54-36b075a4388a.png)

알고보니 canvas 속성을 지정하지 않았을 때 디폴트 값이 적용된 상태에서 css로 크기를 늘렸던 거였습니다. [MDN](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API/Tutorial/Basic_usage) 에서도 css 크기 지정이 초기 비율을 고려하지 않을 때 왜곡된다고 합니다. 🧐

canvas 속성으로 width, height 을 명시적으로 지정하니 픽셀 깨지는 현상과 마우스 위치 어긋나는 현상이 사라졌습니다.

```html
<body>
  <canvas id="canvas1" width="500" height="300"></canvas>
  <script src="index.js"></script>
</body>
```

혹은 javascript 상에서 canvas 크기를 직접 지정할 수도 있습니다.

```js
function init() {
  const $canvas = document.querySelector('#canvas1')
  const ctx = $canvas.getContext('2d')

  // canvas 크기를 window 사이즈 크기에 맞게 만들어 주고 싶을 때 javascript를 사용합니다.
  // 태그 속성으로는 %, vw,vh와 같은 단위를 사용할 수 없기 때문입니다.
  $canvas.setAttribute('width', window.innerWidth)
  $canvas.setAttribute('height', window.innerHeight)

  const colors = ['#9EBCCE', '#E84925', '#CBD8E0', '#262E31']
  let particleController = new ParticleController({
    ctx,
    $canvas,
    colors,
    count: 300,
  })

  window.addEventListener('mousemove', e => {
    particleController.checkCollisions({
      x: e.x,
      y: e.y,
    })
  })
}
```

전체 코드는 아래와 같습니다.

```js
class Particle {
  constructor({
    x,
    y,
    dx,
    dy,
    radius,
    fillStyle,
    ctx,
    canvasHeight,
    canvasWidth,
  }) {
    this._x = x
    this._y = y
    this._initRadius = radius
    this._radius = radius
    this._dx = dx
    this._dy = dy
    this._ctx = ctx
    this._fillStyle = fillStyle
    this._canvasHeight = canvasHeight
    this._canvasWidth = canvasWidth
    this._collided = false
  }

  get radius() {
    return this._radius
  }

  set radius(number) {
    if (number > 20 || number < this._initRadius) return
    this._radius = number
  }

  get dx() {
    if (
      this._x + this._radius > this._canvasWidth ||
      this._x - this._radius < 0
    ) {
      this._dx *= -1
    }
    return this._dx
  }

  get dy() {
    if (
      this._y + this._radius > this._canvasHeight ||
      this._y - this._radius < 0
    ) {
      this._dy *= -1
    }
    return this._dy
  }

  update() {
    this._x += this.dx
    this._y += this.dy

    if (this._collided) {
      this.radius += 1
    } else {
      this.radius -= 1
    }
  }

  draw() {
    this._ctx.beginPath()
    this._ctx.fillStyle = this._fillStyle
    this._ctx.arc(this._x, this._y, this.radius, 0, 2 * Math.PI)
    this._ctx.fill()
  }

  animate() {
    this.update()
    this.draw()
  }

  checkCollision(mouse) {
    this._collided =
      mouse.x - this._x < 25 &&
      mouse.x - this._x > -25 &&
      mouse.y - this._y < 25 &&
      mouse.y - this._y > -25
  }
}

class ParticleController {
  constructor({ ctx, $canvas, colors, count }) {
    this._ctx = ctx
    this._canvasHeight = $canvas.height
    this._canvasWidth = $canvas.width
    this._colors = colors
    this._count = count
    this._createAParticle = this._createAParticle.bind(this)
    this._particles = this._createParticles()
    this._animate = this._animate.bind(this)

    requestAnimationFrame(this._animate)
  }

  _createAParticle() {
    const radius = Math.floor(Math.random() * 3)
    const diameter = radius * 2
    const x = Math.random() * (this._canvasWidth - diameter) + diameter
    const y = Math.random() * (this._canvasHeight - diameter) + diameter
    const dx = Math.random() * 1 - 0.5
    const dy = Math.random() * 1 - 0.5
    const color = this._colors[Math.floor(Math.random() * this._colors.length)]

    return new Particle({
      x,
      y,
      dx,
      dy,
      radius,
      fillStyle: color,
      ctx: this._ctx,
      canvasHeight: this._canvasHeight,
      canvasWidth: this._canvasWidth,
    })
  }

  _createParticles() {
    return new Array(this._count).fill().map(this._createAParticle)
  }

  _clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
  }

  _animate() {
    this._clearCanvas()
    this._particles.forEach(p => p.animate())
    requestAnimationFrame(this._animate)
  }

  checkCollisions(mouse) {
    this._particles.forEach(p => {
      p.checkCollision(mouse)
    })
  }
}

function init() {
  const $canvas = document.querySelector('#canvas1')
  const ctx = $canvas.getContext('2d')
  $canvas.setAttribute('width', window.innerWidth)
  $canvas.setAttribute('height', window.innerHeight)

  const colors = ['#9EBCCE', '#E84925', '#CBD8E0', '#262E31']
  let particleController = new ParticleController({
    ctx,
    $canvas,
    colors,
    count: 300,
  })

  window.addEventListener('mousemove', e => {
    particleController.checkCollisions({
      x: e.x,
      y: e.y,
    })
  })
}

init()
```

### 참고 사이트

[Interacting with The Canvas | HTML5 Canvas Tutorial for Beginners - Ep. 4](https://youtu.be/vxljFhP2krI)
