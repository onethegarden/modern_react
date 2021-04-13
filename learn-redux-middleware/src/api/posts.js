import axios from "axios";

//포스트 목록을 가져오기
export const getPosts = async () => {
  const response = await axios.get("http://localhost:4000/posts");
  return response.data;
};

export const getPostById = async (id) => {
  const response = await axios.get(`http://localhost:4000/posts/${id}`);
  return response.data;
};
