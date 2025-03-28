import { authenticateType } from "./change.utils";

export const getTotalStep = (flowType: any) => {
  return {
    STAGE_NAMES: {
      SSF_1: "ssf-1",
      SSF_2: "ssf-2",
      LD_1: "ld-1",
      BD_1: "bd-1",
      BD_2: "bd-2",
      BD_3: "bd-3",
      DOC: "doc",
      AD_1: "ad-1",
      AD_2: "ad-2",
      ACD: "ACD",
      ACD_2: "acd-2",
      RP: "rp",
      FFD_1: "ffd-1",
    },
    STATE_URLS: {
      SUPER_SHORT_FORM: "sg/super-short-form",
      MYINFO_DETAILS: "sg/myinfo-details",
      PERSONAL_DETAILS: "sg/personal-details",
      EMPLOYMENT: "sg/employment",
      DOCUMENTS: "sg/document",
      CREDIT_CARD_DETAILS: "sg/credit-card-details",
      REVIEW: "sg/review",
      TAX_DETAILS: "sg/tax-details",
      ADDITIONAL_DATA: "sg/additional-data",
      OFFER: "sg/offer",
      LOAN_DETAILS: "sg/loan-details",
      CREDIT_LIMIT: "sg/credit-limit",
      THANKYOU: "sg/thankyou",
    },
    ETC_CASA: {
      totalStages: flowType === "ibnk" ? "4" : "5",
      startCount: flowType === "ibnk" ? "1" : "2",
      "ssf-1": {
        step: "1",
        path: "super-short-form",
        name: "Basic Information",
      },
      "ssf-2": {
        step: "2",
        path: "super-short-form",
        name: "MyInfo Details",
      },
      "bd-1": {
        step: "1",
        path: "super-short-form",
        name: "Basic Information",
      },
      "doc": {
        step: null,
        path: "document",
        name: "Document",
      },
      "ad-1": {
        step: null,
        path: "tax-details",
        name: "Tax Details",
      },
      "ad-2": {
        step: null,
        path: "product-details",
        name: "Product Details",
      },
      rp: {
        step: null,
        path: "rp",
        name: "Terms and Conditions",
      },
      'ffd-1': {
        step: null,
        path: "thankyou",
        name: "Thank You",
      }
    },
    NON_ETC_CASA: {
      totalStages: "6",
      startCount: flowType === "ibnk" ? "1" : "2",
      "ssf-1": {
        step: "1",
        path: "super-short-form",
        name: "Basic Information",
      },
      "ssf-2": {
        step: "2",
        path: "super-short-form",
        name: "MyInfo Details",
      },
      "bd-1": {
        step: "1",
        path: "super-short-form",
        name: "Basic Information",
      },
      "bd-3": {
        step: null,
        path: "employment",
        name: "Employment Details",
      },
      doc: {
        step: null,
        path: "document",
        name: "Document",
      },
      "ad-1": {
        step: null,
        path: "tax-details",
        name: "Tax Details",
      },
      "ad-2": {
        step: null,
        path: "product-details",
        name: "Product Details",
      },
      rp: {
        step: null,
        path: "rp",
        name: "Terms and Conditions",
      },
      'ffd-1': {
        step: null,
        path: "thankyou",
        name: "Thank You",
      }
    },
    ETC_CC: {
      totalStages: flowType === "ibnk" ? "4" : "5",
      startCount: flowType === "ibnk" ? "1" : "2",
      "ssf-1": {
        step: "1",
        path: "super-short-form",
        name: "Basic Information",
      },
      "ssf-2": {
        step: "2",
        path: "super-short-form",
        name: "MyInfo Details",
      },
      "ld-1": {
        step: null,
        path: "loan-calculator",
        name: "Loan Calculator"
      },
      "bd-1": {
        step: "1",
        path: "super-short-form",
        name: "Basic Information",
      },
      "bd-3": {
        step: null,
        path: "employment",
        name: "Employment Details",
      },
      doc: {
        step: null,
        path: "document",
        name: "Document",
      },
      "ad-2": {
        step: null,
        path: "credit-card-details",
        name: "Credit Card Details",
      },
      "ACD": {
        step: null,
        path: "trust-credit-limit-porting",
        name: "Trust Credit Limit Porting",
      },
      rp: {
        step: null,
        path: "rp",
        name: "Terms and Conditions",
      },
      'ffd-1': {
        step: null,
        path: "thankyou",
        name: "Thank You",
      }
    },
    NON_ETC_CC: {
      totalStages: flowType === "manual" ? "5" : "5",
      startCount: flowType === "manual" ? "1" : "2",
      "ssf-1": {
        step: "1",
        path: "super-short-form",
        name: "Basic Information",
      },
      "ssf-2": {
        step: "2",
        path: "super-short-form",
        name: "MyInfo Details",
      },
      "bd-2": {
        step: null,
        path: "personal-details",
        name: "Personal Details",
      },
      "ld-1": {
        step: null,
        path: "loan-calculator",
        name: "Loan Calculator"
      },
      "bd-1": {
        step: '1',
        path: "super-short-form",
        name: "Basic Information",
      },
      "bd-3": {
        step: null,
        path: "employment",
        name: "Employment Details",
      },
      doc: {
        step: null,
        path: "document",
        name: "Document",
      },
      "ad-2": {
        step: null,
        path: "credit-card-details",
        name: "Credit Card Details",
      },
      "ACD": {
        step: null,
        path: "trust-credit-limit-porting",
        name: "Trust Credit Limit Porting",
      },
      rp: {
        step: null,
        path: "rp",
        name: "Terms and Conditions",
      },
      'ffd-1': {
        step: null,
        path: "thankyou",
        name: "Thank You",
      }
    },
    DEFAULT_EDITABLE: ['name_of_employer', 'annual_income', 'email', 'mobile_number', 'marital_status']
  }
};

export const resumeHeaderText :any = {
  HEADER_TEXT: {
    resume: "Resume Application",
    resumeSubHeader: "Thank you for choosing Standard Chartered Bank.",
  }
}

export const getStageCounts = () =>{
  const flowType = authenticateType();
  return getTotalStep(flowType);
}
 
export const CONSTANTS:any = getStageCounts();
 

