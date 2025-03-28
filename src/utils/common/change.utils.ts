import { AppDispatch } from "../../services/common-service";
import { KeyWithAnyModel, StageFieldModel } from "../model/common-model";
import { store } from "../store/store";
import { ValueUpdateAction } from "../store/value-update-slice";

/**
 * The method is used to raise API request if any changes observed in the page fields
 */
export const isFieldUpdate = (
  props: KeyWithAnyModel,
  fieldValue: string,
  fieldName: string
): any => {
  return (_dispatch: AppDispatch) => {
    props.handleFieldDispatch(fieldName, fieldValue);
  };
};

export const isFieldValueUpdate = (
  props: KeyWithAnyModel,
  stageSelector: any,
  fieldValue: string
): any => {
  return (dispatch: AppDispatch) => {
    const prevValue =
      stageSelector[0].stageInfo.applicants[fieldIdAppend(props)];
    if (prevValue) {
      if (prevValue !== fieldValue) {
        dispatch(
          ValueUpdateAction.getChangeUpdate({
            id: stageSelector[0].stageId!,
            changes: true,
          })
        );
      }
    } else {
      dispatch(
        ValueUpdateAction.getChangeUpdate({
          id: stageSelector[0].stageId!,
          changes: true,
        })
      );
    }
  };
};

/**
 * Method used to notify the global field level errors
 * @param fieldErrorSelector stage response
 * @param props current field object to identify the field error
 * @returns
 */
export const fieldError = (fieldErrorSelector: any, props: KeyWithAnyModel) => {
  if (fieldErrorSelector) {
    if (Object.keys(fieldErrorSelector).length > 0) {
      return fieldErrorSelector.hasOwnProperty(props.data.logical_field_name);
    }
  }
};

/**
 * Method used to get the current stage id in the array object to filter
 * @param stageInfo current stage response
 * @param stageId current stage id
 * @returns
 */
export const FindIndex = (stageInfo: any, stageId: string) => {
  return stageInfo.fieldMetaData.data.stages.findIndex(
    (id: StageFieldModel) => id.stageId.toLowerCase() === stageId.toLowerCase()
  );
};

/**
 * Method used to get the query param from url
 * @param name url string name
 * @returns
 */
export const getUrl = {
  getParameterByName(name: string) {
    if (store) {
      return new URLSearchParams(store.getState().urlParam.urlParams).get(name);
    }
  },
  getProductInfo() {
    return store.getState().urlParam.products;
  },
  getStageInfo() {
    return store.getState().stages.stages;
  },
  getJourneyType() {
    return store.getState().stages.journeyType;
  },
  getOtpShow() {
    return store.getState().stages.otpOpen;
  },
  getOtpTrigger() {
    return store.getState().stages.otpTrigger;
  },
  getOtpResume() {
    return store.getState().stages.otpResume;
  },
  getChangeUpdate() {
    return store.getState().valueUpdate.backNavigation.pegaRequest;
  },
  getChannelRefNo() {
    return store.getState().urlParam.applicationDetails;
  },
  getUrlEndPoint() {
    return store.getState().urlParam.urlEndPoint;
  },
  getLoader() {
    return store.getState().loader;
  },
  getAggregators() {
    return store.getState().urlParam.aggregators;
  },
  getProductDetails() {
    return store.getState().urlParam.products;
  },
  getDocumentStatus() {
    return store.getState().documentUploadList.documentUpdate;
  },
  getUserInputs() {
    return store.getState().stages.userInput.applicants;
  },
  getUpdatedStage() {
    return store.getState().stages;
  },
  getRate() {
    return store.getState().rate;
  },
  getSteps() {
    return store.getState().stepCount;
  },
  getMyInfo() {
    return store.getState().stages.myinfoResponse;
  },
  getTokens() {
    return store.getState().token;
  },
  getAggregatorStatus() {
    if (
      getUrl.getParameterByName("aggregator_code") ||
      getUrl.getParameterByName("aggregator_type") ||
      getUrl.getParameterByName("aggregator_instance")
    ) {
      return true;
    } else {
      return false;
    }
  },
};

export const getStoredOTP = () => {
  return store.getState().otp;
};

export const getCurrentYear = () => {
  const todate = new Date();
  return todate.getFullYear();
}

export const authenticateType = (): string => {
  const auth = getUrl.getParameterByName("auth");
  const isMyInfoVirtual = getUrl.getParameterByName("isMyInfoVirtual");
  const stages = getUrl.getStageInfo();
  let authType = null;
  if (stages && stages[0] && stages[0].stageInfo) {
    authType = stages[0].stageInfo.applicants["auth_mode_a_1"];
  }
  if (auth === "myinfo" || isMyInfoVirtual === "true" || authType === "XM") {
    return "myinfo";
  } else if (authType === "IX") {
    return "ibnk";
  } else {
    return "manual";
  }
};

export const fieldIdAppend = (props: KeyWithAnyModel): string => {
  let fieldId: string = props.data.logical_field_name;
  return fieldId + "_a_1";
};

