import React, { useEffect, useState } from "react";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import "./button-group.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fieldIdAppend,
  isFieldUpdate,
  getUrl,
  isFieldValueUpdate,
} from "../../../utils/common/change.utils";
import LoanDetailsInfo from "../loan-details-info/loan-details-info";
import loanDetailsConst from "../../../assets/_json/loan-details.json";

const ButtonGroup = (props: KeyWithAnyModel) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([{}]);
  const userInputSelector = useSelector(
    (state: StoreModel) => state.stages.userInput
  );
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const lastStageSelector = useSelector((state: StoreModel) => state.stages.lastStageId);

  useEffect(() => {
    if (props.data.logical_field_name === "loan_tenor") {
      const tenureOptions  = stageSelector[0].stageInfo.products[0].product_type === '280' ? loanDetailsConst.tenureOptions : loanDetailsConst.tenureOptionsCCFT;
      setOptions(tenureOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStoreValue = () => {
    if (
      stageSelector &&
      stageSelector[0] &&
      stageSelector[0].stageInfo &&
      stageSelector[0].stageInfo.applicants
    ) {
      const userInputResponse =
        userInputSelector.applicants[fieldIdAppend(props)];

      const stageIndex = getUrl
        .getUpdatedStage()
        .updatedStageInputs.findIndex(
          (ref: any) => ref && ref.stageId === stageSelector[0].stageId
        );
      let updatedVal = null;
      if (stageIndex > -1) {
        updatedVal =
          getUrl.getUpdatedStage().updatedStageInputs[stageIndex].applicants[
            fieldIdAppend(props)
          ];
      }

      let fieldValue = "";
      if (updatedVal) {
        fieldValue = updatedVal;
      } else if (userInputResponse) {
        fieldValue = userInputResponse;
      } else if (
        stageSelector[0].stageInfo.applicants[fieldIdAppend(props)] &&
        updatedVal !== ""
      ) {
        fieldValue =
          stageSelector[0].stageInfo.applicants[fieldIdAppend(props)];
      }
      return fieldValue;
    }
    return "";
  };

  useEffect(() => {
    if(props.data.logical_field_name === "loan_tenor" && userInputSelector.applicants.loan_tenor_a_1){
      props.handleCallback(props.data, userInputSelector.applicants.loan_tenor_a_1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userInputSelector.applicants.loan_tenor_a_1])

  useEffect(() => {
    if (userInputSelector.applicants.required_annual_income_a_1) {
      if (props.data.logical_field_name === "loan_tenor") {
        const tenureOptions = stageSelector[0].stageInfo.products[0].product_type === '280' ? loanDetailsConst.tenureOptions : loanDetailsConst.tenureOptionsCCFT;
        const value = getStoreValue();
        if (value && compareOldAnnualIncome()) {
          props.handleFieldDispatch(props.data.logical_field_name, value);
          dispatch(isFieldUpdate(props, value, props.data.logical_field_name));
          props.handleCallback(props.data, value);
        } else {
          props.handleFieldDispatch(props.data.logical_field_name, tenureOptions[0].value);
          dispatch(isFieldUpdate(props, tenureOptions[0].value, props.data.logical_field_name));
          props.handleCallback(props.data, tenureOptions[0].value);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInputSelector.applicants.required_annual_income_a_1]);

  const updateTenureValue = (value: string) => {
    dispatch(isFieldUpdate(props, value, props.data.logical_field_name));
    dispatch(isFieldValueUpdate(props, stageSelector, value));
    props.handleCallback(props.data, value);
  };

  const compareOldAnnualIncome = () => {
    if (lastStageSelector === "bd-3" || lastStageSelector === "doc" || lastStageSelector === "ad-2") {
      if (stageSelector &&
        stageSelector[0] &&
        stageSelector[0].stageInfo &&
        stageSelector[0].stageInfo.applicants) {
          return (userInputSelector.applicants.required_annual_income_a_1 === stageSelector[0].stageInfo.applicants.required_annual_income_a_1);
      }
    } else if (lastStageSelector === "ssf-1" || lastStageSelector === "ssf-2" || lastStageSelector === "bd-1") {
      const stageIndex = getUrl
        .getUpdatedStage()
        .updatedStageInputs.findIndex(
          (ref: any) => ref && ref.stageId === stageSelector[0].stageId
        );
      let updatedVal = null;
      if (stageIndex > -1) {
        updatedVal =
          getUrl.getUpdatedStage().updatedStageInputs[stageIndex].applicants['required_annual_income_a_1'];
      }
      return (userInputSelector.applicants.required_annual_income_a_1 === updatedVal);
    } else {
      return true
    }
  }


  return (
    <>
    <div>
      <div className="button-group" id={fieldIdAppend(props)}>
        <label className="label" htmlFor={props.data.logical_field_name}>
          {props.data.rwb_label_name}
        </label>
        <div className="buttons">
          {options.map(
            (btn: KeyWithAnyModel) => {
              return(
                <div className={`tenure-button ${btn.value === userInputSelector.applicants.loan_tenor_a_1 ? 'active' : ''}`}  onClick={()=> updateTenureValue(btn.value)}><span>{btn.label}</span></div>
              )
          })}
         </div>
      </div>
      </div>
      {props.data.logical_field_name === "loan_tenor" && <LoanDetailsInfo />}
    </>
  );
};
export default ButtonGroup;

