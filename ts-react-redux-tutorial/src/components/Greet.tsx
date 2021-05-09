import React, { ChangeEvent, FormEvent, useState } from "react";

type GreetProps = {
  name: string;
  greet: boolean;
  onAddName: (name: string) => void;
  onRemoveName: () => void;
  onToggleGreet: () => void;
};

function Greet({
  name,
  greet,
  onAddName,
  onRemoveName,
  onToggleGreet,
}: GreetProps) {
  const [value, setValue] = useState("");
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddName(value);
    setValue("");
  };
  return (
    <>
      <div>
        {name === "" ? (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              onChange={onChange}
              placeholder="이름을 입력해주세요!"
            />
            <button type="submit">등록</button>
          </form>
        ) : (
          <div>
            <h2>hello! {name}</h2>
            <p onClick={onRemoveName}>X</p>
          </div>
        )}
      </div>
      <div>
        {greet ? <h2>Nice to meet you!</h2> : ""}
        <button
          type="button"
          onClick={(event: any) => {
            onToggleGreet();
          }}
        >
          greet
        </button>
      </div>
    </>
  );
}

export default Greet;
