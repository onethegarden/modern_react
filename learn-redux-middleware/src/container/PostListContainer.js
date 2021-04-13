import React, {useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import PostList from '../components/PostList';
import { getPosts} from '../modules/posts';

function PostlistContainer(){
    const {data, loading, error} = useSelector(state => state.posts.posts);
    const dispatch = useDispatch();
    
    //컴포넌트 마운트 후 포스트 목록 요청
    useEffect(()=>{
        //if(data) return ; //데이터가 있을 시 조희 X, 근데 이건 새 리스트를 불러오지 않음
        dispatch(getPosts());
    }, [dispatch, data]);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러발생!</div>;
    if(!data) return null;
    return <PostList posts = {data}/>;
}

export default PostlistContainer;