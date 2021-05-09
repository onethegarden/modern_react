import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../modules";
import { addName, removeName, toggleGreet } from "../modules/greet";
import Greet from "../components/Greet";

function GreetContainer() {
  const { name, greet } = useSelector((state: RootState) => state.greet);
  const dispatch = useDispatch();

  const onAddName = (name: string) => {
    dispatch(addName(name));
  };

  const onRemoveName = () => {
    dispatch(removeName());
  };

  const onToggleGreet = () => {
    dispatch(toggleGreet());
  };
  return (
    <Greet
      name={name}
      greet={greet}
      onAddName={onAddName}
      onRemoveName={onRemoveName}
      onToggleGreet={onToggleGreet}
    />
  );
}

export default GreetContainer;
