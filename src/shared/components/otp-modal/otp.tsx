import "./otp.scss";
import { useState, useEffect } from "react";
import { constant } from "./constant";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { StoreModel } from "../../../utils/model/common-model";
import {
  dispatchCtaLoader,
  getProductCategory,
  postRequest,
  isFormUpdate,
  dispatchLoader,
  dispatchError
} from "../../../services/common-service";
import { useNavigate } from "react-router-dom";
import { generateOTP, verifyOTP } from "./otp.utils";
import { submitRequest } from "../../../modules/dashboard/fields/fields.utils";
import { fieldErrorAction } from "../../../utils/store/field-error-slice";
import { stagesAction } from "../../../utils/store/stages-slice";
import Model from "../../../shared/components/model/model";

export const Otp = () => {
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState("");
  const [maskedMobileNumber, setMaskedMobileNumber] = useState("");
  const [prefix, setPrefix] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpExpired, setOtpExpired] = useState(false);
  const otpNotReceivedTimeoutDuration = Number(
    `${process.env.REACT_APP_OTP_NOT_RECEIVED_TIMEOUT_DURATION}`
  );
  const otpExpiredTimeoutDuration = Number(
    `${process.env.REACT_APP_OTP_EXPIRED_TIMEOUT_DURATION}`
  );
  const [timerFlagDidNotRecOtp, setTimerFlagDidNotRecOtp] = useState(
    otpNotReceivedTimeoutDuration
  );
  const [timerFlagExpiredOtp, setTimerFlagExpiredOtp] = useState(
    otpExpiredTimeoutDuration
  );
  const [maxAttemptReached, setMaxAttemptReached] = useState(false);
  const [otpNotReceived, setOtpNotReceived] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorType, setErrorType] = useState("");
  const navigate = useNavigate();
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const applicantsSelector = useSelector(
    (state: StoreModel) => state.stages.userInput.applicants
  );
  const otpTriggerSelector = useSelector(
    (state: StoreModel) => state.stages.otpTrigger
  );
  const applicationJourney = useSelector(
    (state: StoreModel) => state.stages.journeyType
  );
  const valueSelector = useSelector((state: StoreModel) => state.valueUpdate);
  const lovSelector = useSelector((state: StoreModel) => state.lov);
  const userInputSelector = useSelector(
    (state: StoreModel) => state.stages.userInput
  );
  const errorSelector = useSelector((state: StoreModel) => state.error);
  useEffect(() => {
    dispatch(dispatchLoader(true));
    generateMobileOTP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const productCode = stageSelector[0]
    ? stageSelector[0].stageInfo.products[0].product_type
    : null;

  useEffect(() => {
    if (otp && otp.length === 6) {
      dispatch(dispatchLoader(true));
      dispatch(
        verifyOTP(
          otp,
          productCode,
          mobileNumber,
          applicantsSelector,
          otpTriggerSelector
        )
      ).then((verifyOTPResp: any) => {
        if (verifyOTPResp.status && verifyOTPResp.status === "SUCCESS") {
          /* confirm call post success of otp verification */
          if (
            verifyOTPResp.Applications &&
            verifyOTPResp.Applications.length > 0
          ) {
            navigate("/pending-application");
          } else if (productCode === "005") {
            const stagePayload = () => {
              let reqParam: any = {};
              const productCategory = getProductCategory(
                stageSelector[0].stageInfo.products
              );
              if (productCategory === "CC" || productCategory === "PL") {
                reqParam["terms_conditions_consent_a_1"] = "Y";
              } else {
                reqParam["terms_conditions_casa_spf_a_1"] = "Y";
              }
              return reqParam;
            };

            const patchUserInputOnPayload = () => {
              const fieldUpdate = JSON.parse(JSON.stringify(stageSelector));
              for (let key in applicantsSelector) {
                fieldUpdate[0].stageInfo.applicants[key] =
                  applicantsSelector[key];
              }
              return fieldUpdate[0];
            };

            dispatch(fieldErrorAction.getMandatoryFields(null));
            dispatch(fieldErrorAction.getFieldError(null));
            let currentStageFields: any = stagePayload();

            dispatch(
              postRequest(
                patchUserInputOnPayload(),
                currentStageFields,
                patchUserInputOnPayload().stageId,
                applicationJourney
              )
            )
              .then((response: any) => {
                dispatch(isFormUpdate(null));
                dispatch(stagesAction.updateStageId("ffd-1"));
                dispatch(stagesAction.resetCurrentStage("ffd-1"));
                dispatch(dispatchLoader(false));
                navigate("/sg/thankyou");
              })
              .catch((err: any) => {
                return Promise.reject(err);
              }); /* */
          } else if (stageSelector[0].stageId === "ffd-1") {
            dispatch(dispatchCtaLoader(false));
            dispatch(stagesAction.setOTPSuccessForThankYou(true));
            dispatch(stagesAction.resetCurrentStage(stageSelector[0].stageId));
            dispatch(stagesAction.updateStageId(stageSelector[0].stageId));
            navigate("/sg/thankyou");
          } else {
            dispatch(stagesAction.setOtpTrigger(false));
            let stagePayload = applicantsSelector;
            const otpAuth = true;
            dispatch(
              submitRequest(
                stagePayload,
                stageSelector[0],
                valueSelector,
                applicationJourney,
                lovSelector,
                userInputSelector,
                errorSelector,
                otpAuth
              )
            )
              .then((stage: string) => {
                dispatch(dispatchCtaLoader(false));
                dispatch(stagesAction.setOtpShow(false));
                dispatch(stagesAction.resetCurrentStage(stage));
              })
              .catch((_err: any) => {
                // do nothing
              });
          }
        } else {
          setError(verifyOTPResp.application.errors[0].detail);
          dispatch(dispatchLoader(false));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  useEffect(() => {
    if (timerFlagDidNotRecOtp > 0) {
      const TimerInt = setInterval(() => {
        setTimerFlagDidNotRecOtp((time: number) => time - 1);
      }, 1000);
      return () => {
        clearInterval(TimerInt);
      };
    } else {
      setOtpNotReceived(true);
      setOtpExpired(false);
    }
  }, [timerFlagDidNotRecOtp]);

  useEffect(() => {
    if (timerFlagExpiredOtp > 0) {
      const TimerInt = setInterval(() => {
        setTimerFlagExpiredOtp((time: number) => time - 1);
      }, 1000);
      return () => {
        clearInterval(TimerInt);
      };
    } else {
      setOtpNotReceived(false);
      setOtpExpired(true);
    }
  }, [timerFlagExpiredOtp]);

  //Method to Generate OTP and store OTP information in redux on success
  const generateMobileOTP = () => {
    setErrorType("");
    const mobile =
      typeof window !== "undefined" && stageSelector[0]
        ? stageSelector[0].stageInfo.applicants.mobile_number_a_1
        : sessionStorage.getItem("mobile");
    const prodCode = stageSelector[0]
      ? stageSelector[0].stageInfo.products[0].product_type
      : null;
    if (mobile) {
      setMobileNumber(mobile);
      dispatch(
        generateOTP(mobile, prodCode, applicantsSelector, otpTriggerSelector)
      ).then((generateOTPResp: any) => {
        if (
          generateOTPResp.response &&
          generateOTPResp.response === "SUCCESS"
        ) {
          setError("");
          setIsSuccess(true);
          setPrefix(generateOTPResp["otp-prefix"] + "-");
          setMaskedMobileNumber(generateOTPResp["mobile"]);
          dispatch(dispatchLoader(false));
        } else {
          setError(generateOTPResp.errors[0].detail);
          if (generateOTPResp.errors[0].code === "OTP01") {
            setErrorType("noPendingApplications");                     
          } else {
            setErrorType("globalError");            
          }
        }
        dispatch(dispatchLoader(false));
      })
      .catch((_err: any) => {
        setError(_err);
        dispatch(dispatchError(_err));
        dispatch(dispatchLoader(false));
      });
    }
    else{
      setErrorType("invalidMobile"); 
      dispatch(dispatchLoader(false));
    }
  };

  //Method to Re-Generate OTP and store OTP information in redux on success
  const regenerateMobileOTP = () => {
    dispatch(dispatchLoader(true));
    setOtpNotReceived(false);
    setOtpExpired(false);
    setTimerFlagDidNotRecOtp(otpNotReceivedTimeoutDuration);
    setTimerFlagExpiredOtp(otpExpiredTimeoutDuration);
    setOtp("");
    setError("");
    setIsSuccess(false);
    const mobile =
      typeof window !== "undefined" && stageSelector[0]
        ? stageSelector[0].stageInfo.applicants.mobile_number_a_1
        : sessionStorage.getItem("mobile");
    const prodCode = stageSelector[0]
      ? stageSelector[0].stageInfo.products[0].product_type
      : null;
    if (mobile) {
      dispatch(
        generateOTP(
          mobileNumber,
          prodCode,
          applicantsSelector,
          otpTriggerSelector
        )
      ).then((generateOTPResp: any) => {
        if (
          generateOTPResp.response &&
          generateOTPResp.response === "SUCCESS"
        ) {
          setError("");
          setIsSuccess(true);
          setPrefix(generateOTPResp["otp-prefix"] + "-");
          setMaskedMobileNumber(generateOTPResp["mobile"]);
          dispatch(dispatchCtaLoader(false));
        } else {
          if (
            generateOTPResp.application.errors[0].code &&
            generateOTPResp.application.errors[0].code === "SESS05"
          ) {
            setMaxAttemptReached(true);
          }
          setError(generateOTPResp.application.errors[0].detail);
        }
        dispatch(dispatchLoader(false));
      });
    }
  };

  return (
    <div className="otp">
      <div className="otp__content">
        <div className="otp__logo"></div>
        {!maxAttemptReached && (
          <div>
            {!otpExpired && errorType === "noPendingApplications" &&  <Model name="no_pending_applications" />}
            {!otpExpired && errorType === "globalError" && <Model name="globalError" />}
            {!otpExpired && errorType === "invalidMobile" && <Model name="invalid_mobile" />}
            {!otpExpired && errorType === "" && (
              <div>
                <div className="otp__container">
                  <div className="otp__desc">
                    <div className="otp__info">{constant.info}</div>
                    {maskedMobileNumber && (
                      <div className="otp__mobile">+{maskedMobileNumber}</div>
                    )}
                    <div className="otp__fields">
                      <span>{prefix}</span>&nbsp; &nbsp;
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>&nbsp;&nbsp;</span>}
                        inputStyle="inputOtp"
                        inputType="tel"
                        renderInput={(props) => <input {...props} />}
                      />
                    </div>
                  </div>
                  {isSuccess && (
                    <div className="otp__generated_fadeout">
                      {constant.generated}
                    </div>
                  )}
                  {error && <div className="otp__invalid-otp">{error}</div>}
                  <button
                    type="button"
                    className="otp__resend"
                    onClick={() => regenerateMobileOTP()}
                    disabled={!otpNotReceived}
                  >
                    <span>{constant.resendBtn}</span>
                    {!otpNotReceived && <span>({timerFlagDidNotRecOtp}s)</span>}
                  </button>
                </div>
              </div>
            )}
            {otpExpired && (
              <div className="otp__expired">
                <div className="otp__expired-otp">{constant.expiredOTP}</div>
                <div className="otp__expired-time">{constant.expiredTime}</div>
                <div className="otp__expired-new">{constant.newOtp}</div>
                <div
                  className="otp__expired-btn"
                  onClick={() => regenerateMobileOTP()}
                >
                  <span>{constant.resendBtn}</span>
                </div>
                <div className="otp__expired-issue">{constant.issues}</div>
                <div className="otp__expired-ccs">
                  <span>{constant.ccs}</span>
                </div>
              </div>
            )}
          </div>
        )}
        {maxAttemptReached && (
          <div>{error && <div className="otp__invalid-otp">{error}</div>}</div>
        )}
      </div>
    </div>
  );
};

export default Otp;

