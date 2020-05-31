---
title: "[Javascript] Event Bubbling과의 만남"
date: "2020-05-21T22:40:32.169Z"
template: "post"
draft: false
slug: "event-bubbling"
category: "FRONTEND"
tags:
  - "Javascript"
  - "Frontend"
  - "Web Development"
description: "프로필 사진 업로드 기능을 구현하던 중 이벤트 버블링을 직접 만나게 되었다!
반가운 마음에 글로 정리해본다. 
..."
socialImage: ""
---
프로필 사진 업로드 기능을 구현하던 중 이벤트 버블링을 직접 만나게 되었다!

반가운 마음에 글로 정리해본다. 

사진 업로드 시 외부 library를 썼기 때문에 커스터마이징 할 수 있는 옵션이 제한되어있었다.

안드로이드에서 카메라, 갤러리 통해 사진을 받으려면 Input 의 accept attribute에 'image/*'를 추가해야 했는데, 파일 업로드 박스가 사진을 업로드하면 사라졌다가 지우면 다시 나타나는 구조라 (v-if 써서) mounted()단계에서 setAttribute 한 것이 날라가버렸다. 

그래서 파일 업로드 박스에 click eventlistener를 달아서 클릭 시마다 attribute를 추가하도록 했다.

```jsx
mounted () {
    this.fileClickArea = document.querySelector('.vicp-drop-area')
    this.fileInput = document.querySelector('input[type="file"]')
    this.fileClickArea.addEventListener('click', this.setInputFileType)
  },
```

setInputFileType 함수에 콘솔 로그를 넣어보니, 한 번 클릭할 때 마다 함수가 두번 fire 되는 걸 알 수 있었다.

```html
<div class="vicp-step1">
	<span class="vicp-hint">파일을 업로드하세요.</span>
	<input type="file">
</div>
```

간략화하면 이런 구조인데, 발생한 event를 보면:

```json
isTrusted: false
path: (13) [input, div.vicp-drop-area, div.vicp-step1, div.vicp-wrap, div.vue-image-crop-up...
srcElement: input
target: input
timeStamp: 91021.18499999051
toElement: input
type: "click"
```

```json
isTrusted: true
path: (12) [div.vicp-drop-area, div.vicp-step1,...
srcElement: div.vicp-drop-area
target: div.vicp-drop-area
timeStamp: 282203.10499999323
toElement: div.vicp-drop-area
type: "click"
```

이렇게 자식-부모 element에서 모두 이벤트가 발생! 함을 알 수 있었다 

### Event Bubbling

이벤트가 더 상위 화면 요소들로 전달되어가는 것 

```jsx
<body>
	<div class="one">
		<div class="two">
			<div class="three">
			</div>
		</div>
	</div>
</body>
```

```jsx
var divs = document.querySelectorAll('div');
divs.forEach(function(div) {
	div.addEventListener('click', logEvent);
});

function logEvent(event) {
	console.log(event.currentTarget.className);
}
```

three를 클릭할 경우, three에서 발생한 이벤트가 two → one 을 거쳐 최상위 요소인 body까지 전달되는 것 

굉장히 많이 보셨을 예제 ^ㅡ^ 

### 해결 방법?

1) StopPropagation()

보통의 해결책은 stopPropagation() 을 사용하여 해결하라고 한다. 

event 발생 시 호출하는 function 첫 줄에 e.stopPropagation()을 써서! 

그런데 내 코드에서 작동하지 않았다. 그 이유는 아직도 못 찾았다. 

- 참고: preventDefault는 브라우저의 default 액션만 막는다. bubbling으로 인한 액션은 막지 못할 가능성이 크다.

2) 나의 경우: isTrusted 사용하여 해결 

isTrusted is true for events that come from real user actions and false for script-generated events.

isTrusted를 사용해서 이 이벤트가 js로 인해 발생한건지, 실제 사용자의 행위로 인해 발생한 건지 체크해서 액션을 달리했다. 

즉, event.isTrusted가 false면 setAttribute를 실행하지 않았다 

근데 이 방법이 정석적이거나 흔한 방법은 아닌 것 같다.

isTrusted를 체크한 후 e.stopPropagation()을 사용하거나 하는 식으로 이벤트 버블링을 방지하지, 필자처럼 isTrusted가 아니면 return하는 식으로 직접 제어하는 방식은 잘 찾아보기 힘들었다. 

아무래도 이 문제 상황이 표준적인 이벤트 버블링이랑 같지는 않은 것 같다는 생각이 든다. @click 바인딩 문제거나 (결국 이벤트버블링이랑 같은 맥락이긴 함) 

### Event Capture

버블링과 반대 방향으로 진행되는 이벤트 전파

상위 요소에서 이벤트 발생지점을 찾아내려가는 것입니다. (부모노드에서 자식노드로!) 

capturing 옵션을 통해 구현할 수 있고, 여러 요소가 한 번의 클릭에 모두 반응하도록 하고 싶을 때 사용하면 된다.

useCapture의 default 값이 false이기 때문에 보통 bubbling 방식으로 이벤트가 전파되는 것, true로 설정하면 캡처링을 통해 이벤트가 전파된다. 

```jsx
[element].addEventListener(event, function, useCapture);

```

Curie Yoo