import React from 'react';
import Greetings from './Greeting';

function App() {
  const onClick = (name: string) => {
    console.log(`${name} say hello`);
  }
  return (
    <Greetings name="Hello" onClick={onClick}/>
  );
}

export default App;
