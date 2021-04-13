import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../components/Post";
import { getPost, goToHome } from "../modules/posts";

function PostContainer({ postId }) {
  const { data, error, loading } = useSelector(
    (state) => state.posts.post[postId]
  ) || {
    loading: false,
    data: null,
    error: null,
  }; //아예 데이터 존재하지 않을때가 있으므로, 비구조화 할당이 오류가 나지 않도록
  const dispatch = useDispatch();

  useEffect(() => {
    //if (data) return; //포스트가 존재하면 아예 요청 x
    dispatch(getPost(postId));
  }, [postId, dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러발생!</div>;
  if (!data) return null;
  return (
    <>
      <button onClick={() => dispatch(goToHome())}>홈으로</button>
      <Post post={data} />
    </>
  );
}
export default PostContainer;
