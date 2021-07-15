//import { createAsyncAction } from "typesafe-actions";
import { GithubProfile } from "../../api/github";
import { AxiosError } from "axios";
import {
  createAsyncAction,
  createActionEntity,
} from "../../lib/createAsyncSaga";

export const GET_USER = createAsyncAction("github/GET_USER");

export const getUserProfileAsync = createActionEntity<
  string,
  GithubProfile,
  AxiosError
>(GET_USER);
