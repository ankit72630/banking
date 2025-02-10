import {
  KeyWithAnyModel,
  StoreModel,
  DocumentModel,
} from "../../../utils/model/common-model";
import Footer from "../../../modules/dashboard/footer/footer";
import "./documet-upload.scss";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { documentUploadAction } from "../../../utils/store/document-slice";
import {
  documentClientContext,
  fileuploadSuccess,
  fileValidation,
  filterDocuments,
  getDocumentMetaData,
  //getDocumentThumnail,
  setSuccessStatus,
  validateMandatoryDoc,
} from "./document-upload.utils";
import axios, { AxiosError } from "axios";
import {
  checkProductDetails,
  dispatchCtaLoader,
  dispatchLoader,
  documentSubmit,
  lovRequests,
} from "../../../services/common-service";
import PopupModel from "../popup-model/popup-model";
import {
  nextStage,
  stateUrl,
} from "../../../modules/dashboard/fields/stage.utils";
import { stagesAction } from "../../../utils/store/stages-slice";
import Model from "../model/model";
import { getUrl } from "../../../utils/common/change.utils";
import DocumentUploadRadioButton from "./document-upload-radio-button";
import DocumentFileUpload from "./document-file-upload";
import { loaderAction } from "../../../utils/store/loader-slice";
import { urlParamAction } from "../../../utils/store/urlparam-slice";
import trackEvents from "../../../services/track-events";
import { ValueUpdateAction } from "../../../utils/store/value-update-slice";
import { CONSTANTS } from "../../../utils/common/constants";
import { store } from "../../../utils/store/store";
import { StepCountAction } from "../../../utils/store/step-count-slice";
import { useNavigate } from "react-router-dom";

