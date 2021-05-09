import { deprecated, action } from "typesafe-actions";

const { createStandardAction } = deprecated;

//리듀서에서 사용 할 수 있도록 타입 내보내줌
export const ADD_TODO = "todos/ADD_TODO";
export const TOGGLE_TODO = "todos/TOGGLE_TODO";
export const REMOVE_TODO = "todos/REMOVE_TODO";

let nextId = 1; //새로운 항목을 추가 할 때 사용할 고유 ID값

//액션생성함수
//액션생성 함수의 경우 파라미터를 기반하여 커스터마이징 된 payload를 설정해줘야함
//createAction이라는 함수 사용
//action = 액션 객체를 만드는 함수
export const addTodo = (text: string) =>
  action(ADD_TODO, { id: nextId++, text });
export const toggleTodo = createStandardAction(TOGGLE_TODO)<number>();
export const removeTodo = createStandardAction(REMOVE_TODO)<number>();
