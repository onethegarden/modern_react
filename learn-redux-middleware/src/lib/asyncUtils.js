import { call, put } from "redux-saga/effects";

//promise를 기다렸다가 결과를 디스패치하는 사가
export const createPromiseSaga = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return function* saga(action) {
    try {
      //재사용성을 위하여 promiseCreator의 파라미터엔 payload값을 넣음
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload });
    } catch (e) {
      yield put({ type: ERROR, error: true, payload: e });
    }
  };
};
//특정 id의 데이터 조회 용도로 사용하는 사가
//API 호출 시 파라미터는 action.payload를 넣고
//id 값을 action.meta로 설정
export const createPromiseSagaById = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return function* saga(action) {
    const id = action.meta;
    try {
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      yield put({ type: ERROR, error: e, meta: id });
    }
  };
};

/**
 * thunk 관련 함수
 */
//Promise 기반한 thunk 만들어주는 함수
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  //이 함수는 promisecreator가 하나의 파라미터만 받는다는 전제하에 작성
  return (param) => async (dispatch) => {
    //요청시작
    dispatch({ type, param });
    try {
      //결과물을 payload로 통일
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload }); //성공
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true });
    }
  };
};

//리듀서에서 사용할 수 있는 여러 유틸 함수들
export const reducerUtils = {
  //초기 상태, 초기data값은 기본적으로 null, 바꿀 수도 있음
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null,
  }),
  //로딩중 상태, prevState 의 경우 기본은 null,
  //따로 값을 지정하면 null로 바꾸지 않고 다른 값 유지
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null,
  }),
  //성공상태
  success: (payload) => ({
    loading: false,
    data: payload,
    error: null,
  }),
  //실패상태
  error: (error) => ({
    loading: false,
    data: null,
    error: error,
  }),
};

//비동기 관련 액션들을 처리하는 리듀서
//type은 액션의 타입, key는 상태의 key(posts, post)
//keydata라는 파라미터를 추가하여 만약 이 값이 true로 주어지면 로딩을 할 때에도 데이터를 유지하도록 함
export const handleAsyncActions = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading(keepData ? state[key].data : null), // keydata이용
        };
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload),
        };
      case ERROR:
        return {
          ...state,
          error: reducerUtils.error(action.payload),
        };
      default:
        return state;
    }
  };
};

/**
 * thunk 관련 함수
 */
//특정 id를 처리하는 thunk생성함수
const defaultIdSelector = (param) => param;
export const createPromiseThunkById = (
  type,
  promiseCreator,
  //파라미터에서 id를 어떻게 선택할지 정의하는 함수
  // 기본 값으로는 파라미터를 그대로 id로 사용합니다.
  // 하지만 만약 파라미터가 { id: 1, details: true } 이런 형태라면
  // idSelector 를 param => param.id 이런식으로 설정 할 수 있곘죠.
  idSelector = defaultIdSelector
) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (param) => async (dispatch) => {
    const id = idSelector(param);
    dispatch({ type, meta: id });
    try {
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      dispatch({ type: ERROR, error: true, payload: e, meta: id });
    }
  };
};

export const handleAsyncActionsById = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    const id = action.meta;
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.loading(
              //state[key][id]가 만들어져 있지 않을수도 있으니 유효성 먼저 검사
              keepData ? state[key][id] && state[key][id].data : null
            ),
          },
        };
      case SUCCESS:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.success(action.payload),
          },
        };
      case ERROR:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.error(action.payload),
          },
        };
      default:
        return state;
    }
  };
};