export const DocumentUpload = (props: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [documentResponse, setDcoumentList] = useState<Array<KeyWithAnyModel>>(
    []
  );
  const documentStore = useSelector(
    (state: StoreModel) => state.documentUploadList
  );
  const valueSelector = useSelector((state: StoreModel) => state.valueUpdate);
  const applicationJourney = useSelector(
    (state: StoreModel) => state.stages.journeyType
  );
  const cancelFileUpload = useRef({});
  const [progress, setProgress] = useState<KeyWithAnyModel>({
    progressPercentage: 0,
  });

  const [documentArrList, setDocumentArrList] = useState<
    Array<KeyWithAnyModel>
  >([]);
  /*const [mandatoryDocumentsList, setMandatoryDocumentsList] = useState<
    Array<KeyWithAnyModel>
  >([]);*/
  const [mandatoryDocumentsList, setMandatoryDocumentsList] = useState<
    any
  >([]);
  const [uploadEnable, setUploadEnable] = useState(false);
  const [documentError, setDocumentError] = useState<KeyWithAnyModel>({
    errorType: null,
    enableError: null,
  });
  const [singleDocPreview, setSingleDocPreview] = useState<KeyWithAnyModel>({
    previewPopUp: false,
    imageUrl: null,
    documentType: null,
  });
  const documentStructureSelector = useSelector(
    (state: StoreModel) => state.documentUploadList
  );

  const [documentState, setDocumentState] = useState<any>(null);
  const [tmpDocumentState, setTmpDocumentState] = useState<any>(null);

  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);

  let documentStoreCopy = JSON.parse(
    JSON.stringify(Object.assign([], documentStore.responseDocuments))
  );
  let documentList = JSON.parse(
    JSON.stringify(
      Object.assign([], stageSelector[0].stageInfo.applicant_documents)
    )
  );

  const [refernceDetails, setRefernceDetails] = useState({
    channelReference: "",
    applicationReferenceNo: "",
  });

  useEffect(() => {
    //dispatch(fieldErrorAction.getMandatoryFields(null));
    dispatch(dispatchLoader(false));
    setRefernceDetails({
      channelReference: getUrl.getChannelRefNo().channelRefNo!,
      applicationReferenceNo: getUrl.getChannelRefNo().applicationRefNo!,
    });
    dispatch(
      loaderAction.getState({
        isFetching: false,
      })
    );
    if(getUrl.getParameterByName("auth") === "upload" || store.getState().stages.isDocumentUpload){
      setUploadEnable(true)
     }
    setDocumentState(JSON.parse(JSON.stringify(documentStructureSelector)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (documentState && documentState.responseDocuments) {
      documentState.responseDocuments = documentResponse;
      dispatch(
        documentUploadAction.getDocumentList(
          JSON.parse(JSON.stringify(documentState))
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpDocumentState]);

  const documentHeaders = (header: string) => {
    if (header) {
      return "Upload your " + header.toLocaleLowerCase();
    }
  };

  useEffect(() => {
    setDocumentArrList(
      documentStore.responseDocuments.length > 0
        ? documentStoreCopy
        : filterDocuments(documentList)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(documentList.finalDocument && documentList.finalDocument.finalDocumentList && documentList.finalDocument.finalDocumentList.length > 0){
      setDocumentState(documentList.finalDocument);
      dispatch(documentUploadAction.isDocumentUpdate(true));
      delete documentList.finalDocument;
    }

    setDcoumentList(documentArrList);
    if(getUrl.getParameterByName("auth") === "upload")
    {setMandatoryDocumentsList(getMandatoryFields(documentArrList));}
    else if (documentArrList && documentArrList.length > 0 && documentArrList[0].isSignatureDoc) {
      setMandatoryDocumentsList({ R0006: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentStore, documentArrList]);

  const getMandatoryFields = (
    documentResponseData: DocumentModel | any
  ): any => {
    let mandatoryFields: KeyWithAnyModel = [];
    if (documentResponseData && documentResponseData[0]) {
      documentResponseData[0].document_list.forEach((doc: KeyWithAnyModel) => {
        if (doc.min_options_req > 0) {
          mandatoryFields[doc.document_category_code] = doc.min_options_req;
        }
      });
      return mandatoryFields;
    }
  };

  /** assigning selected document */
  const setCheckedFlag = (documentCategory: string, documentCode: string) => {
    documentResponse[0].document_list.forEach((docOption: KeyWithAnyModel) => {
      if (docOption.document_category_code === documentCategory) {
        docOption.docCheck = "Y";
        docOption.document_options.forEach((docList: KeyWithAnyModel) => {
          docList.document_types.forEach((documentSegment: KeyWithAnyModel) => {
            if (documentSegment.document_type_code === documentCode) {
              documentSegment.uploaded_documents = {
                tempDocStore: {
                  isSelected: "Y",
                },
              };
              documentSegment.selectDocument = documentSegment.document_type;
            } else {
              documentSegment.uploaded_documents = null;
              documentSegment.selectDocument = null;
            }
          });
        });
      }
    });
    setDcoumentList([...documentResponse]);
  };

  /** setting flag for uploading document*/
  const uploadDocument = (
    documentTypes: KeyWithAnyModel,
    event: React.FormEvent<EventTarget>
  ): void => {
    if(!store.getState().stages.isDocumentUpload && getUrl.getParameterByName("auth") !== "upload"){
    trackEvents.triggerAdobeEvent("ctaClick", "Upload Document");
    }
    if (documentTypes.docCheck === "Y") {
      documentResponse[0].document_list.forEach(
        (docOption: KeyWithAnyModel) => {
          if (
            docOption.document_category_code ===
            documentTypes.document_category_code
          ) {
            docOption.isSlectedForUpload = "Y";
          }
        }
      );
      setDcoumentList([...documentResponse]);
    } else {
      setDocumentError({
        errorType: "selectDocument",
        enableError: true,
      });
    }
    event.preventDefault();
  };

  /** File uplod -- main method */
  const changeHandler = async (
    uploadingDocument: KeyWithAnyModel,
    documentTypes: KeyWithAnyModel,
    event: any,
    indexOfUpload: number
  ) => {
    const documentArr = fileValidation(event.target.files, uploadingDocument);
    if (documentArr.enableError) {
      setDocumentError(documentArr);
    } else {
      await fileUpload(
        uploadingDocument,
        event.target.files[0],
        documentTypes,
        indexOfUpload
      )
        .then((response: any) => {
          dispatch(documentUploadAction.isDocumentUpdate(true));
          console.log("change handler", response);
        })
        .catch((error: AxiosError) => {
          console.log("catch error--", error);
        });
    }
  };

  /** Single file upload -- child method */
  const fileUpload = async (
    uploadingDocument: KeyWithAnyModel,
    file: any,
    documentTypes: KeyWithAnyModel,
    indexOfUpload: number
  ) => {
    let selectedDocument: KeyWithAnyModel = [];
    const url = `applications/${refernceDetails.channelReference}${process.env.REACT_APP_DOCUMENT_UPLOAD}`;
    selectedDocument = documentTypes.document_options.filter(
      (doc: KeyWithAnyModel) =>
        !!doc.document_types[0].uploaded_documents &&
        doc.document_types[0].uploaded_documents.length >= 0
    );
    const getMetaData = getDocumentMetaData(selectedDocument, documentTypes);
    let scClientContextHeaders = documentClientContext(
      refernceDetails.channelReference!
    );
    let header : any = {}
    header["SC-CLIENT-CONTEXT"] = JSON.stringify(scClientContextHeaders)
    if (process.env.REACT_APP_ENVIRONMENT === "uat") {
      header["Env"] = process.env.REACT_APP_ENVIRONMENT;
    };
    selectedDocument[0].document_types[0].documentStatus = "UPLOADING";
    let data = new FormData();
    data.append("file", file);
    data.append("documentJson", JSON.stringify(getMetaData));

    const options = {
      onUploadProgress: (progressEvent: any) => {
        setProgressPercentage(documentTypes, progressEvent, uploadingDocument);
      },
      cancelToken: new axios.CancelToken(
        (cancel) => (cancelFileUpload.current = cancel)
      ),
    };
    uploadingDocument.document_name = file.name;
    uploadingDocument.documentStatus = "UPLOADING";
    const docaxios = axios.create({
      headers: header,
      baseURL: process.env.REACT_APP_RTOB_BASE_URL,
    });

    await docaxios
      .post(url, data, options)
      .then(async (response) => {
        if (response) {
          /** setting flag for uploaded document */
          await dispatch(
            setSuccessStatus(
              documentResponse,
              documentTypes,
              selectedDocument,
              response.data,
              indexOfUpload
            )
          ).then(async () => {
            await dispatch(
              fileuploadSuccess(
                selectedDocument[0].document_types,
                response.data
              )
            ).then((successFileResponse: any) => {
              /** adding the response to an array, to send in acknwoledge document */
              setDocumentState((prev: any) => {
                prev.finalDocumentList.push(successFileResponse);
                if (
                  prev.optionList.docOption.indexOf(
                    selectedDocument[0].document_types[0].document_type_code
                  ) === -1
                ) {
                  prev.optionList.docOption.push(
                    selectedDocument[0].document_types[0].document_type_code
                  );
                  prev.optionList.optionsSelected.options.push({
                    documentCategoryCode: documentTypes.document_category_code,
                    documentOptionSequence: 1,
                    documentTypeCode:
                      selectedDocument[0].document_types[0].document_type_code,
                  });
                }
                return prev;
              });
            });
          });
          setTmpDocumentState((tmpData: any) => ({
            ...tmpData,
            documentState,
          }));
          setDcoumentList([...documentResponse]);
          return Promise.resolve();
        }
      })
      .catch((err: AxiosError) => {
        uploadingDocument.documentStatus = "REJECTED";
        setDcoumentList([...documentResponse]);
      });
  };

  /** setting progressBar */
  const setProgressPercentage = (
    documentTypes: any,
    progressEvent: any,
    uploadingDocument: any
  ) => {
    const { loaded, total } = progressEvent;
    const percent = Math.floor((loaded * 100) / total);
    console.log(
      `${loaded}kb of ${total}kb | ${percent}%`
    ); /** just to see whats happening in the console */
    setProgress((prevUser: any) => ({
      ...prevUser,
      [documentTypes.document_category_code]: { progressPercentage: percent },
    }));
    uploadingDocument.progress = percent;
  };

  const cancelUpload = () => {
    if (cancelFileUpload.current) {
      cancelFileUpload.current = "User Cancelled!!!";
    }
  };
  /** fileDelete */
  const deleteFile = (
    uploadedDocuments: KeyWithAnyModel,
    documentTypes: KeyWithAnyModel,
    indexofUpload: number,
    status: string
  ) => {
    if (
      uploadedDocuments.length > 0 &&
      status !== "REJECTED" &&
      status !== "FAILED"
    ) {
      dispatch(documentUploadAction.isDocumentUpdate(true));
      let isDocAvailable = false;
      documentState.finalDocumentList.forEach(
        (uploadList: KeyWithAnyModel, index: number) => {
          if (uploadList.docId === uploadedDocuments[indexofUpload].docId) {
            isDocAvailable = true;
            documentState.finalDocumentList[index].documentStatus = "Rejected"
          }
        }
      );
      if(!isDocAvailable){
        uploadedDocuments[indexofUpload].documentStatus = "Rejected";
        documentState.finalDocumentList.push(uploadedDocuments[indexofUpload])
      }
    }

    if (uploadedDocuments.length > 0) {
      uploadedDocuments.splice(indexofUpload, 1);
    }

    if (uploadedDocuments.length === 0) {
      documentResponse[0].document_list.forEach(
        (docOption: KeyWithAnyModel) => {
          if (
            docOption.document_category_code ===
            documentTypes.document_category_code
          ) {
            docOption.docCheck = "N";
            docOption.isSlectedForUpload = "N";
          }
        }
      );
    }
    setTmpDocumentState((tmpData: any) => ({
      ...tmpData,
      documentState,
    }));
    setDcoumentList([...documentResponse]);
  };

  /** Added for clarification - dont remove */

  const addDocument = (
    documentType: KeyWithAnyModel,
    docCategory: KeyWithAnyModel,
    event: any,
    index: number
  ) => {
    documentResponse[0].document_list.forEach((docOption: KeyWithAnyModel) => {
      if (docOption.document_category_code === docCategory) {
        docOption.document_options.forEach((docList: KeyWithAnyModel) => {
          docList.document_types.forEach((documentSegment: KeyWithAnyModel) => {
            if (
              documentSegment.document_type_code ===
              documentType.document_type_code
            ) {
              if (
                documentSegment.uploaded_documents[index].documentStatus &&
                documentSegment.uploaded_documents[index].documentStatus !==
                  null
              ) {
                documentSegment.uploaded_documents.push({
                  document_type_code: documentSegment.document_type_code,
                  documentStatus: null,
                  selectDocument: documentType.document_type,
                });
              }
            }
          });
        });
      }
    });
    setDcoumentList([...documentResponse]);
    event.preventDefault();
  };

  const submitDocument = (event: React.FormEvent<EventTarget>): void => {
    dispatch(
      validateMandatoryDoc(documentResponse, mandatoryDocumentsList)
    ).then((response: any) => {
      if (Object.keys(response).length > 0) {
        setDocumentError({
          errorType: "missingMandatoryDocument",
          enableError: true,
        });
      } else {
        dispatch(stagesAction.setLastStageId("doc"));
        documentAcknowledge(event);
      }
    });
    event.preventDefault();
  };

  const documentAcknowledge = (event: React.FormEvent<EventTarget>): void => {
    dispatch(dispatchCtaLoader(true));
    if ((getUrl.getDocumentStatus())||uploadEnable) {
      dispatch(urlParamAction.getUrlEndPoit("acknowledge"));
      documentSubmit(
        refernceDetails.applicationReferenceNo!,
        refernceDetails.channelReference!,
        documentState
      )
      .then(async(res: any) => {
          dispatch(documentUploadAction.isDocumentUpdate(false));
          documentState.finalDocumentList = [];
          dispatch(urlParamAction.getUrlEndPoit("success"));
          if(!store.getState().stages.isDocumentUpload && getUrl.getParameterByName("auth") !== "upload"){
          trackEvents.triggerAdobeEvent(
            "ctaClick",
            "Continue",
            documentResponse
          );
          }
          dispatch(dispatchCtaLoader(false));
          documentState.responseDocuments = documentResponse;
          dispatch(documentUploadAction.getDocumentList(documentState));
          if (uploadEnable) {
            
            navigate("/sg/thankyou");
          }
          
          else{
          const state = nextStage("doc", applicationJourney);
          stateUrl(state);
          dispatch(stagesAction.resetCurrentStage(state));
          dispatch(stagesAction.updateStageId(state));
          dispatch(StepCountAction.modifyStepCount(state));
          if(!store.getState().stages.isDocument){
            dispatch(lovRequests(stageSelector[0].stageInfo, state));
          }

          if (getUrl.getJourneyType()) {
            const productsSelector = stageSelector[0].stageInfo.products;
            let JourneyType;
            if (getUrl.getJourneyType() === "ETC") {
              JourneyType = checkProductDetails(productsSelector)
                ? "ETC_CASA"
                : "ETC_CC";
            } else {
              JourneyType = checkProductDetails(productsSelector)
                ? "NON_ETC_CASA"
                : "NON_ETC_CC";
            }
            const nextStage = CONSTANTS[JourneyType];
            const nextStageId = valueSelector.backNavigation.nextStageId;
            let stageUpdate =
              nextStageId && nextStage[state].step > nextStage[nextStageId].step
                ? true
                : false;
            if (
              nextStageId &&
              stageUpdate === false &&
              nextStage[nextStageId].path === "document"
            ) {
              stageUpdate = true;
            }
            dispatch(stagesAction.setIsDocument(true));
            if (!nextStageId || stageUpdate) {
              dispatch(ValueUpdateAction.getNextStageId(state));
            }
          }}
        })
        .catch(() => {
          dispatch(dispatchCtaLoader(false));
        });
    } else {
      dispatch(urlParamAction.getUrlEndPoit("success"));
      if(!store.getState().stages.isDocumentUpload && getUrl.getParameterByName("auth") !== "upload"){
      trackEvents.triggerAdobeEvent("ctaClick", "Continue", documentResponse);
      }
      dispatch(dispatchCtaLoader(false));
      const state = nextStage("doc", applicationJourney);
      stateUrl(state);
      dispatch(stagesAction.resetCurrentStage(state));
      dispatch(stagesAction.updateStageId(state));
      // if(stageSelector[0].stageInfo.applicants['casa_fatca_declaration_a_1']) {
      // dispatch(isFormUpdate(null));
      // }
      if(!store.getState().stages.isDocument){
        dispatch(lovRequests(stageSelector[0].stageInfo, state));
      }
      dispatch(stagesAction.setIsDocument(true));
    }
    event.preventDefault();
  };
  const documentHandleBack = () => {
    if(!store.getState().stages.isDocumentUpload && getUrl.getParameterByName("auth") !== "upload"){
    trackEvents.triggerAdobeEvent("ctaClick", "Back");
    }
    setDocumentError({
      errorType: "",
      enableError: false,
    });
  };

  // const getThumbnail = (uploadedDocList: KeyWithAnyModel, type: string) => {
  //   if (uploadedDocList.docId || (uploadedDocList.document_id && uploadedDocList.document_id.includes("."))) {
  //     dispatch(
  //       getDocumentThumnail(uploadedDocList, type, refernceDetails)
  //     ).then((res: any) => {
  //       uploadedDocList.imageUrl = res;
  //       setDcoumentList([...documentResponse]);
  //       return uploadedDocList;
  //     });
  //   } else {
  //     return "";
  //   }
  // };

  // const openDocPreview = (uploadingDocument: KeyWithAnyModel) => {
  //   const documentName = uploadingDocument.document_id ? uploadingDocument.document_id : uploadingDocument.document_name
  //   const documentType =documentName.split(".").pop();
  //   setSingleDocPreview({
  //     previewPopUp: true,
  //     imageUrl: uploadingDocument.imageUrl,
  //     documentType: documentType,
  //   });
  // };

  const closePreview = () => {
    setSingleDocPreview({
      previewPopUp: false,
      imageUrl: "",
      documentType: null,
    });
  };

  const documentBackHandler = () => {
    if (store.getState().stages.isDocument) {
      // if (valueSelector.backNavigation.nextStageId === "doc") {
      props.backHandler(false);
    } else {
      props.backHandler();
    }
  };

  // const documentExtension = (uploadingDocument:KeyWithAnyModel) =>{
  //   let docName = uploadingDocument.document_id ? uploadingDocument.document_id : uploadingDocument.document_name;
  //   return docName.split(".").pop()
  // }
  return (
    <>
      <form className="form" onSubmit={submitDocument}>
        {documentResponse &&
          documentResponse.map((docList: KeyWithAnyModel, index_i: number) => {
            return (
              <div key={index_i}>
                <div className="document-upload">
                  {docList.document_list.map(
                    (documentTypes: KeyWithAnyModel, index_j: number) => {
                      return (
                        <div
                          className="document-upload__doc-type"
                          key={index_j}
                        >
                          <p className="document-upload__doc-type__header">
                            {documentHeaders(documentTypes.document_category)}
                          </p>
                          <div className="document-upload__doc-list">
                            {documentTypes.document_options.map(
                              (
                                docTypeList: KeyWithAnyModel,
                                docTypeList_key: number
                              ) => {
                                return (
                                  /** Document with radio button List section */
                                  <div key={`dockList${docTypeList_key}`}>
                                    {documentTypes.isSlectedForUpload !==
                                    "Y" ? (
                                      <DocumentUploadRadioButton
                                        documentList={docTypeList}
                                        documentTypes={documentTypes}
                                        setCheckedFlag={setCheckedFlag}
                                      />
                                    ) : (
                                      <div className="document-upload__file-upload">
                                        {docTypeList.document_types.map(
                                          (
                                            docType: KeyWithAnyModel,
                                            docType_key: number
                                          ) => {
                                            return (
                                              <div
                                                key={`docType${docType_key}`}
                                              >
                                                {docType.uploaded_documents &&
                                                  docType.uploaded_documents
                                                    .length >= 0 &&
                                                  docType.uploaded_documents.map(
                                                    (
                                                      uploadingDocument: KeyWithAnyModel,
                                                      upload_Index: number
                                                    ) => {
                                                      return (
                                                        <div
                                                          key={`uploadDoc${upload_Index}`}
                                                        >
                                                          {!uploadingDocument.documentStatus && (
                                                            <div
                                                              key={`uploadList${upload_Index}`}
                                                            >
                                                              {/* Document upload */}
                                                              <DocumentFileUpload
                                                                changeHandler={
                                                                  changeHandler
                                                                }
                                                                documentHeaders={
                                                                  documentHeaders
                                                                }
                                                                index={
                                                                  upload_Index
                                                                }
                                                                documentTypes={
                                                                  documentTypes
                                                                }
                                                                docType={
                                                                  docType
                                                                }
                                                                uploadingDocument={
                                                                  uploadingDocument
                                                                }
                                                              />
                                                              {/* Document upload */}
                                                            </div>
                                                          )}

                                                          {/* Document Upload progress */}

                                                          {uploadingDocument.documentStatus &&
                                                            uploadingDocument.documentStatus !==
                                                              "Accepted" && uploadingDocument.documentStatus !==
                                                              "Rejected" && (
                                                              <div
                                                                key={`uploadStatus${upload_Index}`}
                                                                className={`document-upload__file-upload__upload-section ${uploadingDocument.documentStatus} `}
                                                              >
                                                                <div
                                                                  className="documentavatar"
                                                                  id="documentavatar"
                                                                >
                                                                  {!(
                                                                    uploadingDocument.docId ||
                                                                    uploadingDocument.document_id
                                                                  ) &&
                                                                    !uploadingDocument.imageUrl && (
                                                                      <span></span>
                                                                    )}

                                                                  {(uploadingDocument.docId ||
                                                                    uploadingDocument.document_id) &&
                                                                    !uploadingDocument.imageUrl && (
                                                                      <>
                                                                        <img
                                                                          alt="loading..."
                                                                          className="document-upload__file-upload__hide-upload"
                                                                          // src={getThumbnail(
                                                                          //   uploadingDocument,
                                                                          //   "image"
                                                                          // )}
                                                                          id={
                                                                            "preview_" +
                                                                            documentTypes.document_category +
                                                                            "_" +
                                                                            upload_Index
                                                                          }
                                                                        />
                                                                        <label
                                                                          className="upload-inprogress"
                                                                          htmlFor={
                                                                            "preview_" +
                                                                            documentTypes.document_category +
                                                                            "_" +
                                                                            upload_Index
                                                                          }
                                                                        ></label>
                                                                      </>
                                                                    )}
                                                                </div>

                                                                <div className="document-details">
                                                                  <span className="document-title">
                                                                    {documentHeaders(
                                                                      docType.document_type
                                                                    )}
                                                                  </span>
                                                                  <span
                                                                    style={{
                                                                      width: `${
                                                                        progress[
                                                                          documentTypes
                                                                            .document_category_code
                                                                        ]
                                                                          ? progress[
                                                                              documentTypes
                                                                                .document_category_code
                                                                            ]
                                                                              .progressPercentage
                                                                          : uploadingDocument.progress
                                                                          ? uploadingDocument.progress
                                                                          : 0
                                                                      }%`,
                                                                    }}
                                                                    className={`document-description--progress-bar__ ${
                                                                      documentTypes.document_category_code
                                                                    } ${
                                                                      uploadingDocument.documentStatus ===
                                                                      "REJECTED"
                                                                        ? "document-rejected"
                                                                        : ""
                                                                    } `}
                                                                  ></span>

                                                                  {(uploadingDocument.documentStatus ===
                                                                    "UPLOAD" ||
                                                                    uploadingDocument.documentStatus ===
                                                                      "UPLOADING") && (
                                                                    <span
                                                                      className={`document-description--progress-status`}
                                                                      onClick={
                                                                        cancelUpload
                                                                      }
                                                                    >
                                                                      Uploading
                                                                      in
                                                                      progress...{" "}
                                                                      {
                                                                        uploadingDocument.progress
                                                                      }
                                                                      %
                                                                    </span>
                                                                  )}
                                                                  {uploadingDocument.documentStatus ===
                                                                    "REJECTED" && (
                                                                    <span
                                                                      className={`document-description--progress-status`}
                                                                    >
                                                                      Upload
                                                                      failed...
                                                                    </span>
                                                                  )}
                                                                </div>
                                                                <label className="upload-icon">
                                                                  {uploadingDocument.documentStatus ===
                                                                    "REJECTED" && (
                                                                    <span
                                                                      className="upload-icon--failure"
                                                                      onClick={() => {
                                                                        deleteFile(
                                                                          docType.uploaded_documents,
                                                                          documentTypes,
                                                                          upload_Index,
                                                                          "FAILED"
                                                                        );
                                                                      }}
                                                                    ></span>
                                                                  )}
                                                                  {uploadingDocument.documentStatus ===
                                                                    "UPLOADING" && (
                                                                    <span className="upload-icon--progress"></span>
                                                                  )}
                                                                </label>
                                                              </div>
                                                            )}

                                                          {/* Document Upload progress */}

                                                          {/* Document upload success */}

                                                          {uploadingDocument.documentStatus ===
                                                            "Accepted" && (
                                                            <>
                                                              <div
                                                                className={`document-upload__file-upload__upload-section ${uploadingDocument.documentStatus} `}
                                                              >
                                                                <div
                                                                  className="documentavatar"
                                                                  id="documentavatar"
                                                                >
                                                                  {!(
                                                                    uploadingDocument.docId ||
                                                                    uploadingDocument.document_id
                                                                  ) &&
                                                                    uploadingDocument &&
                                                                    !uploadingDocument.imageUrl && (
                                                                      <>
                                                                        <img
                                                                          alt="loading..."
                                                                          className="document-upload__file-upload__hide-upload"
                                                                          // src={getThumbnail(
                                                                          //   uploadingDocument,
                                                                          //   "image"
                                                                          // )}
                                                                          id={
                                                                            "preview_" +
                                                                            documentTypes.document_category +
                                                                            "_" +
                                                                            upload_Index
                                                                          }
                                                                        />
                                                                        <label
                                                                          className="upload-inprogress"
                                                                          htmlFor={
                                                                            "preview_" +
                                                                            documentTypes.document_category +
                                                                            "_" +
                                                                            upload_Index
                                                                          }
                                                                        ></label>
                                                                      </>
                                                                    )}
                                                                  {(uploadingDocument.docId ||
                                                                    uploadingDocument.document_id) && (
                                                                    <>
                                                                      <div
                                                                        className="documentavatar--pfdPreview"
                                                                        // onClick={() =>
                                                                        //   openDocPreview(
                                                                        //     uploadingDocument
                                                                        //   )
                                                                        // }
                                                                      >
                                                                        {/* {documentExtension(uploadingDocument) === "pdf" ? (
                                                                            <Pdf
                                                                              fileName={
                                                                                uploadingDocument.imageUrl
                                                                              }
                                                                              numPages={
                                                                                1
                                                                              }
                                                                              continueBtn={
                                                                                false
                                                                              }
                                                                            />
                                                                          ) : (
                                                                            // <img
                                                                            //   alt="loading..."
                                                                            //   src={
                                                                            //     uploadingDocument.imageUrl
                                                                            //   }
                                                                            //   onClick={() =>
                                                                            //     openDocPreview(
                                                                            //       uploadingDocument
                                                                            //     )
                                                                            //   }
                                                                            // />
                                                                          )} */}
                                                                        <span className="document-completion"></span>
                                                                      </div>
                                                                    </>
                                                                  )}
                                                                </div>
                                                                <div className="document-details">
                                                                  <span className="document-title">
                                                                    {documentHeaders(
                                                                      docType.document_type
                                                                    )}
                                                                  </span>
                                                                  <span
                                                                    className={`document-description--progress-bar__ ${documentTypes.document_category_code}`}
                                                                  ></span>
                                                                  <span className="document-description--progress-status">
                                                                    File is
                                                                    successfully
                                                                    uploaded.
                                                                  </span>
                                                                </div>
                                                                <label className="upload-icon">
                                                                  <span
                                                                    className="upload-icon--success"
                                                                    onClick={() => {
                                                                      deleteFile(
                                                                        docType.uploaded_documents,
                                                                        documentTypes,
                                                                        upload_Index,
                                                                        "SUCCESS"
                                                                      );
                                                                    }}
                                                                  ></span>
                                                                </label>
                                                              </div>
                                                            </>
                                                          )}

                                                          {/* Document upload success */}

                                                          {/* Document add button */}
                                                          {(uploadingDocument.documentStatus ===
                                                            "Accepted" ||
                                                            uploadingDocument.documentStatus ===
                                                              "UPLOADED") &&
                                                            docType
                                                              .uploaded_documents
                                                              .length -
                                                              1 ===
                                                              upload_Index && (
                                                              <div className="document-upload__doc-type__upload">
                                                                <button
                                                                  className="document-upload__doc-type__upload-btn"
                                                                  onClick={(
                                                                    event
                                                                  ) =>
                                                                    addDocument(
                                                                      docType,
                                                                      documentTypes.document_category_code,
                                                                      event,
                                                                      upload_Index
                                                                    )
                                                                  }
                                                                >
                                                                  Upload
                                                                </button>
                                                              </div>
                                                            )}
                                                          {/* Document add button */}
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  /** Document with radio button List section */
                                );
                              }
                            )}
                          </div>

                          {/* Document upload section */}
                          {documentTypes.isSlectedForUpload !== "Y" && (
                            <div className="document-upload__doc-type__upload">
                              <button
                                className="document-upload__doc-type__upload-btn"
                                onClick={(e) =>
                                  uploadDocument(documentTypes, e)
                                }
                              >
                                Upload
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}

        <div className="document-upload__footer-notes">
          Please ensure that the attached file(s) is of the following
          specification:
          <ul>
            {documentResponse &&
              documentResponse[0] &&
              documentResponse[0].isSignatureDoc && (
                <li>JPG and PNG formats only for Signature Specimen.</li>
              )}
            <li>JPG, PNG, TIFF, and PDF formats</li>
            <li>less than 5 MB.</li>
            <li>Taken without flash.</li>
            <li>File is not encrypted with passwords.</li>
            <li>Your full name is included in all files.</li>
            <li>File is clear and visible to read.</li>
          </ul>
          {documentResponse &&
            documentResponse[0] &&
            documentResponse[0].isSignatureDoc && (
              <p className="signature-doc-notes">
                <span>*</span>I confirm that the electronic image of my
                signature provided is correct and it is also the specimen
                signature that will be used to verify my instruction(s) for this
                account.
              </p>
            )}
        </div>
        <div className="app__footer">
          <Footer
            otherMyinfo={false}
            backHandler={documentBackHandler}
            documentFlag={true}
            uploadJourney={uploadEnable}
          />
        </div>
      </form>

      {/* Error pop up */}
      {documentError.enableError && (
        <PopupModel displayPopup={true}>
          <Model
            name={documentError.errorType}
            handlebuttonClick={documentHandleBack}
            callBackMethod={true}
          />
        </PopupModel>
      )}
      {/* Error pop up */}

      {/* Preview pop up */}
      {singleDocPreview.previewPopUp && (
        <PopupModel displayPopup={true}>
          <span
            className="document_preview-pop-up__close-btn"
            onClick={() => closePreview()}
          >
            X
          </span>
          <div className="document_preview-pop-up popup">
            <div
              id={singleDocPreview.documentType}
              className="popup-container1"
            >
                <img alt="loading..." src={singleDocPreview.imageUrl} />
            </div>
          </div>
        </PopupModel>
      )}
      {/* Preview pop up */}
    </>
  );
};

export default DocumentUpload;

