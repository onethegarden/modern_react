//액션타입 선언
const ADD_TODO = 'todos/ADD_TODO' as const; //as const를 붙여줌으로써 나중에 추론될 때 string으로 추론도ㅣ지 않고 todos/ADD_TODO 로 추론되도록
const TOGGLE_TODO = 'todos/TOGGLE_TODO' as const;
const REMOVE_TODO = 'todos/REMOVE_TODO' as const;

let nextId = 1; //새로운 항목을 추가 할 때 사용할 고유 id 값

//액션 생성 함수
export const addTodo = (text: string) => ({
    type: ADD_TODO,
    payload: {
        id: nextId++,
        text
    }
});

export const toggleTodo = (id: number) => ({
    type: TOGGLE_TODO,
    payload: id,
});

export const removeTodo = (id: number) => ({
    type: REMOVE_TODO,
    payload: id,
})

//모든 액션 객체들에 대한 타입 
type TodosAction =
    | ReturnType<typeof addTodo>
    | ReturnType<typeof toggleTodo>
    | ReturnType<typeof removeTodo>;

//상태에서 사용할 할 일 목록
export type Todo = {
    id: number;
    text: string;
    done: boolean;
};

//이 모듈에서 관리할 상태는 Todo 객체로 이루어진 배열
export type TodosState = Todo[];

//초기상태 선언
const initialState: TodosState = [];


//리듀서 작성
function todos(
    state: TodosState = initialState,
    action: TodosAction
): TodosState{
    switch (action.type) {
        case ADD_TODO:
            return state.concat({
                //action.payload 객체 안의 값이 모두 유추
                id: action.payload.id,
                text: action.payload.text,
                done: false
            });
        case TOGGLE_TODO:
            return state.map(todo =>
                todo.id === action.payload ? { ...todo, done: !todo.done } : todo
            );
        case REMOVE_TODO:
            //payloda 가 number인 것이 유추
            return state.filter(todo => todo.id !== action.payload);
        default:
            return state;
    }
}

export default todos;