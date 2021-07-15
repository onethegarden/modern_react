import { getUserProfileAsync } from "./actions";
import { getUserProfile, GithubProfile } from "../../api/github";
import { call, put, takeEvery } from "redux-saga/effects";
import { createAsyncSaga } from "../../lib/createAsyncSaga";

//액션 타입은 ReturnType을 통해서 유추, 아직까지 프로미스의 결과값에 대한 타입을
//유추 못하기 때문에 forcetype을 통해 타입 지정해야함

const asyncFetchSaga = createAsyncSaga(getUserProfileAsync, getUserProfile);

export function* githubSaga() {
  yield takeEvery(getUserProfileAsync.request, asyncFetchSaga);
}

/*
function* getUserProfileSaga(
  action: ReturnType<typeof getUserProfileAsync.request>
) {
  try {
    const userProfile: GithubProfile = yield call(
      getUserProfile,
      action.payload
    );
    yield put(getUserProfileAsync.success(userProfile));
  } catch (e) {
    yield put(getUserProfileAsync.failure(e));
  }
}

export function* githubSaga() {
  yield takeEvery(GET_USER_PROFILE, getUserProfileSaga);
}*/
