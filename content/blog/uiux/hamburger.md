---
title: hamburger
date: 2021-03-17 20:03:08
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<div style="text-align:center">
<img src="https://user-images.githubusercontent.com/47022167/111463615-1fcd6a80-8763-11eb-86e1-d480d161b2d3.gif" alt="hamburger animation" >
</div>

햄버거 메뉴 UI 위를 마우스로 hover하면 'X' 모양으로 바뀌는 애니메이션을 따라 만들어보았습니다.

가운데 bar는 좌측으로 이동하면서 사라지고 맨 위와 아래 bar는 크로스시켰습니다.

크로스시킬 때 곧바로 rotate 시키면 길이가 짧아 다소 어정쩡한 크로스가 됩니다. 그래서 width 크기를 늘리니 bar 들이 회전 위치가 어긋나버립니다. 이때 회전 중심을 잡는 속성이 `transform-origin`입니다. 회전 중심(x,y) 값을 지정할 때 x는 bar의 height의 절반값을 주어 중앙에 위치시키고 y는 width가 늘어난 만큼의 값을 잡아 툭 튀어나온 bar를 다시 원래 자리로 돌려보냈습니다.

아래는 전체 소스코드입니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SVG Animation</title>
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .wrap {
        background-color: teal;
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hamburger {
        width: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .hamburger-bar {
        width: 50px;
        height: 10px;
        margin-bottom: 10px;
        border-radius: 10px;
        background-color: white;
      }

      .hamburger-bar:not(:nth-of-type(2)) {
        transition: 0.1s linear;
      }

      .hamburger-bar:nth-of-type(2) {
        transition: 0.1s ease-out;
      }

      .hamburger:hover .hamburger-bar:nth-of-type(2) {
        transform: translateX(-25px);
        opacity: 0;
      }

      .hamburger:hover .hamburger-bar:first-of-type {
        transform: rotate(40deg);
        transform-origin: 5px 15px;
        width: 65px;
      }

      .hamburger:hover .hamburger-bar:last-of-type {
        transform: rotate(-40deg);
        transform-origin: 5px -5px;
        width: 65px;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="hamburger">
        <div class="hamburger-bar"></div>
        <div class="hamburger-bar"></div>
        <div class="hamburger-bar"></div>
      </div>
    </div>
  </body>
</html>
```