/**
 * Method used to get missing myInfo fields
 * @param formConfigValues formConfig
 * @param myInfoData Myinfo missing fields
 * @returns
 */

export const filterDisableFields = (
  formConfigValues: KeyWithAnyModel,
  myInfoData: Array<string>,
  defaultEditable? : Array<string>
) => {
  let filteredFields: Array<string> = [];
  let missingField:boolean;
  formConfigValues.forEach((formConfigFields: KeyWithAnyModel) => {
    let isDefaultEditable =!defaultEditable || (defaultEditable && defaultEditable.indexOf(formConfigFields.logical_field_name) === -1)
      missingField = myInfoData.some(
        (myInfoValue: string) =>
          myInfoValue === formConfigFields.logical_field_name
      );
    if (!missingField && isDefaultEditable) {
      filteredFields.push(formConfigFields.logical_field_name);
    }
  });
  return filteredFields;
};

export const isMyinfoField = (
  myInfoResponseSelector: KeyWithAnyModel,
  logical_field_name: string
) => {
  let defaultEditableFields = ['email', 'mobile_number', 'marital_status']
  let isDefaultEditable = !defaultEditableFields || (defaultEditableFields && defaultEditableFields.indexOf(logical_field_name) === -1)

  return (
    isDefaultEditable && myInfoResponseSelector.hasOwnProperty(logical_field_name + "_a_1") &&
    myInfoResponseSelector[logical_field_name + "_a_1"]
  );
};

/**
 * Method to get device type
 */
export const getDeviceType = () => {
  let device = "Desktop Website";
  let userAgent = window.navigator.userAgent.toLowerCase();
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
  ) {
    return (device = "Mobile Website");
  }
  return device;
};

/**
 * The method used to scroll to first field error
 */
export const smoothScroll = () => {
  setTimeout(() => {
    const errorMsg: any = document.getElementsByClassName('error-msg')[0];
    if (errorMsg) {
      const headerHeight:any = document.getElementsByClassName('app__body')[0];
      document.getElementsByClassName('app__body')[0].scroll({
        top: Math.abs(errorMsg.parentElement.offsetTop - headerHeight.previousElementSibling.offsetHeight),
        left: 0,
        behavior: 'smooth'
      });
    }
  }, 100)
}

/**
 * the method used to update the step count sequence based on journey 
 * @param stageSelector 
 * @returns 
 */
export const removeStageIds = (stageSelector:any) => {
  let default_seq = ['ld-1','bd-2','bd-3','doc','ad-1','ad-2','ACD','rp'];
  if(stageSelector &&
    stageSelector.stages &&
    stageSelector.stages.length > 0) {
    if(stageSelector.stages[0].stageInfo.applicants['auth_mode_a_1'] !== 'XN') {
      default_seq.splice(default_seq.indexOf('bd-2'), 1);
    }
    if(stageSelector.stages[0].stageInfo.products[0]['product_category'] !== 'PL') {
      default_seq.splice(default_seq.indexOf('ld-1'), 1);
    }
    if(!(stageSelector.stages[0].stageInfo.applicant_documents && stageSelector.stages[0].stageInfo.applicant_documents.length > 0)) {
      default_seq.splice(default_seq.indexOf('doc'), 1);
    }
    if(stageSelector.stages[0].stageInfo.applicants['credit_limit_consent_a_1'] === 'Y') {
      default_seq.splice(default_seq.indexOf('ad-2'), 1);
    }
    if(stageSelector.stages[0].stageInfo.products[0]['product_category'] !== 'CA' && stageSelector.stages[0].stageInfo.products[0]['product_category'] !== 'SA') {
      default_seq.splice(default_seq.indexOf('ACD'), 1);
      default_seq.splice(default_seq.indexOf('ad-1'), 1);
    }
  }
  return default_seq;
}
/**
 * 
 * @param label keyjson label
 * @returns 
 */
export const keyToken = (label: string) => {
  const getToken = getUrl.getTokens();
  const keyIndex = findKeyTokenIndex(getToken, label);
  const es256Index = getToken.keys[keyIndex].value.findIndex((ref: any) => ref.alg === 'ES256');
  return [getToken.keys[keyIndex].value[es256Index]]
}

/**
 * 
 * @param getToken store value
 * @param label key json label
 * @returns 
 */
export const findKeyTokenIndex = (getToken: any, label: string) => {
  return getToken.keys.findIndex((res: any) => res.label === label);
}

/**
 * To get channel ref number
 * @returns 
 */
export const getTokenChno = () => {
  const code = getUrl.getParameterByName("isMyInfoVirtualNRIC")
    ? getUrl.getParameterByName("isMyInfoVirtualNRIC")
    : getUrl.getParameterByName("code");
  let token = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem('chRefNo');
  if (token === 'undefined') {
    token = null;
  }
  const channelRefNo: any =
    getUrl.getChannelRefNo().channelRefNo !== null
      ? getUrl.getChannelRefNo().channelRefNo
      : JSON.parse(token!);

  return {
    code: code,
    channelRefNo: channelRefNo
  }
}
