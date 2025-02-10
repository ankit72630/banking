import { useDispatch, useSelector } from "react-redux";
import "./banca-details.scss";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useEffect, useState } from "react";
import TooltipModel from "../model/tooltip-model";
import { checkProductDetails } from "../../../services/common-service";
import { isFieldUpdate } from "../../../utils/common/change.utils";
import parse from 'html-react-parser';

export const BancaDetails = (props: any) => {
  const insuranceInformation = props.insuranceInformation;
  const [updatedInsuranceInformation, setUpdatedInsuranceInformation] = useState({
    ...insuranceInformation,
    CustomerConsent: insuranceInformation.CustomerConsent.map((customerConsent: any, index: number) => ({
      ...customerConsent,
      codeValue: index === 0 ? 'Y' : 'N',
      checked: false   
  }))
  });

  const [selectedLov, setselectedLov] = useState('');
  //const [isHideTooltipIcon, setIsHideTooltipIcon] = useState<boolean>(true);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const updatedStageInputsSelector = useSelector((state: StoreModel) => state.stages.updatedStageInputs);
  const userInputSelector = useSelector((state: StoreModel) => state.stages.userInput);
  const applicantsSelector = useSelector((_state: StoreModel) => stageSelector[0].stageInfo.applicants);
  const dispatch = useDispatch();

  useEffect(() => {
      let userUpdateValue = null;
      const userUpdateStageSelector = updatedStageInputsSelector.findIndex(
        (ref: any) => ref && ref.stageId === stageSelector[0].stageId
      );
      if (userUpdateStageSelector > -1) {
        userUpdateValue = updatedStageInputsSelector[userUpdateStageSelector].applicants["insurance_consent_" + updatedInsuranceInformation.ProductDetailCode + "_a_1"];
      }
      const userInputResponse = userInputSelector.applicants["insurance_consent_" + updatedInsuranceInformation.ProductDetailCode + "_a_1"];

      const fieldValue =
        userInputResponse ||
        userUpdateValue ||
        stageSelector[0].stageInfo.applicants["insurance_consent_" + updatedInsuranceInformation.ProductDetailCode + "_a_1"];

      setselectedLov(fieldValue);
      setUpdatedInsuranceInformation({
        ...updatedInsuranceInformation,
        CustomerConsent: updatedInsuranceInformation.CustomerConsent.map((customerConsent: any, index: number) => ({
          ...customerConsent,
          checked: index === 0 ? (fieldValue === 'Y' ? true : false) : (fieldValue === 'N' ? true : false)      
        }))
      });

      /*setIsHideTooltipIcon(
        checkProductDetails(stageSelector[0].stageInfo.products)
      );*/
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const logicalFieldName = "insurance_consent_" + updatedInsuranceInformation.ProductDetailCode;
    const fieldData = { logical_field_name: logicalFieldName };
    dispatch(isFieldUpdate(props, selectedLov, logicalFieldName));
    props.handleCallback(fieldData, selectedLov);
    props.handleFieldDispatch(logicalFieldName, selectedLov);
  }, [selectedLov]);

  const userInput = (selectedValue: any) => {
    setUpdatedInsuranceInformation({
      ...updatedInsuranceInformation,
      CustomerConsent: updatedInsuranceInformation.CustomerConsent.map((customerConsent: any, index: number) => ({
        ...customerConsent,
        checked: index === 0 ? (selectedValue === 'Y' ? true : false) : (selectedValue === 'N' ? true : false)      
      }))
    });
    setselectedLov(selectedValue);
  };

  
  return (
    <>
      <div className="field__group">
        <div className="banca__details">
          <div className="banca__body">
            <div className="banca__points">
              <div className="banca__points__left">
                <div className="banca__point__icon">+</div>
                {updatedInsuranceInformation.ProductNameLabel}
              </div>
              <div className="banca__points__right">
                <div className="banca__dollar">{updatedInsuranceInformation.Premium.InsurancePremiumCurrency}{updatedInsuranceInformation.Premium.InsurancePremiumAmount}</div>
                <div className="banca__month">
                  {" "}
                  {updatedInsuranceInformation.Premium.InsurancePremiumDuration}
                </div>
                <div className="banca__gst">{updatedInsuranceInformation.Premium.InsuranceGST}</div>
              </div>
            </div>
            <div className="banca__list">
              {updatedInsuranceInformation["BriefDesc"].map(
                (feature: string, i: number) => {
                  return (
                    <div className="banca__list__desc" key={`feature${i}`}>
                      {feature}
                    </div>
                  );
                }
              )}
            </div>
            <div className="banca__benefits">
              <div className="banca__benefits__header">
                {updatedInsuranceInformation.Benifits.subTitle}
              </div>
              {updatedInsuranceInformation["Benifits"]["bulletPoints"].map(
                (bulletPoints: string, i: number) => {
                  return (
                    <div className="banca__info">
                      <ul>
                        <li>{parse(bulletPoints)}</li>
                      </ul>
                    </div>
                  );
                }
              )}
              <div className="banca__benefits__header">
                {updatedInsuranceInformation.Exclusions.subTitle}
              </div>
              {updatedInsuranceInformation["Exclusions"]["bulletPoints"].map(
                (bulletPoints: string, i: number) => {
                  return (
                    <div className="banca__info">
                      <ul>
                        <li>{parse(bulletPoints)}</li>
                      </ul>
                    </div>
                  );
                }
              )}
              <div className="banca__radiobutton">
                {updatedInsuranceInformation["CustomerConsent"].map(
                  (customerConsent: KeyWithAnyModel, i: number) => {
                    return (
                      <>
                        <div className="banca__radio__label">
                          {i === 0 && (
                            <>
                              <div className="errorLabel">
                                {'Please choose if insurance is needed or not'}
                              </div>
                            </>
                          )}
                        </div>
                        {i === 0 && (
                          <>
                            <div className="radioWithLabel" id={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}`} key={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}_Y`}>
                              <div className="body__app-desc">
                                <label htmlFor={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}_Y`}>
                                  <div className="banca__radio__input">
                                    <input type="radio" name={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}`} id={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}_Y`}
                                      onClick={() => {
                                        props.validateInsurance(
                                          "insurance_consent_" + updatedInsuranceInformation.ProductDetailCode,
                                          'Y',
                                          Event
                                        );
                                        userInput('Y');
                                        // eslint-disable-next-line no-self-compare
                                      }}
                                      onChange={() => {
                                        //do nothing
                                      }}
                                      checked={customerConsent.checked}
                                    />
                                  </div>
                                  <span>
                                    {customerConsent.title}
                                  </span>
                                </label>
                              </div>
                              {(
                                <div className="tool-tip__icon">
                                  <div className="tool-tip" onClick={(event) => setIsTooltipOpen(isTooltipOpen ? false : true)}></div>
                                </div>
                              )}
                              <div className="banca__benefits__header">
                                  {customerConsent.subTitle}
                              </div>
                              {customerConsent["bulletPoints"].map(
                                (bulletPoints: string, bulletPointIndex: number) => {
                                  return (
                                    <div className="banca__info">
                                      <ul>
                                        <li>{parse(bulletPoints)}</li>
                                      </ul>
                                    </div>
                                  );
                                }
                              )}
                              {isTooltipOpen && (
                                <TooltipModel updatedInsuranceInformation={updatedInsuranceInformation} isTooltipOpen={isTooltipOpen} data="banca" setIsTooltipOpen={setIsTooltipOpen}/>
                              )}
                            </div>
                          </>
                        )}
                        {i === 1 && (
                          <>
                            <div className="radioWithLabel" id={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}`} key={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}_N`}>
                              <div className="body__app-desc">
                                <label htmlFor={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}_N`}>
                                  <div className="banca__radio__input">
                                    <input type="radio" name={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}`} id={`insurance_consent_${updatedInsuranceInformation.ProductDetailCode}_N`}
                                      onClick={() => {
                                        props.validateInsurance(
                                          "insurance_consent_" + updatedInsuranceInformation.ProductDetailCode,
                                          'N',
                                          Event
                                        );
                                        userInput('N');
                                        // eslint-disable-next-line no-self-compare
                                      }}
                                      onChange={() => {
                                        //do nothing
                                      }}
                                      checked={customerConsent.checked}
                                    />
                                  </div>
                                  <span>
                                    {customerConsent.title}
                                  </span>
                                </label>
                              </div>                                    
                            </div>
                          </>
                        )}
                      </>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BancaDetails;

