import { createStore } from "redux";

//createStore는 스토어를 만들어주는 함수

//리덕스에서 관리할 상태 정의
const initialState = {
  counter: 0,
  text: "",
  list: [],
};

//액션타입 정의, 대문자로 작성
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";
const CHANGE_TEXT = "CHANGE_TEXT";
const ADD_TO_LIST = "ADD_TO_LIST";

//액션함수 생성함수 정의
function increase() {
  return {
    type: INCREASE,
  };
}

const decrease = () => ({
  type: DECREASE,
});

const changeText = (text) => ({
  type: CHANGE_TEXT,
  text,
});

const addToList = (item) => ({
  type: ADD_TO_LIST,
  item,
});

//리듀서 만들기
function reducer(state = initialState, action) {
  //state의 초기값을 initialState로 지정
  switch (action.type) {
    case INCREASE:
      return {
        ...state,
        counter: state.counter + 1,
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };
    case CHANGE_TEXT:
      return {
        ...state,
        text: action.text,
      };
    case ADD_TO_LIST:
        return {
            state,
            list: state.list.concat(action.item)
        }
    default:
      return state;
  }
}

//스토어 만들기
const store = createStore(reducer);

console.log(store.getState());//스토어 조회

//스토어 안에 들어있는 상태가 바뀔때마다 호출되는 listener
const listener = () => {
    const state = store.getState();
    console.log(state);
}
const unsubscribe = store.subscribe(listener);
//구독을 해제하고 싶을 때는 unsubscribe를 호출하면 된다.


//액션들을 디스패치 해봅시다~
store.dispatch(increase());
store.dispatch(decrease());
store.dispatch(changeText('안녕하세영'));
store.dispatch(addToList({id:1, text:'와우'}));