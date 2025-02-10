import React, { useEffect, useState } from "react";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import "./slider-with-currency.scss";
import Slider from "../slider/slider";
import { useDispatch, useSelector } from "react-redux";
import {
  fieldIdAppend,
  isFieldUpdate,
  getUrl,
  isFieldValueUpdate,
} from "../../../utils/common/change.utils";
import validateService from "../../../services/validation-service";
import loanDetailsConst from "../../../assets/_json/loan-details.json";
import Model from "../model/model";

const SliderWithCurrency = (props: KeyWithAnyModel) => {
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const lastStageSelector = useSelector((state: StoreModel) => state.stages.lastStageId);
  const [value, setValue] = useState('');
  const [options, setOptions] = useState({});
  const [max, setMax] = useState("");
  const [min, setMin] = useState("");
  const dispatch = useDispatch();
  const currency = "SGD";
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const userInputSelector = useSelector(
    (state: StoreModel) => state.stages.userInput
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const value = getStoreValue();
    if (props.data.logical_field_name === "preferred_credit_limit" || props.data.logical_field_name === "preferred_credit_limit_etc") {
      setOptions(loanDetailsConst.preferredCreditLimitOptions);
      setMin(validateService.formateCurrency(loanDetailsConst.preferredCreditLimitOptions.min.toString()))
      setMax(validateService.formateCurrency(loanDetailsConst.preferredCreditLimitOptions.max.toString()))
      if(!value){
        updateSliderValue(loanDetailsConst.preferredCreditLimitOptions.min.toString());
      } else {
        updateSliderValue(value);
      }
    } else if (props.data.logical_field_name === "Transfer_amount") {
      setOptions(loanDetailsConst.transferAmountSliderOptions);
      setMin(validateService.formateCurrency(loanDetailsConst.transferAmountSliderOptions.min.toString()))
      const max = (loanDetailsConst.transferAmountSliderOptions.max).toString();
      setMax(validateService.formateCurrency(max))
      if(!value){
        updateSliderValue(max);
      } else {
        updateSliderValue(value);
      }
    }
     else {
      updateLoanAmountSlider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if(userInputSelector.applicants.required_annual_income_a_1){
          updateLoanAmountSlider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInputSelector.applicants.required_annual_income_a_1]);

  useEffect(() => {
    if(props.data.logical_field_name === "Transfer_amount" && userInputSelector.applicants.Transfer_amount_a_1){
      props.handleCallback(props.data, userInputSelector.applicants.Transfer_amount_a_1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userInputSelector.applicants.Transfer_amount_a_1])

  const updateLoanAmountSlider= ()=>{
    if (props.data.logical_field_name === "required_loan_amount") {
      let annualIncome = parseInt(
        userInputSelector.applicants.required_annual_income_a_1 ? userInputSelector.applicants.required_annual_income_a_1.replace(',','')  : 0
      );
      let factor = 0;
      let proposedMaxLoanAmount = 0;
      switch (true) {
        case annualIncome <= 29999:
          factor = 2;
          proposedMaxLoanAmount =
            Math.floor(annualIncome / 12 / 100) * 100 * factor;
          break;
        case annualIncome >= 30000 && annualIncome <= 119999:
          factor = 4;
          proposedMaxLoanAmount =
            Math.floor(annualIncome / 12 / 100) * 100 * factor;
          proposedMaxLoanAmount =
            proposedMaxLoanAmount >= 250000 ? 250000 : proposedMaxLoanAmount;
          break;
        case annualIncome >= 120000:
          factor = 8;
          proposedMaxLoanAmount =
            Math.floor(annualIncome / 12 / 100) * 100 * factor;
          proposedMaxLoanAmount =
            proposedMaxLoanAmount >= 250000 ? 250000 : proposedMaxLoanAmount;
          break;
      }
      let min = 0;
      if(proposedMaxLoanAmount > 0){
        min = loanDetailsConst.requireLoanOptions.min;
      }
      if (min > proposedMaxLoanAmount) {
        min = 0;
      }
      setOptions({
        min: min,
        max: proposedMaxLoanAmount,
        step: loanDetailsConst.requireLoanOptions.step,
      });
      setMin(validateService.formateCurrency(min.toString()))
      setMax(validateService.formateCurrency(proposedMaxLoanAmount.toString()))
      const value = getStoreValue();
      if(value && value !== '0' && compareOldAnnualIncome()){
        updateSliderValue(value);
      } else if(proposedMaxLoanAmount > 0) {
        updateSliderValue(proposedMaxLoanAmount.toString());
      }
    } 
  }

  const compareOldAnnualIncome = () => {
    if (lastStageSelector === "bd-3" || lastStageSelector === "doc" || lastStageSelector === "ad-2") {
      if (stageSelector &&
        stageSelector[0] &&
        stageSelector[0].stageInfo &&
        stageSelector[0].stageInfo.applicants) {
          return (userInputSelector.applicants.required_annual_income_a_1 === stageSelector[0].stageInfo.applicants.required_annual_income_a_1);
      }
    } else if (lastStageSelector === "ssf-1" || lastStageSelector === "ssf-2" || lastStageSelector === "bd-1" || lastStageSelector === "bd-2") {
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

  // const getLastAnnualIncome = () => {
  //   const stageIndex = getUrl
  //       .getUpdatedStage()
  //       .updatedStageInputs.findIndex(
  //         (ref: any) => ref && ref.stageId === stageSelector[0].stageId
  //       );
  //     let updatedVal = null;
  //     if (stageIndex > -1) {
  //       updatedVal =
  //         getUrl.getUpdatedStage().updatedStageInputs[stageIndex].applicants['required_annual_income_a_1'];
  //     }
  //     return updatedVal;
  // }

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
   
  }

  useEffect(() => {
    if(max && props.data.logical_field_name === "required_loan_amount"){
      updateSliderValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max]);

  const updateSliderValue = (value: string) => {
    let nonFormattedValue = value.replace(",","").replace(",","")
    dispatch(isFieldUpdate(props, nonFormattedValue, props.data.logical_field_name));
    dispatch(isFieldValueUpdate(props, stageSelector, nonFormattedValue));
   // props.handleCallback(props.data, nonFormattedValue);
    if (props.data.logical_field_name === "required_loan_amount") {
      setValue(validateService.formateCurrency(value));
      setError("");
      if (!nonFormattedValue || (nonFormattedValue && parseInt(nonFormattedValue) < 1000)) {
        setError('The minimum loan amount is SGD 1000')
        props.handleCallback(props.data, "");
      } else if (nonFormattedValue && parseInt(nonFormattedValue) > parseInt(max.replace(",", ""))) {
        setError('Enter a value within the maximum eligible loan amount specified.')
        props.handleCallback(props.data, "");
      } else {
        props.handleCallback(props.data, nonFormattedValue);
      }
    } else {
      setValue(value);
      props.handleCallback(props.data, nonFormattedValue);
    }
  };

  const onBlur = (value: string) => {
    if (!value) {
      setValue('0');
    } else {
      setValue(validateService.formateCurrency(value));
    }
  }

  const onFocus = (value: string) => { 
    if(value){
      setValue(value.replace(",","").replace(",",""));
    } 
  }

  const handlePopupBackButton = () => {
    setShowInfoPopup(false);
  };
  
  return (
    <>
      <div className="slider-with-currency">
        <div className="slider__header">
          <label htmlFor={props.data.logical_field_name}>
            {props.data.rwb_label_name}
          </label>
          {props.data.info_tooltips === "Yes" &&
            <span className="info-tooltip" onClick={() => setShowInfoPopup(true)}></span>
          }
        </div>
        {
          props.data.logical_field_name === "required_loan_amount" ? 
        
        (<div className="slider-container loan-container">
          <div className="slider">
            <div className="slider-currency">{currency}</div>
                <div className="slider-value">
                  <div className="loan-value">
                    <input
                      type="text"
                      maxLength={10}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }
                      }
                      onChange={(event) => updateSliderValue(event.target.value)}
                      onBlur={(event) => onBlur(event.target.value)}
                      onFocus={(event) => onFocus(event.target.value)}
                      value={value}
                    >
                    </input>
                  </div>
                </div>
          </div>
          
          <div className="max-eligible-amoun">
            <div className="min-eligible-amount">Maximum eligible loan amount</div>
            <div className="max-eligible-amount">{currency} {max}</div>
          </div>
        </div>)
          :
         (<div className="slider-container">
          <div className="slider">
            <div className="slider-currency">{currency}</div>
            <div className="slider-value">
              {validateService.formateCurrency(value)}
            </div>
          </div>
          <Slider
            options={options}
            value={value}
            updateSliderValue={updateSliderValue}
            id={fieldIdAppend(props)}
          />
          <div className="max-eligible-amoun">
            <div className="min-eligible-amount">{currency} {min}</div>
            <div className="max-eligible-amount">{currency} {max}</div>
          </div>
        </div>
         )
        }
      </div>
      {error && <span className="error-msg">{error}</span>}
      {showInfoPopup && (
        <Model name={props.data.logical_field_name} handlebuttonClick={handlePopupBackButton} />
      )}
    </>
  );
};
export default SliderWithCurrency;

