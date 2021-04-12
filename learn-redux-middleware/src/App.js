import React from "react";
import { Route } from "react-router-dom";
import PostListPage from './pages/PostlistPage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <>
    <Route path = "/" component={PostListPage} exact={true}/>
    <Route path = "/:id" component={PostPage}/>
    </>
  );
}

export default App;
