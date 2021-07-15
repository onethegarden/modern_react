//import { createReducer } from "typesafe-actions";
import { GithubState, GithubAction } from "./types";
import { getUserProfileAsync } from "./actions";
import { createCustomReducer } from "../../lib/createAsyncSaga";

// const initialState: GithubState = {
//   userProfile: {
//     loading: false,
//     error: null,
//     data: null,
//   },
// };
const actions = { getUserProfileAsync };
const state: GithubState = {
  userProfile: {
    loading: false,
    error: null,
    data: null,
  },
};

const reducer = createCustomReducer(state, actions)
  .handleAction(getUserProfileAsync.success, (state, action) => {
    return {
      ...state,
      userProfile: {
        loading: false,
        error: null,
        data: action.payload,
      },
    };
  })
  .handleAction(getUserProfileAsync.failure, (state, action) => {
    return {
      ...state,
      userProfile: {
        loading: false,
        error: action.payload,
        data: null,
      },
    };
  });

export default reducer;

/*
const github = createReducer<GithubState, GithubAction>(initialState, {
  [GET_USER_PROFILE]: (state) => ({
    ...state,
    userProfile: {
      loading: true,
      error: null,
      data: null,
    },
  }),
  [GET_USER_PROFILE_SUCCESS]: (state, action) => ({
    ...state,
    userProfile: {
      loading: false,
      error: null,
      data: action.payload,
    },
  }),
  [GET_USER_PROFILE_ERROR]: (state, action) => ({
    ...state,
    userProfile: {
      loading: false,
      error: action.payload,
      data: null,
    },
  }),
});

export default github;
*/
