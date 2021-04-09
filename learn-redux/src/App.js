import React from 'react';
import CounterContainer from './container/CounterContainer';
import TodosContainer from './container/TodosContainer';

function App() {
  return (
    <div className="App">
      <CounterContainer/>
      <TodosContainer/>
    </div>
  );
}

export default App;
