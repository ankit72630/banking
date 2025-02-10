import { AppDispatch, dispatchError} from "../../../services/common-service";
import { getStoredOTP, getUrl } from "../../../utils/common/change.utils";
import axios, { AxiosError } from "axios";
import { otpAction } from "../../../utils/store/otp-slice";
import { submitService } from "../../../services";
import { PAYLOAD_CONSTANTS } from './constant';
import { encrypt } from "./e2e";
import { KeyWithAnyModel } from "../../../utils/model/common-model";
import { pendingApplicationAction } from "../../../utils/store/pending-application-slice";


export const generateOTPPayload = ( flowTypeVal: string, mobileNumber?: string) => {
  const applicationRefNo = getUrl.getChannelRefNo().applicationRefNo;
  let generateOTPPayloadReq = {
    mobileNo: mobileNumber,
    flowType: flowTypeVal,
    applnRefNo: applicationRefNo
  };
  return generateOTPPayloadReq;
};

export const encryptOtp = (otpUserInput: string, base64Challenge: string, exponent: string, modulus: string) => {
  let encryptedOtp = otpUserInput + '_-_' + base64Challenge;
  encryptedOtp = encrypt(exponent, modulus, '', encryptedOtp);
  return encryptedOtp;
};
export const verifyOTPPayload = (otpUserInput: string, mobileNumber: string, flowTypeVal: string) => {
  let verifyOTPPayloadRequest = JSON.parse(JSON.stringify(getStoredOTP()));
  let encryptedOtp = encryptOtp(otpUserInput, verifyOTPPayloadRequest.otp["base64-challenge"], verifyOTPPayloadRequest.otp["exponent"], verifyOTPPayloadRequest.otp["modulus"]);
  let verifyOTPPayloadReq = {
    "mobile-no": mobileNumber,
    "otp-sn": verifyOTPPayloadRequest.otp["otp-sn"],
    "enc-otp": encryptedOtp, 
    "key-index": verifyOTPPayloadRequest.otp["key-index"],
    "flow-type": flowTypeVal,
    "user-id": verifyOTPPayloadRequest.otp["userId"]
  };
  return verifyOTPPayloadReq;
};

export const generateOTP = (mobileNumber: string, productCode: string, applicantsSelector: KeyWithAnyModel, otpTriggerSelector: boolean|null): any => {
  const baseUrl = `${process.env.REACT_APP_RTOB_BASE_URL}`;
  const middleUrl = `${process.env.REACT_APP_RTOB_APPLICATION_END_POINT}`;
  const endPoint = `${process.env.REACT_APP_RTOB_GENERATE_OTP_END_POINT}`;
  const uUID = submitService.generateUUID;
  const url = `${baseUrl + middleUrl + uUID + endPoint}`;
  let flowTypeVal = PAYLOAD_CONSTANTS.flow_type_card;
  if(applicantsSelector.credit_limit_consent_a_1 === "Y" && otpTriggerSelector){
    flowTypeVal = PAYLOAD_CONSTANTS.flow_type_cli;
  }
  else if(productCode === "005"){
    flowTypeVal = PAYLOAD_CONSTANTS.flow_type_w8;
  }
  else if(productCode === null){
    flowTypeVal = 'RESUME';
  }

  let payload = generateOTPPayload(flowTypeVal, mobileNumber);
  return (dispatch: AppDispatch) => {
    return axios
      .post(url, payload)
      .then((generateOTPRes) => {
        dispatch(dispatchOTP(generateOTPRes.data));
        return Promise.resolve(generateOTPRes.data);
      })
      .catch((err: AxiosError) => {
        dispatch(dispatchError(err));
        return Promise.reject(err.response);
      });
  };
};

export const dispatchOTP = (otp: number): any => {
  return (dispatch: AppDispatch) => {
    dispatch(otpAction.createOtp(otp));
  };
};
export const dispatchPendingApplication = (pendingApplications: any): any => {
  return (dispatch: AppDispatch) => {
    dispatch(pendingApplicationAction.createPendingApplication(pendingApplications));
  };
};

export const verifyOTP = (otpUserInput: string, productCode: string, mobileNumber: string,  applicantsSelector: KeyWithAnyModel, otpTriggerSelector: boolean|null): any => {
  const baseUrl = `${process.env.REACT_APP_RTOB_BASE_URL}`;
  const middleUrl = `${process.env.REACT_APP_RTOB_APPLICATION_END_POINT}`;
  const endPoint = `${process.env.REACT_APP_RTOB_VERIFY_OTP_END_POINT}`;
  const uUID = submitService.generateUUID;
  const url = `${baseUrl + middleUrl + uUID + endPoint}`;

  let flowTypeVal = PAYLOAD_CONSTANTS.flow_type_card;
  if(applicantsSelector.credit_limit_consent_a_1 === "Y" && otpTriggerSelector){
    flowTypeVal = PAYLOAD_CONSTANTS.flow_type_cli;
  }
  else if(productCode === "005"){
    flowTypeVal = PAYLOAD_CONSTANTS.flow_type_w8;
  }
  else if(productCode === null){
    flowTypeVal = 'RESUME';
  }
  let payload = verifyOTPPayload(otpUserInput, mobileNumber, flowTypeVal);
  return (dispatch: AppDispatch) => {
    return axios
      .post(url, payload)
      .then((verifyOTPRes) => {
        if (verifyOTPRes.data && verifyOTPRes.data["status"] === "SUCCESS" && verifyOTPRes.data.Applications) {
          dispatch(dispatchPendingApplication(verifyOTPRes.data.Applications));
        }
          return Promise.resolve(verifyOTPRes.data);
      })
      .catch((err: AxiosError) => {
        dispatch(dispatchError(err));
        return Promise.reject(err.response);
      });
  };
};
