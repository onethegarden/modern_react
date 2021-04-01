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

