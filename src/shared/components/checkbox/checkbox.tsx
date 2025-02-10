import React from "react";
import { KeyWithAnyModel } from "../../../utils/model/common-model";

const Checkbox = (props: KeyWithAnyModel) => {
  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.setCheckedStatus(event.target.checked);
  }
  function handleContentClick(event:any) {
    if (event.target.tagName.toUpperCase() !== "A") {
      props.setCheckedStatus(!props.checkedStatus);
    }
  }
  return (
    <div>
      <label>{props.reviewHeader}</label>
      <div className="review__check__body" onClick={handleContentClick}>
        <div className="review__checkbox__input">
          {/* { <input
            type="checkbox"
            name="checkbox"
            checked={props.checkedStatus}
            onChange={handleCheckboxChange}
          />} */}
          <div>
            {props.reviewDescp1}
            <a target="_blank" rel="noreferrer" href={props.reviewDescp2}>
              link
            </a>
            {props.reviewDescp3}
          </div>
        </div>
        <div className="review__check__points">{props.reviewDescpoint1}</div>
        <div className="review__check__points">
          {props.reviewDescpoint2}         
        </div>

        <div>{props.reviewDescp4} </div>
      </div>
    </div>
  );
};

export default Checkbox;

