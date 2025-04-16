import React from "react";
import "../registration.css";
interface IInputElement {
  label: string;
  name: string;
  type: string;
  value?: string;
  options?: string[];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}
export default function InputElement(props: IInputElement) {
  return (
    <div className="form-group">
      {props.type !== "radio" && props.type !== "select" ? (
        <>
          <label>{props.label}</label>
          <div>
            <input
              // style={{ width: "12px" , background:'blue' }}
              className="input-box"
              type={props.type}
              name={props.name}
              value={props.value}
              onChange={props.onChange}
            />
          </div>
        </>
      ) : null}
      {props.type === "radio" ? (
        <>
          <label>{props.label}</label>
          <div className="gender-group" >
            <input
              type="radio"
              name="gender"
              value="M"
              onChange={props.onChange}
            />
            M
            <input
              type="radio"
              name="gender"
              value="F"
              onChange={props.onChange}
            />
            F
          </div>
        </>
      ) : null}
      {props.type === "select" ? (
        <>
          <label>{props.label}</label>
          <select name={props.name} onChange={props.onChange}>
            {props.options?.map((option) => {
              return <option value={option}>{option}</option>;
            })}
          </select>
        </>
      ) : null}
    </div>
  );
}
