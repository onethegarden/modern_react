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
export const handleAsyncActions = (type, key) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
    return (state, action) => {
        switch(action.type){
            case type:
                return {
                    ...state,
                    [key] : reducerUtils.loading()
                };
            case SUCCESS:
                return {
                    ...state,
                    [key]: reducerUtils.success(action.payload)
                }
            case ERROR:
                return{
                    ...state,
                    error: reducerUtils.error(action.payload)
                }
            default:
                return state;
        }
    }
}
