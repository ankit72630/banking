import React from "react";
import "./error.scss";

const Error = () => {
  return (
    <div className="error">
      <div className="error-container">
        <div className="waring-icon">
          <svg
            width="51"
            height="50"
            viewBox="0 0 51 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.5 43.75C35.8553 43.75 44.25 35.3553 44.25 25C44.25 14.6447 35.8553 6.25 25.5 6.25C15.1447 6.25 6.75 14.6447 6.75 25C6.75 35.3553 15.1447 43.75 25.5 43.75Z"
              stroke="#D0021B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M31.75 18.75L19.25 31.25"
              stroke="#D0021B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M31.75 31.25L19.25 18.75"
              stroke="#D0021B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="error-info">
          <div className="error-info__head">
            Sorry, we've hit a technical error
          </div>
          <div className="error-info__desc">
            Please try again. <br />
            If problem still persist, please reach out to your Business Banking
            RM.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;

