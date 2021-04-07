import User from "./User";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  const user = [
    {
      id: 1,
      username: "jungwon",
    },
    {
      id: 2,
      username: "2번친구",
    },
  ];
  return (
    <ErrorBoundary>
      <User users={user}/>
    </ErrorBoundary>
  );
}

export default App;
