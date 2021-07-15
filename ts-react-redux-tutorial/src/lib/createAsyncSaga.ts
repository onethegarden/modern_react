import { call, put, ForkEffect } from "redux-saga/effects";
import {
  createAsyncAction as asyncActionCreator,
  AsyncActionCreatorBuilder,
  ActionType,
  createReducer,
} from "typesafe-actions";

//비동기 상황에 대한 이름
export type AsyncAction = {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
};

//사용할 비동기 함수를 타입으로 제작, 프로미스를 래핑
type PromiseCreatorFunction<P, T> = (
  payload: P
) => Promise<T> | (() => Promise<T>);

//비동기 액션 이름을 제작
export const createAsyncAction = (actionName: string): AsyncAction => {
  const asyncTypeAction: string[] = ["_REQUEST", "_SUCCESS", "_FAILURE"];

  return {
    REQUEST: actionName + asyncTypeAction[0],
    SUCCESS: actionName + asyncTypeAction[1],
    FAILURE: actionName + asyncTypeAction[2],
  };
};

//실제로 액션을 제작
export const createActionEntity = <R, S, F>(asyncAction: AsyncAction) =>
  asyncActionCreator(
    asyncAction.REQUEST,
    asyncAction.SUCCESS,
    asyncAction.FAILURE
  )<R, S, F>();

//saga를 만듦
//parameter : 액션, 비동기요청할 함수, 성공함수, 실패함수
export function createAsyncSaga<
  RequestType,
  RequestPayload,
  SuccessType,
  SuccessPayload,
  FailureType,
  FailurePayload
>(
  asyncAction: AsyncActionCreatorBuilder<
    [RequestType, [RequestPayload, undefined]],
    [SuccessType, [SuccessPayload, undefined]],
    [FailureType, [FailurePayload, undefined]]
  >,
  asyncFunction: PromiseCreatorFunction<RequestPayload, SuccessPayload>,
  successFunc?: any,
  failureFunc?: any
) {
  return function* saga(action: ReturnType<typeof asyncAction.request>) {
    try {
      const result: SuccessPayload = yield call(
        asyncFunction,
        (action as any).payload
      );
      yield put(asyncAction.success(result));
      if (successFunc) {
        yield call(successFunc, result);
      }
    } catch (err) {
      yield put(asyncAction.failure(err));
      if (failureFunc) {
        yield call(successFunc, err);
      }
    }
  };
}

//리듀서를 만들어주는 함수, state와 action에 대한 타입 생성하지 않아도 됨
export function createCustomReducer<S, A extends { [key: string]: any }>(
  state: S,
  action: A
) {
  type Actions = ActionType<typeof action>;
  type States = typeof state;

  return createReducer<States, Actions>(state);
}

//saga를 모듈처럼 사용하게 도와주는 함수
export const combineSagas = (param: { [key: string]: ForkEffect<never>[] }) =>
  function* () {
    const targetSagas = Object.values(param).flat();

    for (let i = 0; i < targetSagas.length; i++) {
      yield targetSagas[i];
    }
  };
