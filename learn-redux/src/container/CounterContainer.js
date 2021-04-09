import React from "react";
import { useSelector, useDispatch,shallowEqual } from "react-redux";
import Counter from "../components/Counter";
import { increase, decrease, setDiff } from "../modules/counter";

function CounterContainer() {
  //useSelector는 스토어의 상태를 조회하는 훅
  //state의 값은 store.getState를 호출한 것과 같음
  const { number, diff } = useSelector((state) => ({
    number: state.counter.number,
    diff: state.counter.diff,
  }),shallowEqual);
  //useDispatch는 리덕스 스토어의 dispatch를 함수에 사용할 수 있게해주는 hook
  const dispatch = useDispatch();
  //각 액션들을 디스패치하는 함수들
  const onIncrease = () => dispatch(increase());
  const onDecrease = () => dispatch(decrease());
  const onSetDiff = (diff) => dispatch(setDiff(diff));
  return (
    <Counter
      number={number}
      diff={diff}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onSetDiff={onSetDiff}
    />
  );
}

export default CounterContainer;
