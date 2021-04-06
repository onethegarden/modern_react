# ⚛Modern-React

>벨로퍼트와 함께하는 모던리액트를 보고 
>
>리액트를 꼼꼼하게 정리해보자 😣😤

<p style="font-size:10px">출처 : https://react.vlpt.us/</p>

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

  

