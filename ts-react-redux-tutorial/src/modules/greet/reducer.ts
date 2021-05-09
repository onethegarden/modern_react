import { GreetState, GreetAction } from "./types";
import { createReducer } from "typesafe-actions";
import { ADD_NAME, REMOVE_NAME, TOGGLE_GREET } from "./actions";

const initialState: GreetState = {
  name: "",
  greet: false,
};

const reducer = createReducer<GreetState, GreetAction>(initialState, {
  [ADD_NAME]: (state, action) => ({
    ...action.payload,
    greet: false,
  }),
  [REMOVE_NAME]: (state) => ({
    name: "",
    greet: false,
  }),
  [TOGGLE_GREET]: (state) => ({
    name: state.name,
    greet: !state.greet,
  }),
});

export default reducer;
