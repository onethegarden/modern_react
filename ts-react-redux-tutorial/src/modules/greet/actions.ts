import { deprecated, action } from "typesafe-actions";
import { REMOVE_TODO } from "../todos";

const { createStandardAction } = deprecated;

export const ADD_NAME = "greet/ADD_NAME";
export const REMOVE_NAME = "greet/REMOVE_NAME";
export const TOGGLE_GREET = "greet/TOGGLE_GREET";

export const addName = (name: string) => action(ADD_NAME, { name });
export const removeName = createStandardAction(REMOVE_NAME)();
export const toggleGreet = createStandardAction(TOGGLE_GREET)();
