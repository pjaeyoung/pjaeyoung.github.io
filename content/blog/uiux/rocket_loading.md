---
title: rocket_loading
date: 2021-03-21 17:03:44
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<div style="text-align:center;">
<img src="https://user-images.githubusercontent.com/47022167/111900123-033b7600-8a74-11eb-91ce-cf8d34001243.gif" alt="rocket"/>
</div>

로켓이 원을 그리고 돌면서 연기를 내뿜는 로딩 ui를 따라 만들었습니다.

처음에 로켓을 원 모양으로 도는 애니메이션을 작업했습니다. 로켓 방향이 원의 둘레 위치마다 변경을 시키는 방법이 너무 어렵고 복잡해서 꼼수를 생각했습니다. 로켓은 가만히 두고 로켓을 감싸는 부모 태그를 360도로 돌려 마치 로켓이 움직이는 것처럼 보이게 했습니다.

![스크린샷, 2021-03-21 19-10-07](https://user-images.githubusercontent.com/47022167/111901075-287eb300-8a79-11eb-8e6a-2a64e8f7d246.png)![스크린샷, 2021-03-21 19-10-34](https://user-images.githubusercontent.com/47022167/111901077-29afe000-8a79-11eb-87c7-e9010e6aa273.png)

로켓 회전은 생각보다 쉬웠지만 연기가 나오면서 크기가 커졌다 작아지면서 사라지는 효과를 구현할 때는 노가다가 필요했습니다. 적당히 연기(원모양)를 표현할 div 태그들을 생성합니다.

```html
<div class="smoke_arr">
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
  <div class="smoke"></div>
</div>
```

각각의 연기들의 position을 absolute로 두고 top, left를 눈대중으로 맞춰서 작업했습니다. (정말 비효율적이군요!)

```css
.smoke {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: white;
  transform: scale(0);
  animation: smoke_scale 2.5s infinite forwards;
  animation-play-state: running;
}

.smoke:nth-of-type(1) {
  top: 2px;
  left: 15px;
  animation-delay: 0.1s;
}

.smoke:nth-of-type(2) {
  top: 18px;
  left: 0px;
}

.smoke:nth-of-type(3) {
  top: 35px;
  left: -5px;
  animation-delay: 2.5s;
}

/* 줄임 */

.smoke:nth-of-type(13) {
  top: -6px;
  left: 30px;
  animation-delay: 0.2s;
}

.smoke:nth-of-type(14) {
  top: -6px;
  left: 50px;
  animation-delay: 0.3s;
}
```

눈대중이다보니 자세히 보면 원 생성 속도가 제각각이고 조금 찌그러진 원으로 연기들이 나열되어있습니다. 😅

모범 답안은 제가 했던 것보다 훨씬 간단하고 정확한 위치로 배치하여 만들었습니다. html에서 태그를 생성하면서 동시에 style로 `--i`값을 지정합니다. `--i` 를 보니 뭔가 떠오르는 것이 없나요? 네, css에서 변수를 지정할 때 규칙과 유사합니다.

```css
:root {
  --bg-color: blue;
}
```

**html에서 style을 인라인으로 처리할 때도 사용자 지정 변수를 사용할 수 있다는 사실은 처음 알았습니다.** `nth-of-type`과 같은 가상클래스를 매번 작성했던 저의 경우와 달리 `--i`와 `var함수`, `calc함수`를 사용하면 단 한 번만 작성하면 돼서 수고로움이 줄어듭니다.

```css
.smoke {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(calc(18deg * var(--i))); // 360도/(20개의 연기) = 18도
}
```

모범답안은 이 연기 태그에도 로켓처럼 실제 원모양은 가만히 두고 상위 태그만 움직여서 360도로 배치했습니다. 저와 달리 `::before`를 사용했습니다.

```css
.smoke::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  transform: scale(0);
  animation: blink 2s linear infinite;
  animation-delay: calc(0.1s * var(--i));
}
```

원리를 차근차근 설명하자면 이렇습니다.

1. .smoke_wrapper의 postion을 relative로 지정한 후 모든 .smoke의 position은 absolute, 높이와 넓이는 100%로 맞춘다.
   ![스크린샷, 2021-03-21 19-48-02](https://user-images.githubusercontent.com/47022167/111901983-6df1af00-8a7e-11eb-9196-5c23eb2c8135.png)

2. .smoke의 ::before 의사클래스에 연기로 표현할 css를 작성한다. 이것도 역시 absolute로 position을 잡는다. 여기까지는 좌측 최상단에 연기를 표시한 모든 .smoke 들이 겹쳐져있는 상태다.

![스크린샷, 2021-03-21 19-48-07](https://user-images.githubusercontent.com/47022167/111901985-6f22dc00-8a7e-11eb-9a65-342b12f22e56.png)

3. 20개를 360도로 배치하기 위해 .smoke를 - 연기를 나타내는 .smoke::before가 아님을 주의하라 - 각각 18도로 회전시키면 같은 간격으로 원처럼 둥글게 배치된다.
   ![스크린샷, 2021-03-21 19-48-13](https://user-images.githubusercontent.com/47022167/111901986-6fbb7280-8a7e-11eb-9651-9ea213e97552.png)

추가로 ubuntu의 무료 gif 툴인 peek를 사용해 만든 gif가 웹에 업로드하면 너무 느리길래 [ezgif](https://ezgif.com/) 온라인 툴로 속도를 조절했습니다. 혹시 저와 같은 현상을 겪고 있다면 이 사이트를 사용해볼 것을 추천합니다:)

### 참고 사이트

[Pure CSS Flight Loader Animation Effects using Fontawesome icon](https://youtu.be/stYvCmQg5cs)
