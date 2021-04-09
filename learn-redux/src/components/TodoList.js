import React from "react";
import TodoItem from "./TodoItem";

const TodoList = React.memo(function TodoList({todos, onToggle}) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))}
    </ul>
  );
});

export default TodoList;