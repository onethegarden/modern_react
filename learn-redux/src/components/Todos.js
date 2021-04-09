import React, { useState } from 'react';
import Todolist from './TodoList';

function Todos({ todos, onCreate, onToggle }){
    const [text, setText] = useState('');
    const onChange = e => setText(e.target.value);
    const onSubmit = e => {
        e.preventDefault();
        onCreate(text);
        setText('');
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={text}
                    placeholder="할 일을 입력하세요"
                    onChange={onChange}
                />
                <button type="submit">등록</button>
            </form>
            <Todolist todos={todos} onToggle={onToggle}/>
        </div>
    )
};

export default Todos;