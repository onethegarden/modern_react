import React from "react";
import Greetings from "./Greeting";
import Counter from "./Counter";
import MyForm from "./MyForm";
import ReducerSample from "./ReducerSample";

function App() {
  const onClick = (name: string) => {
    console.log(`${name} say hello`);
  };
  const onSubmit = (form: { name: string; description: string }) => {
    console.log(form);
  };
  return (
    <>
      <Greetings name="Hello" onClick={onClick} />
      <Counter />
      <MyForm onSubmit={onSubmit} />;
      <ReducerSample />
    </>
  );
}

export default App;
