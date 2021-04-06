import React, { Component, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}
//class 형 컴포넌트
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      fixed:1
    };
  }
  handleIncrease = () => {
    this.setState({
      counter: this.state.counter + 1
    }, ()=>{
      console.log("콜백", this.state.counter)
    })
    console.log(this.state.counter)
  };

  handleDecrease = () => {
    this.setState({
      counter: this.state.counter - 1
    })
  };

  render() {
    return (
      <div>
        <h1>{this.state.counter}</h1>
        <h4>고정된 값 : {this.state.fixed}</h4>
        <button onClick={this.handleIncrease}>+1</button>
        <button onClick={this.handleDecrease}>-1</button>
      </div>
    );
  }
}
/*
function Counter() {
  const [number, dispatch] = useReducer(reducer, 0);

  const onIncrease = () => {
    dispatch({ type: 'INCREMENT' });
  };

  const onDecrease = () => {
    dispatch({ type: 'DECREMENT' });
  };

  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
}
*/
export default Counter;
