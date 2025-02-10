export type StoreModel = {
  auth: {
    sessionUid: SessionUid | null;
  };
  loader: {
    isFetching: Loader | null;
    cta: Loader | null;
  };
  stages: StagesModel;
  stepCount: any;
  error: {
    exceptionList: [];
    errors: [];
    mandatoryFields: [];
  };
  lov: {
    lov: [];
  };
  valueUpdate: {
    value: boolean;
    otherMyInfo: boolean;
    backNavigation: {
      lastStageId: string | null;
      formChange: boolean | null;
      nextStageId: string | null;
    };
  };
  fielderror: {
    error: KeyWithAnyModel;
    mandatoryFields: Array<string>;
  };
  urlParam: {
    urlParams: {};
    myInfo: boolean;
    resume: boolean;
    products: any;
    aggregators:AggregatorModel;
    applicationDetails: {
      channelRefNo: string | null;
      applicationRefNo: string | null;
    };
  };
  documentUploadList: {
    responseDocuments: [],
    finalDocumentList: [],
    optionList: {
      docOption: [],
      optionsSelected: { applicantId: 1, options: [] },
    }
  };
  bancaList: {
    bancaDetails: KeyWithAnyModel;
  };
  tax: taxStoreModel;
  authorize: AutorizeModel | null;
  alias : aliasStoreModel;
  lastAccessed: {
    fieldFocused: string;
  };
  otp: KeyWithAnyModel;
  trustBank : KeyWithAnyModel;
  rate: KeyWithAnyModel;
  postalCode: KeyStringModel;
  pendingApplication : KeyWithAnyModel;
  referralcode:{
    refer: string | null ,
    referId: string | null,
    errormsg :string
  }
};

export type AuthorizeInitModel = {
  authorize: null | AutorizeModel;
}
export type AutorizeModel = {
  redirectUri: string;
  attributes: string;
  channelRefNo: string;
  clientId: string;
  sourceSystemName: string;
  acquisitionChannel: string;
}
export type taxStoreModel = {
  maxCount: number;
  count: number;
  fields: Array<string>;
};

export type aliasStoreModel = {
  maxCount: number;
  count: number;
  fields: Array<string>;
};

export type Loader = {
  isFetching: any;
};
export type SessionUid = {
  sessionUid: string;
};

export type StagesModel = {
  currentStage: string | null;
  journeyType: string | null;
  otpOpen: boolean | null;
  otpTrigger: boolean | null;
  otpResume: boolean | null;
  stages: StageDetails[];
  myinfoResponse: KeyWithAnyModel;
  ibankingResponse: KeyWithAnyModel;
  userInput: UserFields;
  updatedStageInputs: any;
  taxCustom: TaxCustom;
  conditionalFields: any;
  myinfoMissingFields: boolean | null;
  myinfoMissingLogicFields: any;
  dependencyFields: {
    workType: any | null;
  };
  otpSuccess: boolean | null;
  lastStageId: string | null;
};

export type StageDetails = {
  stageId: string;
  stageInfo: KeyWithAnyModel;
};

export type UserFields = {
  applicants: KeyWithAnyModel;
  missingFields: any;
};

export type LastStageInputs = {
  applicants: KeyWithAnyModel;
};

export type TaxCustom = {
  toggle: boolean;
  addTaxToggle: boolean;
};
export type FieldModel = {
  fields: Array<FieldsetModel> | undefined;
};

export type StageSliceModel = {
  stages: Array<StageDetails>;
  myinfoResponse: KeyWithAnyModel;
  ibankingResponse:KeyWithAnyModel;
  userInput: UserFields;
  updatedStageInputs: any;
  taxCustom: TaxCustom;
  conditionalFields: any;
  myinfoMissingFields: boolean | null;
  myinfoMissingLogicFields: any;
  dependencyFields: workType;
  currentStage: string | null;
  journeyType: string | null;
  otpOpen: boolean | null;
  otpTrigger: boolean | null;
  otpResume: boolean | null;
  isDocument:boolean;
  lastStageId: string | null;
  otpSuccess: boolean | null;
  isDocumentUpload : boolean | null;
};
export type workType = {
  workType: any | null;
};


export type ErrorModel = {
  errors: Array<ErrorDetails>;
  exceptionList: Array<ErrorExceptionDetails>;
  retry: boolean;
};

