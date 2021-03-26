---
title: flow text
date: 2021-03-26 14:03:61
category: uiux
thumbnail: { thumbnailSrc }
draft: false
---

<div style="text-align:center;">
    <img src="https://user-images.githubusercontent.com/47022167/112586853-e0c4a680-8e3f-11eb-81a1-65c6b1d4a07b.gif" alt="flow text">
</div>

텍스트가 이미지 위로 흐를 때 투명 컬러에 보더만 있게 변하는 애니메이션을 따라 만들었습니다. 이번 거는 도저히 혼자서 생각해내기 어려워 모범 답안을 먼저 보고 힌트를 얻었습니다.

핵심은 똑같은 문장 태그를 두 개를 사용해서 착시효과를 주는 것입니다.

아래 그림처럼 이미지이 배경보다 앞으로 오도록 `z-index`값을 달리 줍니다. 웹페이지는 평면 즉, 2D 공간이기 때문에 `z-index` 값을 주더라도 같은 선상에 있는 것처럼 보입니다.
![스크린샷, 2021-03-26 15-06-47](https://user-images.githubusercontent.com/47022167/112589697-e96bab80-8e44-11eb-8b82-fd9e334e608e.png)

그 다음 배경과 같은 `z-index`에 흰색 문장 태그를 두고 같은 높이에 이미지보다 큰`z-index`를 가진 투명 문장 태그를 둡니다. 텍스트에 border는 `-webkit-text-stroke`속성을 이용했습니다.

좌측으로 이동하는 애니메이션을 두 문장 태그가 동시에 실행하면 마치 특정구간에는 투명으로 변하는 착시를 일으키게 됩니다.

### 참고 자료

[Landing Page Design, Mouse scroll slider, Infinite text scrolling, Sidebar menu HTML, CSS & JQUERY](https://youtu.be/ezunNVYPJDs)
