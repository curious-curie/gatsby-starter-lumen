---
title: Using Storybook.js with Vue
date: "2020-03-01T22:40:32.169Z"
template: "post"
draft: false
slug: "storybook-components"
category: "FRONTEND"
tags:
  - "Storybook"
  - "Vue"
  - "Web Development"
description: "컴포넌트를 도큐먼트화하고 전체 프로젝트와는 독립적으로 개발할 수 있도록 하는 컴포넌트 개발 도구이다. 컴포넌트 라이브러리를 구축하여 다양한 상태, 형태의 컴포넌트를 브라우즈하거나 개발, 테스트해볼 수 있다. "
socialImage: ""
---
# Developing Components w/ Storybook

### Storybook

컴포넌트를 도큐먼트화하고 전체 프로젝트와는 독립적으로 개발할 수 있도록 하는 컴포넌트 개발 도구이다. 컴포넌트 라이브러리를 구축하여 다양한 상태, 형태의 컴포넌트를 브라우즈하거나 개발, 테스트해볼 수 있다. 

컨텐츠 업로더를 리팩토링하면서 도입하게 되었는데, 컴포넌트 개발 및 테스팅을 위해 컴포넌트가 위치해야 할 페이지나 테스트용으로 만들어놓은 페이지 안에 import해서 가져다 쓰고, 더미데이터를 바꾸어가면서 여러번 테스트 하지 않아도 되는 것. 그렇게 하지 않아도 컴포넌트 단위로 개별적으로 개발과 테스팅이 가능하다는 점이 개발하면서 와닿는 가장 큰 장점인 것 같다. 컴포넌트의 개발과 테스트 과정에서 편리함과 효율성을 배가시켜주는 듯. 각각의 컴포넌트를 Story에 load(등록)하기 위해 추가적은 코드를 써야하는 (당연한) 부담이 있기에 모든 컴포넌트를 storybook을 통해 관리/개발하는 건 굉장히 번거롭겠지만, 여러가지 형태로 자주 사용될 컴포넌트라면 실보단 득이 클 듯하다. (테스트 코드 짜는 것 보단 훨씬 등록이 간편ㅋㅋㅋㅋ)

### 실제 프로젝트에 도입해보기

1) @storybook/vue 설치

```
npm install --save-dev @storybook/vue
```

2) .storybook 디렉토리에 설정파일들 추가

```js
import { configure } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins

// Import your custom components.
import Mybutton from '../src/stories/Button.vue';

// Install Vue plugins.
Vue.use(Vuex);

// Register custom components.

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);
```

scss를 못 알아먹길래 loader도 추가했다.

```javascript
//.storybook/main.js
const path = require('path');

module.exports = {
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
};
```

3) scripts에 storybook 추가

```js
"scripts": {
  ...
  "storybook": "start-storybook -p 6006",
  "build-storybook": "build-storybook"
},
```

Curie Yoo