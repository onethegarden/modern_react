import { combineReducers } from "redux";
import counter from "./counter";
import todos from "./todos";
import greet from "./greet";
import github from "./github/reducer";
import { githubSaga } from "./github";
import { all } from "redux-saga/effects";

const rootReducer = combineReducers({
  counter,
  todos,
  greet,
  github,
});

//루트 리듀서 내보내기
export default rootReducer;

//루트리듀서 타입 반환
//나중에 이 타입을 컨테이너에서 불러와 사용해야함
export type RootState = ReturnType<typeof rootReducer>;

//루트 사가 만들기
export function* rootSaga() {
  yield all([githubSaga()]);
}
