import React, {useContext} from "react";
import {UserDispatch} from './App';

const User = React.memo(function User({ user }) {
  /*
    useEffect(()=>{
        console.log(user);
    }) //컴포넌트가 리렌더링 될 때만 실행
    
  useEffect(() => {
    console.log("user 값이 설정됨");
    console.log(user);
    return () => {
      console.log("user가 바뀌기 전");
      console.log(user);
    };
  }, [user]);
  */
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

function UserList({ users, onRemove, onToggle }) {
  return (
    <div>
      {users.map((user) => (
        <User
          user={user}
          key={user.id}
          onRemove={onRemove}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export default React.memo(UserList);
