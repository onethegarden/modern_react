import React from "react";
import CounterContainer from "./containers/CounterContainer";
import TodoContainer from "./containers/TodoApp";
import GreetContainer from "./containers/GreetContainer";

function App() {
  return (
    <>
      <GreetContainer />
      <CounterContainer />
      <TodoContainer />
    </>
  );
}

export default App;
