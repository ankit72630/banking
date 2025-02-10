import React from "react";
import "./popup-model.scss";

const PopupModel = (props: any) => {
  return (
    <>
      {props.displayPopup && (
        <div
          className={`${
            props.timeoutClass ? props.timeoutClass : ""
          } popup-container`}
        >
          {props.children}
        </div>
      )}
    </>
  );
};

export default PopupModel;

