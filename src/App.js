import React, { useRef, useState, useMemo, useCallback } from "react";
import UserList from "./UserList";
import CreateUser from "./CreateUser";

function countActiveUsers(users) {
  console.log("활성 사용자 수를 세는 중");
  return users.filter((user) => user.active).length;
}

function App() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
  });
  const { username, email } = inputs;

  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setInputs(inputs => ({
        ...inputs,
        [name]: value,
      }));
    },
    []
  );

  const [users, setUsers] = useState([
    {
      id: 1,
      username: "velopert",
      email: "public.velopert@gmail.com",
      active: true,
    },
    {
      id: 2,
      username: "tester",
      email: "tester@example.com",
      active: false,
    },
    {
      id: 3,
      username: "liz",
      email: "liz@example.com",
      active: false,
    },
  ]);

  const nextId = useRef(4);
  const onCreate = () => {
    const user = {
      id: nextId.current,
      username,
      email,
    };
    setUsers(users => users.concat(user));

    setInputs({
      username: "",
      email: "",
    });
    nextId.current += 1;
  };

  const onRemove = useCallback(
    (id) => {
      // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
      // = user.id 가 id 인 것을 제거함
      setUsers(users => users.filter((user) => user.id !== id));
    },
    []
  );

  const onToggle = useCallback(
    (id) => {
      setUsers(users=>(
        users.map((user) =>
          user.id === id ? { ...user, active: !user.active } : user
        )
      ));
    },
    []
  );

  //const count = countActiveUsers(users);
  //위처럼 사용하면 input값이 변경될 때도 컴포넌트가 리렌더링 됨
  const count = useMemo(() => countActiveUsers(users), [users]);
  //useMemo(연산정의, deps배열)
  //deps가 바뀌었다면 바뀐 값을 적용, 아니라면 이전 값을 적용
  return (
    <>
      <CreateUser
        username={username}
        email={email}
        onChange={onChange}
        onCreate={onCreate}
      />
      <UserList users={users} onRemove={onRemove} onToggle={onToggle} />
      <div>활성 사용자 수 : {count}</div>
    </>
  );
}

export default App;
