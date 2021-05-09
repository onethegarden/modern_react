# ⚛Modern-React

>벨로퍼트와 함께하는 모던리액트를 보고 
>
>리액트를 꼼꼼하게 정리해보자 😣😤

<p style="font-size:10px">출처 : https://react.vlpt.us/</p>

<br/><br/><br/>

## contents

- [Hook](#hook)

- [Context API](#context-api)

- [Immer를 사용한 불변성 관리](#immer를-사용한-불변성-관리)

- [클래스형 컴포넌트](클래스형-컴포넌트)

- [에러처리(ComponentDidCatch, Sentry)](#componentdidcatch-로-에러-처리하기-sentry)

- [Redux](#redux)

- [redux-middleware](#redux-middleware)

- [CORS 와 Webpack DevServer Proxy](#CORS-와-Webpack-DevServer-Proxy)

- [리액트와 타입스크립트](#리액트와_타입스크립트)

- [타입스크립트로 리액트 상태관리](#타입스크립트로-리액트-상태관리)

- [typesafe-actions 리팩토링](#typesafe-actions-리팩토링)

  

<br/><br/><br/>

## Hook

<br/>

#### - useRef

- 컴포넌트에서 특정 DOM을 선택해야 할 때 사용

  ```react
  function InputSample() {
      const nameInput = useRef();
  
      const onReset = () => {
          nameInput.current.focus();
        };
      return (
      <div>
        <input
          name="name"
          placeholder="이름"
          ref={nameInput}
        />
      </div>
    );
  }
  ```



- 컴포넌트 안에서 조회 및 수정할 수 있는 변수를 관리(`useRef` 로 관리하는 변수는 값이 바뀐다고 해서 컴포넌트가 리렌더링되지 않음)

  -  useRef를 사용 할 때 파라미터를 넣어주면, 이 값이 `.current` 값의 기본값이 됨.

  ```react
  const nextId = useRef(4);
    const onCreate = () => {
      nextId.current += 1;
    };
    return <UserList users={users} />;
  }
  ```

  

<br/><br/><br/>

#### - useEffect

>1. 컴포넌트가 마운트 됐을 때 (처음 나타났을 때)
>
>2. 언마운트 됐을 때 (사라질 때)
>
>3. 업데이트 될 때 (특정 props가 바뀔 때) **특정 작업을 처리하는 Hook**

- ```useEffect(함수, 의존배열(deps))``` : ```useEffect```의 첫 번째 파라미터에는 함수, 두 번째 파라미터에는 의존값이 들어있는 배열(deps) 를 넣는다. 

- 코드

  ```react
   useEffect(() => {
      console.log("컴포넌트가 화면에 나타남");
      return () => {
        console.log("컴포넌트가 화면에서 사라짐"); //cleanup함수
      };
    }, []);
  ```

- 콘솔 화면

![image](https://user-images.githubusercontent.com/51187540/112601602-fe046f80-8e55-11eb-9e43-c9fb515909a1.png)

컴포넌트 세 개가 마운트 될 때 ```컴포넌트가 화면에 나타남```이 출력되고 

```삭제 ``` 버튼을 눌렀을 때 ```컴포넌트가 화면에서 사라짐```이 출력된다.

<br/><br/><br/>

#### - useMemo

- 이전에 <u>계산한 값을 재사용</u> 
- ```useMemo(연산정의, deps배열)``` : deps가 바뀌었다면 바뀐 값을 적용, 아니라면 이전 값을 적용

```react
//기존
const count = countActiveUsers(users);
  //위처럼 사용하면 다른 값이 변경될 때도 컴포넌트가 리렌더링 됨

//useMemo
const count = useMemo(() => countActiveUsers(users), [users]);
  //useMemo(연산정의, deps배열)
  //deps가 바뀌었다면 바뀐 값을 적용, 아니라면 이전 값을 적용
```

<br/><br/><br/>

#### - useCallback

- <u>특정 함수</u>를 새로 만들지 않고 <u>재사용</u> 하고 싶을 때 사용
- 주의할점 : 함수 안에서 사용하는 상태, 혹은 props가 있다면 꼭, ```deps```배열 안에 포함시켜야 한다. 만약 넣지 않으면 함수 내에서 해당 값들을 참조할 때 가장 최신 값이라고 보장할 수 없다.

```react
//기존
const onRemove = id => {
  setUsers(users.filter(user => user.id !== id));
};


//useCallback 사용
const onRemove = useCallback(
    id => {
      setUsers(users.filter(user => user.id !== id));
    },
    [users]
  );
```

- useCallback은 useMemo를 기반으로 만들어졌다. ↓ useMemo로 사용방법

  ```react
  const onRemove = useMemo(
    () => () => {
      /* ... */
    },
    [users]
  );
  ```


<br/><br/><br/>

#### - React.memo

-  컴포넌트의 props 가 바뀌지 않으면 리렌더링을 방지하여 컴포넌트의 리렌더링 성능 최적화

- 렌더링 최적화 하지 않을 컴포넌트에 React.memo 를 사용하는것은, 불필요한 props 비교만 하는 것이기 때문에 실제로 렌더링을 방지할수있는 상황이 있는 경우에만 사용해야 한다.

- 감싸주는 방법으로 사용이 가능하다.

  ```react
  import React from 'react';
  
  const CreateUser = ({ username, email, onChange, onCreate }) => {
    return (
      <div>
        <input
          name="username"
          placeholder="계정명"
        />
        <button onClick={onCreate}>등록</button>
      </div>
    );
  };
  
  export default React.memo(CreateUser);
  ```

- ```deps```에 ```users```가 들어있으면 배열이 바뀔 때마다 함수가 새로 만들어진다. 이걸 최적화 하려면 ```deps```에서 ```users```를 지우고 현재 ```useState```로 관리하는 ```users```참조하지 않게 한다.  => <u>함수형 업데이트 사용</u>

  ```react
  // 기존
  const onRemove = useCallback(
    id => {
      setUsers(users.filter(user => user.id !== id));
    },
    [users]
  );
  
  //최적화 
  //deps에 users 지우고, 함수형 업데이트 사용
  const onRemove = useCallback(id => {
      setUsers(users => users.filter(user => user.id !== id));
  }, []);
  ```

  

<br/><br/><br/>

#### - useReducer

- 컴포넌트의 상태 업데이트 로직을 컴포넌트에서 분리시킬 수 있음.

- 객체를 파라미터로 받아와서 새로운 상태를 반환해주는 함수

  ```javascript
  //리듀서
  function reducer(state, action) {
    // 새로운 상태를 만드는 로직
    // const nextState = ...
    return nextState;
  }
  ```

- useReducer의 사용법

  ```javascript
  const [state, dispatch] = useReducer(reducer, initialState);
  ```

  - state : 컴포넌트에서 사용 할 수 있는 상태
  - dispatch : 액션을 발생시키는 함수 ```dispatch({ type: 'INCREMENT' })```

- 비교

  ```react
  //리듀서 사용 전
  const [number, setNumber] = useState(0);
  
  const onIncrease = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };
  
  
  
  //리듀서 사용 후///////////////////
  function reducer(state, action) {
    switch (action.type) {
      case "INCREMENT":
        return state + 1;
      default:
        return state;
    }
  }
  
  const [number, dispatch] = useReducer(reducer, 0);
  
  const onIncrease = () => {
    dispatch({ type: 'INCREMENT' });
  };
  
  
  ```

<br/><br/><br/>

#### - useState VS useReducer 어떤 것을 쓸까!

- useState: 컴포넌트에서 관리하는 값이 딱 하나고, 그 값이 단순한 숫자, 문자열 또는 boolean 값일 때 관리하기 편함
- 만약에 컴포넌트에서 관리하는 값이 여러개가 되어서 상태의 구조가 복잡해진다면 `useReducer`로 관리하는 것이 편함

<br/><br/><br/><br/><br/><br/>

## Context API

>리액트의 Context API 를 사용하면, 프로젝트 안에서 전역적으로 사용 할 수 있는 값을 관리 할 수 있음
>
>- 상태, 함수, 라이브러리, 인스턴스, DOM등 관리가 가능하다



### 사용법

#### 1. 선언 (App.js)

- ```React.createContext()```라는 함수를 사용

  ```javascript
  const UserDispatch = React.createContext(null);
  ```

- ```createContext```의 파라미터에는 Context의 기본값을 설정할 수 있다. 

- Context를 만들면 Context안의 ```Provider```라는 컴포넌트를 통하여 Context의 값을 정할 수 있다. ```value```라는 값을 설정해주면 된다.

```react
function reducer(state, action) {
     //리듀서 내용
}
export const UserDispatch = React.createContext(null);


function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { users } = state;

    return (
        <>
        <UserDispatch.Provider value = {dispatch}>
          <UserList users={users}/>
          </UserDispatch.Provider>
        </>
      );
}
```



#### 2. 사용(UserList.js)

- App에서 선언한 UserDispatch를 import하여 사용
- ```useContext```라는 Hook을 사용해서 **UserDispatch Contexet를 조회**

```react
import React, {useContext} from "react";
import {UserDispatch} from './App';

const User = React.memo(function User({ user }) {
  const dispatch = useContext(UserDispatch);
  return (
    <div>
      <b
        style={{
          cursor: "pointer",
          color: user.active ? "green" : "black",
        }}
        onClick={() =>{
          dispatch({ type: 'TOGGLE_USER', id: user.id});
        }}
      >
      &nbsp;
      {user.username}</b>
      <span>({user.email})</span>
      <button onClick={() => {
        dispatch({type:'REMOVE_USER', id: user.id})
      }}>삭제</button>
    </div>
  );
})
```

<br/><br/><br/><br/><br/><br/>

## Immer를 사용한 불변성 관리

>  리액트에서 배열이나 객체를 업데이트 할 때, 직접 수정하면 안되고 불변성을 지켜주면서 업데이트를 해주어야 한다.

- 객체 수정 : ```...```(spread) 연산자 사용

  ```react
  const object = {
      a: 1,
      b: 2
  }
  
  const nextObject = {
      ...object,
      b: 3
  }
  ```

  

- 배열 수정 : ```concat```, ```filter```, ```map``` 등의 함수를 사용 (```push```, ```splice``` 사용 X)

  ```react
  const todos = [
      {
          id: 1,
          text: '할일1',
          done: true
      },
      {
          id: 2,
          text: '할일2',
          done: false
      },
      {
          id: 3,
          text: '할일3',
          done: false
      }
  ];
  
  const insert = todos.concat({
      id: 4,
      text: '할일4',
      done: false
  });
  
  const filter = todos.filter(todo => todo.id !== 2);
  
  
  const toggle = todos.map(todo => {
      todo.id === 2 ?
          {
          	...todo, 
          	done: !todo.done,
          }
          :todo
  })
  ```

  

<br/><br/><br/>

#### Immer를 사용한 구현

- 기존 방식

```react
const nextState = {
    ...state,
    posts: state.posts.map(post =>
    	post.id === 1
        	? {
        		...post,
        		comments: post.comments.concat({
                    id: 3,
                    text: '새로운 댓글'
                })
    		}
    )
};
```

<br/>

- **Immer** 사용 (Immer가 불변성 관리를 대신 해줌)

```react
const nextState = produce(state, draft => {
    const post = draft.posts.find(post => post.id === 1);
    post.comments.push({
        id: 3,
        text: '새로운 댓글'
    });
});
```

- ```produce(수정하고싶은 상태, 업데이트 정의)``` 를 사용한다. 이 함수는 상태를 반환한다.

  ex)

  ```react
  const state = {
      number: 1,
      dontchangeMe: 2
  };
  
  const nextState = produce(state, draft => {
      draft.number += 1;
  });
  
  console.log(nextState); //{number: 2, dontchangeMe: 2}
  ```

- produce를 첫번째 파라미터가 없는채로 이용하면 상태를 반환하는 게 아니라 **상태를 업데이트 해주는 함수** 를 반환한다. (파라미터로 상태를 넘겨야함!)

  ```react
  const test = {
      number: 1,
      dontchangeMe: 2,
    };
  
    const nextState = produce((draft) => {
      draft.number += 1;
    });
    console.log(nextState); //f(n){ var r,,,, 함수 리턴}
    console.log(nextState(test)); //{number: 2, dontchangeMe: 2}
  
  ```

- setState를 할 때 immer를 사용할 수 있음(업데이트 해주는 함수 넣어서 deps배열에 안넣어도 되는 거)

  ```javascript
  //immer 사용 전, 업데이트 해주는 함수를 이용
  const onClick = useCallback(() => {
    setTodo(todo => ({
      ...todo,
      done: !todo.done
    }));
  }, []);
  
  //immer가 함수 리턴해주는 걸 이용
  const onClick = useCallback(() => {
    setTodo(
      produce(draft => {
        draft.done = !draft.done;
      })
    );
  }, []);
  ```

- immer를 사용하지 않은 코드가 더 빠르다.

- Proxy라는 기능을 사용해서 react-native와 구형브라우저에서는 사용이 안됨.

- 무조건적인 사용은 지양하고, 데이터 구조가 복잡해 지는 것을 방지해야 한다.

<br/><br/><br/><br/><br/><br/>

## 클래스형 컴포넌트

> vanilla 로 class로 구현할 때 이해되지 않았던 것들이 이해됐다.

```react
import React, { Component } from 'react';

class Counter extends Component {
  handleIncrease() { //얘가 커스텀 메서드
    console.log('increase');
    console.log(this); // undefine 출력
  }

  handleDecrease() {
    console.log('decrease');
  }

  render() {
    return (
      <div>
        <h1>0</h1>
        <button onClick={this.handleIncrease}>+1</button>
        <button onClick={this.handleDecrease}>-1</button>
      </div>
    );
  }
}

export default Counter;
```

<br/><br/>

#### 커스텀메서드

1. 특정 작업을 실행하고 싶다면 클래스 안에 **커스텀 메서드**를 만들어야 한다.
2. ```render()```함수 안에 쓸 수도 있지만, 일반적으로 **그렇게 하지 않는다.**

3. 명명 규칙은 보통 ```handle...```라고 이름짓는다.

4. 커스텀 메서드에서 ```this```는 컴포넌트 인스턴스를 가리키지 않기 때문에 따로 설정을 해줘야 한다. (3가지)

   - constructor 에서 ```bind```작업 : ```this```를 직접 설정 가능, 생성자 함수를 먼저 실행해 주고 우리가 할 작업을 하겠다 라는 의미라고 함

     ```react
     constructor(props) {
         super(props);
         this.handleIncrease = this.handleIncrease.bind(this);
         this.handleDecrease = this.handleDecrease.bind(this);
       }
     ```

   - 커스텀 메서드 선언 시 화살표 함수를 이용

     ```react
     handleIncrease = () => {
         console.log('increase');
         console.log(this);
       };
     ```

   - ```onClick```에서 새로운 함수를 만들어서 전달 (렌더링 할 때마다 함수가 새로 만들어져, 나중에 컴포넌트 최적화 시 까다로움)

     ```react
     return (
       <div>
         <h1>0</h1>
         <button onClick={() => this.handleIncrease()}>+1</button>
         <button onClick={() => this.handleDecrease()}>-1</button>
       </div>
     );
     ```

<br/><br/>

#### this.setState로 상태 설정하기

```react
 state = {
    counter: 0,
    fixed: 1
  };

  handleIncrease = () => {
    this.setState({
      counter: this.state.counter + 1 
    }, () => {
      console.log("콜백", this.state.counter) //콜백 1, 두번째로 찍힘
    })
    console.log(this.state.counter)//0, 얘 먼저 찍힘
  };
```

- this.setState를 이용해 state를 설정할 수 있다.

- fixed의 값은 그대로 유지되면서 counter의 값만 바꿀 수 있다.

- setState는 단순히 상태를 바꿔주는 함수가 아니라 상태를 바꿔달라고 **요청**해주는 함수다. 

  ```setState(updater, [callback]) ```

  이런 식이기 때문에 위에 작성한 것과 같이 setState 후 무언가를 실행하려면 두번째 파라미터의 콜백함수를 이용해야한다.

<br/><br/><br/><br/><br/><br/>

## ComponentDidCatch 로 에러 처리하기, Sentry

- ```ComponentDidCatch(에러내용, 에러발생위치)```  : 생명주기 메서드
- ```this.state.error``` 값이 ```true```면 에러가 발생했다는 화면 띄워줌

```react
import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    error: false,
  };

  componentDidCatch(error, info) {
    console.log("에러가 발생했습니다.");
    console.log({
      error,
      info,
    });
    this.setState({
      error: true,
    });
  }

  render() {
    if (this.state.error) {
      return <h1>에러 발생!</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```





### Sentry 사용

- 에러가 어디서 발생했는지 실시간으로 볼 수 있는 도구 사이트 : https://sentry.io/

- Instruction에 나타난대로 작업하면 된다.

  - ```yarn add @sentry/react @sentry/tracing```

  - 이렇게 캐치된 에러를 보여줌 Ip, browser, os 등등,,

    ![image](https://user-images.githubusercontent.com/51187540/113832137-46f7e480-97c3-11eb-9d26-ef1aada69d24.png)

<br/><br/><br/><br/><br/><br/>

## Redux

> 리액트 생태계에서 가장 사용률이 높은 상태관리 라이브러리
>
> 상태관련 로직들을 다른 파일들로 분리시켜서 더욱 효율적으로 관리할 수 있다. 
>
> 특히, Context API와 useReducer Hook을 사용해서 개발하는 흐름과 매우 유사하다.
>
> 리덕스 모듈이란 액션타입, 액션생성함수, 리듀서 세 개가 모두 들어있는 자바스크립트 파일이다.

<br/>

### 키워드

- **액션(Action)** : 상태에 어떤 변화가 필요할 때 액션을 발생시킴

  - type 필드를 필수적으로 가지고 있어야 하고 그 외의 값들은 마음대로 넣어줄 수 있음

  ```react
  {
    type: "ADD_TODO",
    data: {
      id: 0,
      text: "리덕스 배우기"
    }
  }
  ```

- **액션생성함수** : 액션을 만드는 함수, 파라미터를 받아와 액션 형태로 만들어준다.

  ```react
  export function addTodo(data) {
    return {
      type: "ADD_TODO",
      data
    };
  }
  ```

- **리듀서(Reducer)** : 변화를 일으키는 함수, 

  - state와 action을 파라미터로 받는다.
  - 새로운 상태를 리턴한다.
  - default로 state를 그대로 반환한다. 

  ```react
  function counter(state, action) {
    switch (action.type) {
      case 'INCREASE':
        return state + 1;
      case 'DECREASE':
        return state - 1;
      default:
        return state;
    }
  }
  ```

- **스토어(Store)** : 한 어플리케이션당 하나의 스토어를 가짐. 현재의 앱 상태와 리듀서가 들어감

- **디스패치(dispatch)** : 스토어의 내장함수

  - ```dispatch(action)``` 이런식으로 액션을 발생시킴

- **구독(subscribe)** : 스토어의 내장함수, subscribe함수에 특정 함수를 전달해주면, 액션이 디스패치 되었을때마다 전달해준 함수가 호출

  - 리액트에서 리덕스를 쓸 때 이 함수를 직접 사용할 일은 별로 없음.
  - 보통 ```connect```함수 또는 ```useSelector``` Hook을 사용해서 리덕스 스토어 상태를 구독함

<br/><br/>

### 리덕스의 세가지 규칙

**1. 하나의 애플리케이션, 하나의 스토어 **

- 여러개의 스토어를 사용하는 것은 가능하나, 권장되지는 않음. 하지만 이렇게 하면 개발도구를 활용하지 못함

**2. 상태는 읽기전용**

- 상태를 업데이트 할 때 기존 배열은 수정하지 않고 새로운 배열을 만들어서 교체하는 방식으로 업데이트를 한다. (concat이나 spread연산자와 같은..)
- 리덕스에서 불변성을 유지해야 하는 이유는 shallow compare는 equality를 체크하는 것인데 이 때 reference를 체크한다. 

**3. 리듀서는 순수함수**

- 이전상태는 그대로 두고, 변화를 일으킨 새로운 상태를 만들어 반환한다.
- 똑같은 파라미터로 호출된 리듀서는 언제나 똑같은 값을 반환해야 한다.
- new Date()와 같은 값을 생성해 다른 결과값이 나타나는 작업이 필요하다면 리듀서 밖에서 작업해야한다.

<br/><br/>

### 리덕스 모듈 만들고 적용

1. 모듈 (액션타입, 액션생성함수, 리듀서) (module/todo.js)

   ```react
   //액션타입선언
   const ADD_TODO = "todos/ADD_TODO";
   const TOGGLE_TODO = "todos/TOGGLE_TODO";
   
   let nextId = 1;
   
   //액션함수
   export const addTodo = (text) => ({
     type: "ADD_TODO",
     todo: {
       id: nextId++,
       text,
     },
   });
   
   export const toggleTodo = (id) => ({
     type: "TOGGLE_TODO",
     id,
   });
   
   //초기상태 선언
   const initialState = [];
   
   //리듀서 선언
   export default function todos(state = initialState, action) {
     switch (action.type) {
       case ADD_TODO:
         return state.concat(action.todo);
       case TOGGLE_TODO:
         return state.map((todo) =>
           todo.id === action.id ? { ...todo, done: !todo.done } : todo
         );
       default:
         return state;
     }
   }
   
   ```

   <br/>

2. 루트리듀서 - 한 프로젝트에 여러개의 리듀서가 있을 때 이걸 합쳐서 사용(module/index.js)

   ```react
   import { combineReducers } from 'redux';
   import counter from './counter';
   import todos from './todos';
   
   const rootReducer = combineReducers({
     counter,
     todos
   });
   
   export default rootReducer;
   ```

   <br/>

3. 스토어 생성 및 적용(./index.js)

   - 리액트에서는 ```react-redux```를 이용해 리덕스를 적용시켜야 한다.

   - provider로 App을 감싸면 우리가 렌더링하는 것들이 스토어에 접근이 가능하게 됨

   ```react
   import React from 'react';
   import ReactDOM from 'react-dom';
   import './index.css';
   import App from './App';
   import * as serviceWorker from './serviceWorker';
   import { createStore } from 'redux';
   import { Provider } from 'react-redux';
   import rootReducer from './modules';
   
   const store = createStore(rootReducer); // 스토어를 만듭니다.
   
   ReactDOM.render(
     <Provider store={store}>
       <App />
     </Provider>,
     document.getElementById('root')
   );
   
   serviceWorker.unregister();
   ```

   <br/>

4. 컴포넌트에서 리덕스 사용하기 (container/counterContainer.js)

   - useSelector를 사용해 상태를 조회하고
   - useDispatch를 사용해 스토어의 dispatch를 사용한다.

   ```react
   function CounterContainer() {
     //useSelector는 스토어의 상태를 조회하는 훅
     //state의 값은 store.getState를 호출한 것과 같음
     const { number, diff } = useSelector((state) => ({
       number: state.counter.number,
       diff: state.counter.diff,
     }));
     //useDispatch는 리덕스 스토어의 dispatch를 함수에 사용할 수 있게해주는 hook
     const dispatch = useDispatch();
     //각 액션들을 디스패치하는 함수들
     const onIncrease = () => dispatch(increase());
     const onDecrease = () => dispatch(decrease());
     const onSetDiff = (diff) => dispatch(setDiff(diff));
     return (
       <Counter
         number={number}
         diff={diff}
         onIncrease={onIncrease}
         onDecrease={onDecrease}
         onSetDiff={onSetDiff}
       />
     );
   }
   
   export default CounterContainer;
   ```


<br/><br/><br/><br/><br/>

## redux-middleware

- 미들웨어의 템플릿

  ```react
  const middleware = store => next => action => {
    // 하고 싶은 작업...
  }
  //아래와 동일
  function middleware(store) {
    return function (next) {
      return function (action) {
        // 하고 싶은 작업...
      };
    };
  };
  ```

  - store : 리덕스 스토어 인스턴스, disaptch, getState, subscribe 내장함수가 들어있음
  - next : 액션을 다음 미들웨어에게 전달하는 함수, ```next(action)``` 이런 식으로 사용, 이게 호출되지 않으면 액션이 무시되어 리듀서에게 전달되지 않음
  - action : 현재 가리키고 있는 액션 객체

- redux-logger 사용법 (index.js)

  ```react
  import logger from 'redux-logger';
  import { composeWithDevTools } from 'redux-devtools-extension';
  
  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger)));
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
  ```

<br/><br/><br/>

### 리덕스 thunk

> 리덕스에서 비동기 작업을 처리 할 때 가장 많이 사용하는 미들웨어
>
> 액션객체가 아닌 함수를 디스패치 할 수 있다.
>
> 이 함수를 만들어 주는 함수를 thunk라고 부른다.

- thunk예시

  ```react
  const getComments = () => async (dispatch, getState) => {
      //이 안에서는 액션을 dispatch 할 수도 있고, getState를 통해 상태 조회가능
    const id = getState().post.activeId;
    dispatch({ type: 'GET_COMMENTS' });//요청시작을 알리는 액션
    try {
      const comments = await api.getComments(id);//요청하고 
      dispatch({ type:  'GET_COMMENTS_SUCCESS', id, comments });//성공
    } catch (e) {
      dispatch({ type:  'GET_COMMENTS_ERROR', error: e });//실패
    }
  }
  ```

<br/><br/><br/>

### 리덕스 saga

> redux-thunk 다음으로 가장 많이 사용되는 라이브러리
>
> 액션을 모니터링 하고 있다가, 특정 액션이 발생하면 이에 따라 특정 작업을 하는 방식

- redux-saga가 처리할 수 있는 작업들

  - 비동기 작업에서 기존 요청 취소 처리
  - 특정 액션이 발생했을 때 액션 디스패치하거나, 자바스크립트 코드 실행
  - 웹소켓을 사용하는 경우 Channel 이라는 기능을 사용하여 효율적으로 코드관리 가능
  - API 요청 실패했을 때 재요청 작업 가능

- 사가 만들기 (제너레이터 함수를 saga라고 부름)

  ```react
  //액션생성함수
  export const getPosts = () => ({ type: GET_POSTS });
  export const getPost = (id) => ({ type: GET_POST, payload: id, meta: id });
  
  //saga
  function* getPostsSaga() {
    try {
      const posts = yield call(postsAPI.getPosts); //call을 사용하면 특정 함수를 호출, 결과물 반환될때까지 기다리기
      yield put({
        type: GET_POSTS_SUCCESS,
        payload: posts,
      }); //성공 액션 디스패치
    } catch (e) {
      yield put({
      type: GET_POSTS_ERROR,
        error: true,
        payload: e,
      }); //실패 액션 디스패치
    }
  }
  
  //saga
  function* getPostSaga(action) {
    const param = action.payload;
    const id = action.meta;
    try {
      const post = yield call(postsAPI.getPostById, param); //api에 넣어주고 싶은 인자는 call함수의 두번째 파라미터로 넣어주기
      yield put({
        type: GET_POST_SUCCESS,
        payload: post,
        meta: id,
      });
    } catch (e) {
      yield put({
        type: GET_POST_ERROR,
        error: true,
        payload: e,
        meta: id,
      });
    }
  }
  
  //사가 합치기
  export function* postsSaga() {
    yield takeEvery(GET_POSTS, getPostsSaga);
    yield takeLatest (GET_POST, getPostSaga);
  }
  ```
  
  - takeEvery : 등록된 모든 액션을 실행
  - takeLatest : 등록된 액션중 최근에 디스패치된 액션만 실행 (1개만)
  - ```getPosts```와 ```getPost```는 thunk는 thunk함수를 반환했고, saga를 쓰면 순수 액션객체를 반환하는 액션생성함수로 구현이 가능하다.
  - 액션을 모니터링해서 특정 액션이 발생했을 때 호출할 사가 함수에서는 해당 액션을 받아올 수 있다. getPostSaga의 경우, 액션을 파라미터로 받아와 해당 액션의 id를 참조 할 수 있다.



<br/><br/><br/><br/><br/><br/>

## CORS 와 Webpack DevServer Proxy

> CORS : Cross-Origin Resource Sharing
>
> -> 데이터를 주고 받을 때 다른 출처의 자원에 접근할 수 있게 권한을 부여해주는 체제
>
> 브라우저간 데이터를 주고 받는 과정에서 이 공유 설정을 하지 않았다면 CORS에러가 발생한다.

- 설정법
  - 요청을 주는 쪽의 reqeust header와 요청을 받는 쪽의 response header의 특정 값을 설정하면 된다.
  - request 헤더에는 Origin
  - response 헤더에는 Access-Control-Allow-Origin 



#### Webpack DevServer Proxy

- 웹팩 개발서버의 프록시를 사용하게 되면 서버 -> 서버로 요청을 해서 CORS에러가 나지 않음

- pacakge.json 에 proxy 설정값 추가

  ```json
  
  ...
  
  "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    },
    "proxy": "http://localhost:4000"
  ```

<br/><br/><br/><br/><br/><br/>

## 리액트와 타입스크립트

### 타입스크립트 사용 이유

1. IDE 적극적으로 활용 (자동완성, 타입확인)
   - 해당함수가 어떤 파라미터를 필요로 하는지, 그리고 어떤 값을 반환하는지 코드를 따로 열어보지 않아도 알 수 있음
   - 리액트의 경우, props에는 무엇을 전달해줘야되는지, JSX를 작성하는 과정에서 바로 알 수 있음
   - 컴포넌트에서 props와 state에 어떤 값이 있는지 알 수 있음
   - 리덕스 사용 시 스토어 안에 어떤 상태가 들어있는지 바로 조회 가능
2. 실수 방지
   - 타입추론이 가능하여 오타가 나도 IDE상에서 바로 알 수 있음
   - null, undefined 일수도 있는 값이 있으면 오류를 띄움

<br/><br/><br/>

### 시작하기

```
npx create-react-app ts-react-tutorial --template typescript
```



### React.FC

- 컴포넌트들을 보면 ```const App: React.FC = () => {...}``` 과 같이 선언되었다. ```React.FC```를 사용할 떄는 props의 타입을 generics으로 넣어서 사용한다.

  ```typescript
  const Greetings: React.FC<GreetingsProps> = ({ name }) => (
    <div>Hello, {name}</div>
  );
  ```

  - 장점 : props에 기본적으로 children이 들어가 있다, chirdrenm의 prop을 지정하지 않더라도 오류없이 동작
  - 단점 : React.FC는 defaultProps 연결을 끊고 props를 기본값으로 설정한다.

참고 : https://velog.io/@namezin/Why-I-dont-use-React.FC



### type 선언

- 어떤 값을 해당 컴포넌트에서 사용을 하려면 type을 선언해줘야 하는데 두 가지로 선언할 수 있다. 1
- interface, type

```typescript
interface Point {
  x: number;
  y: number;
}

type Point2 = {
  x: number;
  y: number;
};


function MyForm({ point }: Point2) {
    ...
    return(
    ...
    )
    
}
export default MyForm;
```

참고 : https://blog.bitsrc.io/react-typescript-cheetsheet-2b6fa2cecfe2

<br/>

### event의 타입

- 작성한 함수 onchange 에 커서를 올리면 자동완성으로 ```React.ChangeEvent<HTMLInputElement>```라고 나온다

  ```
  <input name="name" value={name} onChange={onChange} />
  ```

<br/>

<br/><br/><br/><br/><br/><br/>

## 타입스크립트로 리액트 상태관리

### 1. ```useState```

- generics를 사용하여 해당 상태가 어떤 타입을 가지고 있을 지 설정

  ```react
  const [count, setCount] = useState<number>(0);
  ```

- useState사용할 때 알아서 type을 유추하기 때문에 generics을 선언하지 않아도 되는데, null이 들어가도 있을 때 활용하면 좋다고 한다.

  ```react
  type Information = { name: string; description: string };
  const [info, setInformation] = useState<Information | null>(null);
  ```

<br/>

#### useState를 사용한 form 핸들

- src/MyForm.tsx

  ```react
  import React, { useState } from 'react';
  
  type MyFormProps = {
    onSubmit: (form: { name: string; description: string }) => void;
  };
  
  function MyForm({ onSubmit }: MyFormProps) {
    const [form, setForm] = useState({
      name: '',
      description: ''
    });
  
    const { name, description } = form;
  
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm({
        ...form,
        [name]: value
      });
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      // 여기도 모르니까 any 로 하겠습니다.
      e.preventDefault();
      onSubmit(form);
      setForm({
        name: '',
        description: ''
      }); // 초기화
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input name="name" value={name} onChange={onChange} />
        <input name="description" value={description} onChange={onChange} />
        <button type="submit">등록</button>
      </form>
    );
  }
  
  export default MyForm;
  ```

- src/App.tsx

  ```react
  import React from 'react';
  import MyForm from './MyForm';
  
  const App: React.FC = () => {
    const onSubmit = (form: { name: string; description: string }) => {
      console.log(form);
    };
    return <MyForm onSubmit={onSubmit} />;
  };
  
  export default App;
  ```

<br/><br/>

### 2. ```useReducer```

- 사용할 타입들을 지정

- 액션의 정의 

  - ```|``` 로 액션을 나열, 액션객체에 필요한 값들도 타입안에 명시하면 리듀서 작성 시 자동완성 되고 dispatch할 때 타입검사 해줌

  ```react
  type Action = 
    | { type: 'SET_COUNT'; count: number } 
    | { type: 'TOGGLE_GOOD' };
  ```

  

```react
import React, { useReducer } from 'react';

type Color = 'red' | 'orange' | 'yellow';

type State = {
  count: number;
  isGood: boolean;
};

type Action = //action을 | 로 나열
  | { type: 'SET_COUNT'; count: number } 
  | { type: 'TOGGLE_GOOD' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_COUNT':
      return {
        ...state,
        count: action.count // count가 자동완성, number 타입인걸 알 수 있음
      };
    case 'TOGGLE_GOOD':
      return {
        ...state,
        isGood: !state.isGood
      };
    default:
      throw new Error('Unhandled action');
  }
}

function ReducerSample() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    isGood: true
  });

  const setCount = () => dispatch({ type: 'SET_COUNT', count: 5 }); 
    // count 를 넣지 않으면 에러발생
  const toggleGood = () => dispatch({ type: 'TOGGLE_GOOD' });

  return (
    <div>
      <p>
        <code>count: </code> {state.count}
      </p>
      <p>
        <code>isGood: </code> {state.isGood ? 'true' : 'false'}
      </p>
      <div>
        <button onClick={setCount}>SET_COUNT</button>
        <button onClick={toggleGood}>TOGGLE_GOOD</button>
      </div>
    </div>
  );
}

export default ReducerSample;
```

<br/>

<br/><br/><br/><br/><br/><br/>



## typesafe-actions 리팩토링

```
$ yarn add typesafe-actions
```

- 이전

  ```react
  //액션타입 선언
  const ADD_TODO = 'todos/ADD_TODO' as const; //as const를 붙여줌으로써 나중에 추론될 때 string으로 추론도ㅣ지 않고 todos/ADD_TODO 로 추론되도록
  const TOGGLE_TODO = 'todos/TOGGLE_TODO' as const;
  const REMOVE_TODO = 'todos/REMOVE_TODO' as const;
  
  let nextId = 1; //새로운 항목을 추가 할 때 사용할 고유 id 값
  
  //액션 생성 함수
  export const addTodo = (text: string) => ({
      type: ADD_TODO,
      payload: {
          id: nextId++,
          text
      }
  });
  
  export const toggleTodo = (id: number) => ({
      type: TOGGLE_TODO,
      payload: id,
  });
  
  export const removeTodo = (id: number) => ({
      type: REMOVE_TODO,
      payload: id,
  })
  
  //모든 액션 객체들에 대한 타입 
  type TodosAction =
      | ReturnType<typeof addTodo>
      | ReturnType<typeof toggleTodo>
      | ReturnType<typeof removeTodo>;
  
  //상태에서 사용할 할 일 목록
  export type Todo = {
      id: number;
      text: string;
      done: boolean;
  };
  
  //이 모듈에서 관리할 상태는 Todo 객체로 이루어진 배열
  export type TodosState = Todo[];
  
  //초기상태 선언
  const initialState: TodosState = [];
  
  
  //리듀서 작성
  function todos(
      state: TodosState = initialState,
      action: TodosAction
  ): TodosState{
      switch (action.type) {
          case ADD_TODO:
              return state.concat({
                  id: action.payload.id,
                  text: action.payload.text,
                  done: false
              });
          case TOGGLE_TODO:
              return state.map(todo =>
                  todo.id === action.payload ? { ...todo, done: !todo.done } : todo
              );
          case REMOVE_TODO:
              return state.filter(todo => todo.id !== action.payload);
          default:
              return state;
      }
  }
  
  export default todos; 
  ```

- typesafe-actions 적용 후 

  ```react
  import {
      action,
      deprecated,
      ActionType,
      createReducer
  } from 'typesafe-actions';
  
  //액션타입 선언
  const ADD_TODO = 'todos/ADD_TODO';
  const TOGGLE_TODO = 'todos/TOGGLE_TODO';
  const REMOVE_TODO = 'todos/REMOVE_TODO';
  
  const { createStandardAction } = deprecated;
  
  let nextId = 1; //새로운 항목을 추가 할 때 사용할 고유 id 값
  
  //액션 생성 함수
  export const addTodo = (text: string) => action(ADD_TODO, { id: nextId++, text })
  export const toggleTodo = createStandardAction(TOGGLE_TODO)<number>();
  export const removeTodo = createStandardAction(REMOVE_TODO)<number>();
  
  //모든 액션 객체들에 대한 타입 
  const actions = { addTodo, toggleTodo, removeTodo };
  type TodosAction = ActionType<typeof actions>;
  
  //상태에서 사용할 할 일 목록
  export type Todo = {
      id: number;
      text: string;
      done: boolean;
  };
  
  //이 모듈에서 관리할 상태는 Todo 객체로 이루어진 배열
  export type TodosState = Todo[];
  
  //초기상태 선언
  const initialState: TodosState = [];
  
  
  //리듀서 작성
  const todos = createReducer<TodosState, TodosAction>(initialState, {
      [ADD_TODO]: (state, action) =>
          state.concat({
              ...action.payload,
              done: false
          }),
       [TOGGLE_TODO]: (state, { payload: id }) =>
      state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
      [REMOVE_TODO]: (state, { payload: id }) =>
      state.filter(todo => todo.id !== id)
  })
  
  export default todos;
  ```




<br/><br/><br/>

### 리덕스 모듈 여러 파일로 분리

#### 파일구조

```
├─ modules
│  │  
│  ├─todos
│  │       actions.ts
│  │       index.ts
│  │       reducer.ts
│  │       types.td
│  └─counter.ts #파일이 그렇게 길지 않은 경우
│         
│          
```

</br>

#### 작성 예시

- **actions.ts** : 액션 정의

  ```react
  import { deprecated, action } from "typesafe-actions";
  
  const { createStandardAction } = deprecated;
  
  //리듀서에서 사용 할 수 있도록 타입 내보내줌
  export const ADD_TODO = "todos/ADD_TODO";
  export const TOGGLE_TODO = "todos/TOGGLE_TODO";
  export const REMOVE_TODO = "todos/REMOVE_TODO";
  
  let nextId = 1; //새로운 항목을 추가 할 때 사용할 고유 ID값
  
  //액션생성함수
  //액션생성 함수의 경우 파라미터를 기반하여 커스터마이징 된 payload를 설정해줘야함
  //action = 액션 객체를 만드는 함수
  export const addTodo = (text: string) =>
    action(ADD_TODO, { id: nextId++, text });
  export const toggleTodo = createStandardAction(TOGGLE_TODO)<number>();
  export const removeTodo = createStandardAction(REMOVE_TODO)<number>();
  ```

</br>

- **types.ts**  : 액션객체들의 타입, 상태의 타입 설정

  ```react
  import { ActionType } from 'typesafe-actions';
  import * as actions from './actions';
  
  export type TodosAction = ActionType<typeof actions>;
  
  export type Todo = {
      id: number;
      text: string;
      done: boolean;
  }
  
  export type TodosState = Todo[];
  ```

</br>

- **reducer.ts** : 리듀서 정의

  ```react
  import { TodosState, TodosAction } from './types';
  import { createReducer } from 'typesafe-actions';
  import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO } from './actions';
  
  //초기 상태 선언
  const initialState: TodosState = [];
  
  //리듀서 작성
  const reducer = createReducer<TodosState, TodosAction>(initialState, {
      [ADD_TODO]: (state, action) =>
          state.concat({
              ...action.payload, //id, text가 이 안에
              done: false
          }),
      [TOGGLE_TODO]: (state, { payload: id }) =>
          state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
      [REMOVE_TODO]: (state, { payload: id }) =>
          state.filter(todo => todo.id !== id)
  });
  
  export default reducer;
  ```

</br>

- **index.ts** : 기존에 todos.ts 를 불러와서 사용하던 코드들이 (컨테이너 및 루트 리듀서) 별도의 import 경로 수정 없이 제대로 동작하기 위해 작성

  ```react
  export { default } from './reducer'; //reducer를 불러와 default로 내보내겠다
  export * from './actions'; //모든 액션함수를 불러와서 같은 이름들로 내보내겠다
  export * from './types'; //모든 타입들을 불러와서 같은 이름으로 내보내겠따
  ```

  