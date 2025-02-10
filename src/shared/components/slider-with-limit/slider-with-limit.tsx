import React, { useEffect, useState } from "react";
import { KeyWithAnyModel } from "../../../utils/model/common-model";
import "./slider-with-limit.scss";
import Slider from "../slider/slider";
import { store } from "../../../utils/store/store";
import { useDispatch } from "react-redux";
import { isFieldUpdate } from "../../../utils/common/change.utils";
import trustBankConstant from "../../../assets/_json/trust-bank.json";
import validateService from "../../../services/validation-service";
import Model from "../model/model";

const SliderWithLimit = (props: KeyWithAnyModel) => {
  const dispatch = useDispatch();
  const trustBank = store.getState().trustBank.trustBank;
  const [showModel, setShowModel] = useState(false);
  const [phoenixDetails, setPhoenixDetails] = useState({ minValue: 0, maxValue: 0, phoenixCustomerLimit: 0, offerApprovedAmount: 0 })
  const [sliderValue, setsliderValue] = useState(0);
  const [availableCredit, setAvailableCredit] = useState(0);

  const updateSliderValue = (value: string) => {
    props.handleFieldDispatch(props.data.logical_field_name, value);
    dispatch(isFieldUpdate(props, value, props.data.logical_field_name));
    setsliderValue(parseInt(value));
    const amount = phoenixDetails.offerApprovedAmount !== 0 ? phoenixDetails.offerApprovedAmount : phoenixDetails.minValue
    if(parseInt(value) <= amount){
      props.handleCallback(props.data, "");
    } else {
      props.handleCallback(props.data, value);
    }
  };

  useEffect(() => {
    setAvailableCredit(phoenixDetails.phoenixCustomerLimit);
    setsliderValue(phoenixDetails.minValue)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[phoenixDetails.phoenixCustomerLimit, phoenixDetails.minValue])

  useEffect(() => {
    if(trustBank){
      let approvedAmount = 0;
      if (
        trustBank.products &&
        trustBank.products.length > 0 &&
        trustBank.products[0].offer_details &&
        trustBank.products[0].offer_details.length > 0
      ) {
        approvedAmount = trustBank.products[0].offer_details[0].approved_amount;
      }
      setAvailableCredit(phoenixDetails.phoenixCustomerLimit);
      setsliderValue(phoenixDetails.minValue)
      setPhoenixDetails({ 
        minValue: parseFloat(trustBank.applicant.minimum_limit_amount_portable_a_1) || 0,
        maxValue: parseFloat(trustBank.applicant.maximum_limit_amount_portable_a_1) || 0,
        phoenixCustomerLimit: parseFloat(trustBank.applicant.phoenix_customer_limit_a_1) || 0,
        offerApprovedAmount: approvedAmount || 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const phinixLimit =
      phoenixDetails.phoenixCustomerLimit -
      (sliderValue -
        (phoenixDetails.offerApprovedAmount !== 0 ? phoenixDetails.offerApprovedAmount : phoenixDetails.minValue));
    setAvailableCredit(phinixLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValue]);

  const getMarks = () => {
    let marks: { [key: string]: any } = {};
    marks[phoenixDetails.minValue] = `S$${phoenixDetails.minValue}`;
    marks[phoenixDetails.maxValue] = `S$${phoenixDetails.maxValue}`;
    return marks;
  };

  const options = {
    min: phoenixDetails.minValue,
    max: phoenixDetails.maxValue,
    step: 500,
    dots: true,
    marks: getMarks(),
  };

  const handlePopupBackButton = () =>{
    setShowModel(false);
  }

  const showInfo = () => {
    setShowModel(true);
  }
  return (
    <>
    <div className="credit__limit__top">
      <div className="credit__limit">
        <div className="credit__limit__head">{trustBankConstant.sliderCreditLimitLabel}  <span className="infoIcon" onClick={showInfo}></span></div>
        <div className="slider__amount">
          S$ {validateService.formateCurrency(sliderValue.toFixed(2))}
        </div>
        <div className="availabe__credit">
          S$ {validateService.formateCurrency(availableCredit.toFixed(2))}{" "}
          <span>{trustBankConstant.sliderAvailabeCrdLmtLabel}</span>
        </div>
      </div>
      <div className="rc-slider">
        <Slider options={options} updateSliderValue={updateSliderValue} />
      </div>
      <div className="credit__limit__note">
        {trustBankConstant.sliderCreditLimitNote}
      </div>
      <a rel="noreferrer" href={process.env.REACT_APP_TRUST_LIMIT_FIND_OUT_MORE} target="_blank" className="find-out-more" >{trustBankConstant.findOutMoreLabel}</a>
      {showModel && (
        <Model name="showTrustInfo" handlebuttonClick={handlePopupBackButton} />
      )}
      </div>
    </>
    
  );
};

export default SliderWithLimit;

