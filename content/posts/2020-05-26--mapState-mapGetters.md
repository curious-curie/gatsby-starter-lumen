---
title: Vuex, mapState vs. mapGetters
date: "2020-05-26T22:40:32.169Z"
template: "post"
draft: false
slug: "vuex-mapState-mapGetters"
category: "FRONTEND"
tags:
  - "Javascript"
  - "Vue"
  - "Web Development"
description: "getters @ vuex store
- store의 computed property라고 생각하면 된다.
- component와 Vuex action에서 접근이 쉽고,
- 데이터를 캐싱하고 state가 바뀔 때 업데이트 된다 
- function을 리턴 가능 => 추가적인 argument를 패스할 수 있다
..."
socialImage: ""
---
## Vuex, mapState vs. mapGetters

이 주제 입사한 지 한 1-2주 됐을 때 (파릇파릇) 치호님이랑 찾아본 주제였는데 미루고 미루다가 이제야 정리해본다… ^^ 
이 블로그는 사실 규리의 일기장...

### getters @ vuex store

- store의 computed property라고 생각하면 된다.
- component와 Vuex action에서 접근이 쉽고,
- 데이터를 캐싱하고 state가 바뀔 때 업데이트 된다 
- function을 리턴 가능 => 추가적인 argument를 패스할 수 있다

mapGetters는 store 의 getter를 local computed properties로 쉽게 매핑해주는 좋은 친구다. 

편리한 getters지만, 과도하게 사용하는 건 좋지 않다고 한다. 특히 state에서 바로 접근할 수 있는 속성을 getters를 통해 한번 더 선언하는 건 불필요하다. 

```javascript
getters: {
	currentProduct: state => state.currentProduct
}
```

### mapState가 있잖아!

mapState helper는 computed getter function을 알아서 만들어준다. 간단한 getters를 만들어서 컴포넌트의 computed property로 연결해준다. 추가적인 가공이나 속성에 접근할 필요가 없다면 getter를 선언할 필요 없이 mapState를 통해 state를 바로 접근하여 알아서 가져올 수 있게 하는게 편리하다.

```javascript
computed : {
	...mapState(['auth', 'currentUser'])
}
```

### getters는 언제 쓸까? 

computed 속성을 vuex에서 써야할 필요가 있을 때 갖다 쓰면 된다!고 생각하면 편리할 것이다. store 안에 calculated된 데이터 자체를 저장할 수도 있지만, 그 데이터의 출처가 store에서 나온다면 데이터가 바뀔 때 마다 싱크를 맞추는게 번거롭게 느껴지거나 싱크가 안 맞게 될 가능성도 무시하지 못한다. 

이럴 때 getters를 쓰면 아주 간단해진다.

```javascript
state: {
	users: [
		{ id: 1, name: 'kate', isActive: true },
		{ id: 2, name: 'Tom', isActive: false }
	],
},
getters: {
	activeUsers: state => return state.users.filter((user) => user.isActive)
}
```

요로코롬 computed 처럼 getters를 정의해준다. 이렇게 하면 users가 업데이트될 때마다 activeUsers도 똑똑하게 업데이트된다. 

더 똑똑한 건 이 친구는 캐싱을 해서 참조하고 있는 state가 업데이트 되지 않으면 다시 계산되지 않고 자기 값을 가지고 있는다. 

필자의 경우 

```javascript
export const getters = {
  hasNextPage: state => !!state.nextPageUrl, // 1)
  appliedFilters: state => [
  	...state.appliedLocationFilters,
  	...state.appliedCategoryFilters,
  ] // 2)
}
```

1번처럼 state에 접근하여 원래 속성과 다른 type의 데이터를 반환하거나 (보통 boolean)

2번처럼 데이터를 합치는 등의 (혹은 분리하거나 필터링하는)  추가적인 가공이 필요한 경우에 아주 잘 애용하고 있다. 

물론 이런 작업들을 store 내에서가 아니라 컴포넌트단에서 할 수 있지만, store 안에서 하는 것이 재사용성의 측면에서 더 나은 것 같다. 컴포넌트에서 다시 로직을 정의할 필요 없이 가져다 쓰면 되니깐 ~~ 

Vue.js를 쓰면 쓸 수록 맵핑헬퍼들에게 고마움을 많이 느낀다. 이런 똑똑한 친구들이 있어 코딩 라이프가 훨씬 풍요로워진다. ㅎㅎ (진심이다~)


Curie Yoo 