import { getUrl, getDeviceType } from "../common/change.utils";
import { KeyWithAnyModel } from "../model/common-model";
import { CONSTANTS } from "../common/constants";
import { checkProductDetails } from "../../services/common-service";

export const getErrorType = (errorType: string) => {
    let errorTypeList : KeyWithAnyModel = {
        '': 'na',
        'STOP': 'Save and Next',
        'CONTINUE': 'Try Again',
        'RESUBMIT': 'Review',
        'CORRECT': 'Review',
        'LOGIN': 'Continue to Login',
        'ROSHAN_CONTINUE': 'Ok, Continue'
    }
    return errorTypeList[errorType];
 }

export const getUserType = (userType: string) => {
   let userTypeLIst : KeyWithAnyModel = {
    'ntb' : 'New to Bank',
    'etb' : 'Existing to Bank',
    'etc' : 'Existing to cards or casa',
    'ntc' : 'New to cards or casa',
    'ecc' : 'Existing to credit cards applying for bundle',
    'c01' : 'Non resident of SG',
    'eca' : 'Existing to casa applying for bundle',
    'mdd' : 'Multiple dedupe'
   }
   return userTypeLIst[userType];
}

export const getStepName = (stage: KeyWithAnyModel) => {
    const productsSelector =  stage.stages.stages[0].stageInfo.products;
    const steps: KeyWithAnyModel = checkProductDetails(productsSelector) ? CONSTANTS.NON_ETC_CASA : CONSTANTS.NON_ETC_CC;
    if (steps[stage.stages.stages[0].stageId]) {
        return steps[stage.stages.stages[0].stageId].name;
    } else if (stage.stages.stages[0].stageId === 'ffd-1') {
        return 'thank you'
    } else {
        return 'na';
    }
}

export const loginval = () => {
    const isIbanking = getUrl.getParameterByName("SSCode") || getUrl.getParameterByName('transfer-token');
    
    if (isIbanking != null && getDeviceType() !== 'Mobile Website') {
        return 'Ibanking';
    }
    else if (isIbanking != null && getDeviceType() === 'Mobile Website') {
        return 'SC Mobile';
    }
    else {
        return 'RTOB';
    }
}
