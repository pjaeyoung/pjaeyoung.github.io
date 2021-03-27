---
title: 3D circle text
date: 2021-03-27 21:03:11
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<div style="text-align:center;">
<img src="https://user-images.githubusercontent.com/47022167/112720149-f620fa00-8f3f-11eb-92c7-9b2f7186aa5a.gif" alt="3d circle text"/>
</div>

인터랙티브 디벨로퍼 김종민님이 web에서 구현한 앤디워홀의 캠벨수프를 보고 3d 애니메이션에 큰 호기심이 생겼습니다. 직접 원통형 디자인을 하기엔 그림 실력이 부족했습니다. 그림 디자인 없이 오직 css로만 3d 원통형 애니메이션을 구현한 다른 사례를 보고 싶었습니다. 그러다 [유튜브](https://youtu.be/yfwD-AKRCcA)에서 도전해볼만한 예제를 올린 걸 발견하고 곧바로 따라 만들었습니다.

3d로 원통형을 어떻게 구현해야 할지 감이 하나도 오지 않았습니다. '3d animation'에 대해 구글링하다 원통형의 기본 틀에 해당하는 `3d carousel` 을 알게 되었습니다.

웹에서 3d 환경을 구현하려면 `perspective` 속성과 `z축`을 이용해야 합니다. `perspective`는 대상과 사용자 사이의 거리로 값이 작아질수록(가까울수록) 왜곡이 심해지고 커질수록(멀어질수록) 평면에 가까워집니다. 자세한 내용은 [beautifulcss.com](https://www.beautifulcss.com/archives/2270) 을 참고해주세요!

```html
<div class="scene">
  <div class="carousel">
    <!-- 24개의 셀들이 들어갈 자리  -->
  </div>
</div>
```

```css
.scene {
  width: 100px;
  height: 50px;
  position: relative;
  perspective: 1000px;
}
```

각 셀은 3d 공간 안에서, 즉 깊이감 있게 원을 그리며 돌아야 하기 때문에 셀들의 부모 태그인 `.carousel`에서 `transform-style: preserve-3d`를 속성으로 지정해줘야 합니다. `preserve-3d`는 자식 태그들을 3d 공간에 두겠다는 의미입니다.

```css
.carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  animation: rotate 5s linear forwards infinite alternate;
  -webkit-animation: rotate 10s linear forwards infinite alternate;
}
```

원래 `carousel`은 연관된 여러 개의 콘텐츠들을 일렬로 나열하고 각각 사이에 간격을 둡니다.`carousel`에서 원통형으로 보이려면 간격을 없애고 하나의 셀 크기를 작게 잡아 부드럽게 이어지도록 해야 합니다.

![스크린샷, 2021-03-27 21-44-08](https://user-images.githubusercontent.com/47022167/112721125-9299cb00-8f45-11eb-8fe1-47df4b3f278d.png)

이를 위해서는 셀 크기와 각도, 중심과 셀 간 거리, 셀 개수를 알아야 합니다. 여기서 머리 아픈 탄젠트 개념도 나옵니다.😳

머리 아픈 계산대신 감으로 해보려고 시도했으나 처참히 실패하고 계산 공식을 이해하려고 머리를 싸맸습니다.

우선 텍스트의 길이가 24이기 때문에 각 셀의 각도는 `360 / 24 = 15` 로 15도입니다.

![스크린샷, 2021-03-27 21-59-43](https://user-images.githubusercontent.com/47022167/112721549-c37aff80-8f47-11eb-993a-8b16311a3975.png)

그 다음 원하는 셀 크기를 지정합니다. 저는 54px로 지정했습니다.

![스크린샷, 2021-03-27 22-19-01](https://user-images.githubusercontent.com/47022167/112722017-74829980-8f4a-11eb-90da-ebb635518828.png)

다음으로 아래 공식을 적용하여 셀과 중심 거리를 구합니다.

> Math.round( ( cellSize / 2 ) / Math.tan( Math.PI / numberOfCells ) )

계산 결과 205가 나옵니다.

![스크린샷, 2021-03-27 22-23-10](https://user-images.githubusercontent.com/47022167/112722142-08546580-8f4b-11eb-8d05-0dd08dc8f34b.png)

정확히 떨어지는 값이 아니기 때문에 부자연스럽게 이어져있습니다.

![스크린샷, 2021-03-27 22-26-25](https://user-images.githubusercontent.com/47022167/112722217-7d279f80-8f4b-11eb-9f4f-0f63995d3281.png)

이부분은 셀의 width를 조절해줍니다. 56도로 하니 부드럽게 이어집니다.

![스크린샷, 2021-03-27 22-28-38](https://user-images.githubusercontent.com/47022167/112722267-d7286500-8f4b-11eb-9607-36a665301d1e.png)

아래는 위 내용을 css로 작성한 코드입니다.

```css
.carousel__cell {
  position: absolute;
  width: 56px; /* 셀 크기 */
  height: 120px;
  background-color: white;
  border-top: 5px solid var(--sub-color);
  border-bottom: 5px solid var(--sub-color);
  transform: rotateY(calc(var(--i) * 15deg)) translateZ(205px);
  /* 셀 각도를 15도로 지정하고 셀과 중심 거리를 205px로 지정 */
}

.carousel__cell:before {
  content: attr(data-text);
  width: 100%;
  height: 100%;
  position: absolute;
  color: black;
  font-size: 2rem;
  font-weight: bolder;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 참고 사이트

[Circle Text Animation using CSS & Splitting.js | CSS Text Effects](https://youtu.be/yfwD-AKRCcA) <br>
[3dtransforms.desandro.com](https://3dtransforms.desandro.com/carousel)
