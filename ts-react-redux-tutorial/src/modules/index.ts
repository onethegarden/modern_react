import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
    counter
});

//루트 리듀서 내보내기
export default rootReducer;

//루트리듀서 타입 반환
//나중에 이 타입을 컨테이너에서 불러와 사용해야함
export type RootState = ReturnType<typeof rootReducer>;