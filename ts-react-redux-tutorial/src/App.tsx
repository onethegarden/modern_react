import React from "react";
import CounterContainer from "./containers/CounterContainer";
import TodoContainer from "./containers/TodoApp";
import GreetContainer from "./containers/GreetContainer";
import GithubProfileLoader from "./containers/GithubProfileLoader";

function App() {
  return (
    <>
      <GithubProfileLoader />
    </>
  );
}

export default App;
