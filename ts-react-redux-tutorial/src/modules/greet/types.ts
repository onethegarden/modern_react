import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type GreetAction = ActionType<typeof actions>;
export type Greet = {
  name: string;
  greet: boolean;
};
export type GreetState = Greet;