export type ErrorDetails = {
  statusCode: number | string;
  statusText: string;
};

export type ErrorExceptionDetails = {
  error_header: string;
  errorList: Array<KeyWithAnyModel>;
  error_button: string;
  error_type: string;
  status: string;
};

export type KeyStringModel = {
  [key: string]: string;
};
export type KeyWithAnyModel = {
  [key: string]: any;
};

export type FieldsetModel = {
  field_set_name: string;
  fields: Array<Object>;
};

export type UserInputModel = {
  applicants: KeyStringModel;
  missingFields: any;
};

export type LovInputModel = {
  label: string;
  value: Array<LovInputValModel>;
};
export type LovInputValModel = {
  CODE_DESC: string;
  CODE_VALUE: string;
  checked?: boolean;
  disabled?:boolean;
};
export type DateFormatModel = {
  DD: string;
  MM: string;
  YYYY: string;
};
export type ValidationObjModel = {
  nonEditable: Array<string[]>;
  hidden: Array<string[]>;
  modifyVisibility?:Array<string[]>;
};
export type PdfModel = {
  fileName: string;
  numPages:number | null;
  continueBtn : boolean;
};
export type ProductModel = {
  campaign: string;
  name: string;
  product_category: string;
  product_category_name: string;
  product_sequence_number: number;
  product_type: string;
  product_description?: string;
};
export type MyinfoModel = {
  myinfoResponse: null | any;
};

export type MyinfoNoResponseModel = {
  response: {
    statusText: string;
    status: string;
  };
};
export type FieldSetGroupModel = {
  field_set_name: string;
  fields: Array<KeyWithAnyModel>;
};
export type StageFieldModel = {
  stageId: string;
  fields: Array<KeyWithAnyModel>;
  stageName?: string;
  submitUrl?: string;
};
export type ValueSelectModel = {
  value: boolean | null;
  otherMyInfo: boolean;
  backNavigation: {
    lastStageId: string | null;
    formChange: boolean | null;
    nextStageId: string | null;
  };
};
export type FormConfigModel = {
  applicants: KeyWithAnyModel;
  application: KeyWithAnyModel;
  client: KeyWithAnyModel;
  fieldMetaData: KeyWithAnyModel;
  lov_desc: KeyWithAnyModel;
  products: Array<KeyWithAnyModel>;
  stage: KeyWithAnyModel;
  status: KeyWithAnyModel;
};
export type RadioDependecyModel = {
  logical_field_name: null | string;
  value: null | string;
};

export type DocumentModel = {
  applicant_documents: Array<ApplicantDocumentModel>;
};

export type ApplicantDocumentModel = {
  applicant_sequence_number: number;
  document_list: [
    {
      document_category: string;
      document_category_code: string;
      document_requested_stage: null | string;
      min_options_req: any;
      document_category_visible: boolean | null | string;
      document_category_seq: null | number;
      tempStoreData : TempStoreDataModel;
      document_options: [
        {
          document_option_sequence: string | number;
          document_option_selected: null | string;
          document_types: [
            {
              document_requested_stage: null | string;
              document_type: string;
              document_type_code: string;
              document_sub_type: null | string;
              no_of_periods: null | number;
              id_expiry: null | number;
              id_number: null | number;
              uploaded_documents: null | object;
            }
          ];
        }
      ];
    }
  ];
};


export type DocumentJsonModel = {
  docId: string;
  country: string;
  documentStatus: string | null;
  appId: string | null;
  documentCategoryCode: string | null;
  errorDescription: string |null;
  errorCode: string |null;
  responseStatus: string | null;
  documentTypeCode: string;
  documentOptionSequence: string | number;
  imageOrder: string | number;
  applicantId:string | number;
  period: string | number;
  tempStoreData : TempStoreDataModel  
};

export type TempStoreDataModel = {
  isSlectedForUpload : boolean
}

export type AggregatorModel = {
  aggregator_code : number|string|null|undefined
  aggregator_type : number|string|null|undefined
  aggregator_instance : number|string|null|undefined
}

export type PostalCodeModel = {
  block_a_1 : number|string|null
  building_name_a_1 :number|string|null
  street_name_a_1 :number|string|null
}
