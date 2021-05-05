import {
    deprecated,
    ActionType,
    createReducer
} from 'typesafe-actions';

//액션타입
const INCREASE = 'counter/INCREASE' as const;
const DECREASE = 'counter/DECREASE' as const;
const INCREASE_BY = 'counter/INCREASE_BY' as const;

const { createStandardAction } = deprecated;
//액션 생성함수 선언
export const increase = createStandardAction(INCREASE)();
export const decrease = createStandardAction(DECREASE)();
export const increaseBy = createStandardAction(INCREASE_BY)<number>();// payload 타입을 Generics 로 설정

//액션객체들에 대한 타입
const actions = { increase, decrease, increaseBy }; //모든 액션생성 함수를 action 객체에 넣기
type CounterAction = ActionType<typeof actions>; // ActionType 를 사용하여 모든 액션 객체들의 타입을 준비
 //리덕스 모듈에서 관리할 상태 타입선언
type CounterState = {
    count: number;
};

//초기상태 선언
const initialState: CounterState = {
    count: 0
};

//리듀서 
//state와 함수의 반환값이 일치해야함
const counter = createReducer<CounterState, CounterAction>(initialState, {
    [INCREASE]: state => ({ count: state.count + 1 }), //액션을 참조할 필요 없으면 파라미터로 state만
    [DECREASE]: state => ({ count: state.count - 1 }),
    [INCREASE_BY]: (state, action) => ({ count: state.count + action.payload }) // 액션의 타입을 유추
    
});
/*
function counter(
    state: CounterState = initialState,
    action: CounterAction
): CounterState{
    switch (action.type) {
        case INCREASE:
            return { count: state.count + 1 };
        case DECREASE:
            return { count: state.count - 1 };
        case INCREASE_BY:
            return { count: state.count + action.payload };
        default:
            return state;
    }
}*/
export default counter;