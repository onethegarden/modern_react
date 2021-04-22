//액션타입
const INCREASE = 'counter/INCREASE' as const;
const DECREASE = 'counter/DECREASE' as const;
const INCREASE_BY = 'counter/INCREASE_BY' as const;

//액션 생성함수 선언
export const increase = () => ({
    type: INCREASE
});

export const decrease = () => ({
    type: DECREASE
});

export const increaseBy = (diff: number) => ({
    type: INCREASE_BY,
    payload: diff
});

//액션객체들에 대한 타입
//<ReturnType<typeof ___>는 특정함수의 반환값 추론
type CounterAction =
    | ReturnType<typeof increase>
    | ReturnType<typeof decrease>
    | ReturnType<typeof increaseBy>;

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
}
export default counter;