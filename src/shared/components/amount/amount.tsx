import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fieldIdAppend,
  isFieldUpdate,
  getUrl,
  isFieldValueUpdate,
  fieldError
} from "../../../utils/common/change.utils";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import "./amount.scss";
import validateService from "../../../services/validation-service";
import loanDetailsConst from "../../../assets/_json/loan-details.json";

const Amount = (props: KeyWithAnyModel) => {
  const [errors, setErrors] = useState(false);
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const dispatch = useDispatch();
  const [defaultValue, setDefaultValue] = useState("");
  const userInputSelector = useSelector(
    (state: StoreModel) => state.stages.userInput
  );
  const fieldErrorSelector = useSelector(
    (state: StoreModel) => state.fielderror.error
  );

  const changeHandler = (
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDefaultValue(event.target.value);
    if(props.data.logical_field_name === 'required_annual_income'){
      if(parseInt(event.target.value) >= loanDetailsConst.minAnnualIncome){
        props.handleCallback(props.data, event.target.value);
        dispatch(isFieldUpdate(props, event.target.value, props.data.logical_field_name));
        setErrors(!event.target.validity.valid);
      } else {
        props.handleCallback(props.data, "");
        setErrors(true);
      }
    } else {
      props.handleCallback(props.data, event.target.value);
      setErrors(!event.target.validity.valid);
    }
    //setErrors(!event.target.validity.valid);
  };

  useEffect(() => {
    if (
      stageSelector &&
      stageSelector[0] &&
      stageSelector[0].stageInfo &&
      stageSelector[0].stageInfo.applicants
    ) {
      let value = getStoreValue();

      if(props.data.logical_field_name === "required_annual_income" && !value){
        value = stageSelector[0].stageInfo.applicants["annual_income_a_1"];
      }

      if(value && parseFloat(value) < loanDetailsConst.minAnnualIncome){
        value = loanDetailsConst.minAnnualIncome.toString();
      }
     
      let formattedValue = formateCurrency(value);
      setDefaultValue(formattedValue);
      dispatch(isFieldUpdate(props, value, props.data.logical_field_name));
      props.handleCallback(props.data, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bindHandler = (fieldName: string, event: any) => {
    if (event.target.validity.valid) {
      let fieldValue = event.target.value;
      if (props.data.logical_field_name === 'required_annual_income' && fieldValue && parseFloat(fieldValue) < loanDetailsConst.minAnnualIncome) {
        fieldValue = loanDetailsConst.minAnnualIncome.toString();
        setErrors(false);
      }
      const formatedValue = formateCurrency(fieldValue);
      setDefaultValue(formatedValue);
      dispatch(isFieldUpdate(props, fieldValue, fieldName));
      dispatch(isFieldValueUpdate(props, stageSelector, fieldValue));
      props.handleCallback(props.data, fieldValue);
    }
  };

  const formateCurrency = (amount: string) => {
    if (amount) {
      amount = amount.replaceAll(',','');
      let formatedAmount = parseInt(amount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });
      formatedAmount = formatedAmount.replaceAll("$", "").replaceAll(".00", "");
      return formatedAmount;
    } else {
      return amount;
    }
  };

  const allowOnlyNumber = (event: any, fieldName: string) => {
    validateService.allowOnlyCharacter(event, fieldName);
  };

  const onFocus = (
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if(event.target.value){
      setDefaultValue(event.target.value.replaceAll(',',''));
    }
  };
  useEffect(() => {
    if(props.data.logical_field_name === "required_annual_income"){
      if(userInputSelector.applicants.required_annual_income_a_1 >= loanDetailsConst.minAnnualIncome){
        props.handleCallback(props.data, userInputSelector.applicants.required_annual_income_a_1);
      } else {
        props.handleCallback(props.data, "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userInputSelector.applicants.required_annual_income_a_1])

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
        console.log(getUrl.getUpdatedStage().updatedStageInputs[stageIndex]);
        console.log(fieldIdAppend(props))
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
    setErrors(fieldError(fieldErrorSelector, props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldErrorSelector]);

  return (
    <>
      <div className="text">
        <label htmlFor={props.data.logical_field_name}>
          {props.data.rwb_label_name}
        </label>
        <input
          type={props.data.type}
          name={props.data.logical_field_name}
          aria-label={props.data.logical_field_name}
          id={fieldIdAppend(props)}
          placeholder={props.data.rwb_label_name}
          value={defaultValue}
          minLength={props.data.min_length}
          maxLength={props.data.length}
          onChange={changeHandler.bind(this, props.data.logical_field_name)}
          onBlur={bindHandler.bind(this, props.data.logical_field_name)}
          onKeyPress={(event) =>
            allowOnlyNumber(event, props.data.logical_field_name)
          }
          onFocus={onFocus.bind(this, props.data.logical_field_name)}
        />
        {errors && (
        <div className="error-msg">
          Please enter {props.data.rwb_label_name}
        </div>
      )}
      </div>
    </>
  );
};

export default Amount;

