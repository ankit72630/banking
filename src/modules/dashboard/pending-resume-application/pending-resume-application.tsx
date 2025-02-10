import "./pending-resume-application.scss";
import {
  dispatchLoader,
  lovRequests,
  resumeRequest,
  uploadRequest,
} from "../../../services/common-service";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "../../dashboard/header/header";
import LeftSideBar from "../../dashboard/left-sidebar/left-sidebar";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useNavigate } from "react-router";
import { urlParamAction } from "../../../utils/store/urlparam-slice";
import { stagesAction } from "../../../utils/store/stages-slice";
import { bancaListAction } from "../../../utils/store/banca-slice";
import { taxAction } from "../../../utils/store/tax-slice";
import { authAction } from "../../../utils/store/auth-slice";
import { referralcodeAction } from "../../../utils/store/referral-code-slice";

const PendingApplication = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emptyApplication, setEmptyApplication] = useState(false);
  const pendingApplicationSelector = useSelector(
    (state: StoreModel) => state.pendingApplication
  );
  const [pendingApplicationsFormatted, setPendingApplicationsFormatted] =
    useState<any>([]);

  useEffect(() => {
    dispatch(dispatchLoader(false));
    if (
      pendingApplicationSelector &&
      pendingApplicationSelector.pendingApplication &&
      pendingApplicationSelector.pendingApplication.length > 0
    ) {
      let pendingApplicationNumbers: any = {
        pendingApplication: [],
        pendingDocument: [],
        unresumableApplications: [],
      };
      for (
        var i = 0;
        pendingApplicationSelector.pendingApplication.length > i;
        i++
      ) {
        if (
          pendingApplicationSelector.pendingApplication[i].Status ===
          "PendingDocuments"
        ) {
          pendingApplicationNumbers.pendingDocument.push(
            getApplicantDetails(
              pendingApplicationSelector.pendingApplication[i]
            )
        );
      } else if (
        pendingApplicationSelector.pendingApplication[i].Status === "WIP" &&
        pendingApplicationSelector.pendingApplication[i].OnbSaveFlag === "Y"
      ) {
        pendingApplicationNumbers.pendingApplication.push(
          getApplicantDetails(
            pendingApplicationSelector.pendingApplication[i]
          )
        );
      } else {
        pendingApplicationNumbers.unresumableApplications.push(
          getApplicantDetails(
            pendingApplicationSelector.pendingApplication[i]
          )
        );
    }
    }

      setEmptyApplication(false);
      setPendingApplicationsFormatted(pendingApplicationNumbers);
    } else {
      setEmptyApplication(true);
      setPendingApplicationsFormatted([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getApplicantDetails = (pendingList: KeyWithAnyModel) => {
    return {
      ProductName: pendingList.ProductName,
      ApplicationRefNo: pendingList.ApplicationRefNo,
      ChannelRef: pendingList.ChannelRefNo,
      ExpiryDate: caculateExpiry(pendingList.ExpiryDate),
      OnbSaveFlag: pendingList.OnbSaveFlag,
      ApplicationStatus: pendingList.ApplicationStatus,
    };
  };
  const openApplication = (appRefId: string, chnRefNo: string) => {
    if (chnRefNo.substring(0, 3) === "02r") {
      dispatch(dispatchLoader(true));
      const refNo = appRefId;
      dispatch(urlParamAction.getAuthorize({ applicationRefNo: refNo }));
      dispatch(resumeRequest(refNo)).then(async (response: any) => {
        if (response) {
          if (response.application && response.application.journey_type) {
            dispatch(
              stagesAction.setJourneyType(response.application.journey_type)
            );
          }
          const stageTo = response.application.stage.page_id;
          if (
            response.applicant_documents &&
            response.applicant_documents[0] &&
            response.applicant_documents[0].document_list &&
            response.applicant_documents[0].document_list.length <= 0
          ) {
            delete response.applicant_documents;
          }
          dispatch(
            stagesAction.getStage({
              id: stageTo,
              formConfig: response,
            })
          );
          dispatch(referralcodeAction.setReferralId(response.application.referral_id_2));
          dispatch(stagesAction.updateTaxFields(response.applicants));
          dispatch(bancaListAction.getBancaData(response.applicants));
          dispatch(stagesAction.updateUserInputFields(response.applicants));
          dispatch(taxAction.updateTax(response.applicants));
          dispatch(lovRequests(response, stageTo));
          dispatch(stagesAction.resetCurrentStage(stageTo));
          dispatch(stagesAction.setOtpResume(true));
          navigate("/sg/super-short-form");
        }
      });
    } else {
      var currentEnvPath = "rtob-FFF/www";
      var formsURLs =
        window.origin +
        "/onboarding/" +
        currentEnvPath +
        "/rtoForms/index.html?";
      //window.sessionStorage.setItem("session_id", $rootScope.sessionUID);
      window.sessionStorage.setItem("ref", appRefId);
      window.location.href = `${formsURLs}/resumeOtp?country=SG`;
    }
  };

  const openUploadDocument = (appRefId: string,productName : string) => {
    dispatch(dispatchLoader(true));
    dispatch(urlParamAction.isUpload(true));
    dispatch(urlParamAction.getAuthorize({ applicationRefNo: appRefId }));
    dispatch(uploadRequest(appRefId)).then(async (response: any) => {
      if (response) {
        dispatch(stagesAction.setIsDocumentUpload(true));
        if (
          response.applicant_documents &&
          response.applicant_documents[0] &&
          response.applicant_documents[0].document_list &&
          response.applicant_documents[0].document_list.length <= 0
        ) {
          delete response.applicant_documents;
        }
        response.products = [];
        response.products.push({'name':productName})
        dispatch(
          stagesAction.getStage({
            id: "doc",
            formConfig: response,
          })
        );
        
        dispatch(stagesAction.resetCurrentStage("doc"));
        dispatch(stagesAction.updateUserInputFields(response.applicants));
        dispatch(lovRequests(response, 'doc'));
        dispatch(stagesAction.resetCurrentStage('doc'));
        dispatch(stagesAction.setOtpResume(true));
        navigate("/sg/super-short-form");
      }
    });
};

  const caculateExpiry = (expiryDate: any) => {
    let appExpryDate = expiryDate;
    // let sgdTime = calcTime('+8');

    let date = new Date();
    let currentDateFormat = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-${("0" + date.getDate()).slice(-2)}T${(
      "0" + date.getHours()
    ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${(
      "0" + date.getSeconds()
    ).slice(-2)}`;
    let appExpryDateFormat = formatDate(appExpryDate);
    let diff = +new Date(appExpryDateFormat) - +new Date(currentDateFormat);
    let expireCount = Math.trunc(diff / (1000 * 3600 * 24));
    let current_date = new Date(currentDateFormat);
    console.log("Current date: ", current_date, currentDateFormat);

    const newDate = current_date.setDate(current_date.getDate() + expireCount);
    let expirydate = new Date(newDate);
    // return expireCount.toString();
    return expirydate.toString().substring(4, 15);
  };
  const formatDate = (expiryDate: string) => {
    let year = expiryDate.toString().split(".")[0].substring(0, 4);
    let month = expiryDate.toString().split(".")[0].substring(4, 6);
    let day = expiryDate.toString().split(".")[0].substring(6, 8);
    let hours = expiryDate.toString().split(".")[0].substring(9, 11);
    let minutes = expiryDate.toString().split(".")[0].substring(11, 13);
    let seconds = expiryDate.toString().split(".")[0].substring(13, 15);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="pending-doc app">
      <div className="app__header-resume">
        <div>
          <LeftSideBar />
        </div>
      </div>
      <div className="app__body">
        <div>
          <Header />
        </div>
        <div>
          <div className="app__list">
          {pendingApplicationsFormatted.pendingApplication &&
              pendingApplicationsFormatted.pendingApplication.length > 0 && (
            <div className="app-header">
              Here are your saved application in last 21 days. Please
                  continue to submit your applications
            </div>
            )}
            {pendingApplicationsFormatted.pendingApplication &&
              pendingApplicationsFormatted.pendingApplication.length > 0 &&
              pendingApplicationsFormatted.pendingApplication.map(
                (res: any, index: any) => {
                return (
                  <div
                      className="application-list"
                      key={res?.ApplicationRefNo}
                    >
                    <div className="application-list__info">
                      <div className="application-list__name">
                        {res?.ProductName}
                      </div>
                      <div className="application-list__details">
                        <div className="application-list__ref">
                          Ref ID: {res?.ApplicationRefNo}
                        </div>
                        <div className="application-list__expdate">
                          <span className="expire-icon"></span> Expiring in{" "}
                          {res?.ExpiryDate}
                        </div>
                        <div className="application-list__ref">
                            {res?.ApplicationStatus}
                        </div>
                      </div>
                    </div>
                    <div
                      className="application-list__btn"
                      onClick={(e) =>
                        openApplication(res.ApplicationRefNo, res.ChannelRef)
                      }
                    >
                      Resume
                    </div>
                  </div>
                );
              }
              )}
            {pendingApplicationsFormatted.pendingDocument &&
              pendingApplicationsFormatted.pendingDocument.length > 0 && (
                <div className="app-header">
                  Please continue to upload your documents
                </div>
              )}

            {pendingApplicationsFormatted.pendingDocument &&
              pendingApplicationsFormatted.pendingDocument.length > 0 &&
              pendingApplicationsFormatted.pendingDocument.map(
                (res: any, index: any) => {
                return (
                  <div
                      className="application-list"
                      key={res?.ApplicationRefNo}
                    >
                    <div className="application-list__info">
                      <div className="application-list__name">
                        {res?.ProductName}
                      </div>
                      <div className="application-list__details">
                        <div className="application-list__ref">
                          Ref ID: {res?.ApplicationRefNo}
                        </div>
                        <div className="application-list__ref">
                            {res?.ApplicationStatus}
                          </div>
                      </div>
                    </div>
                    <div
                      className="application-list__btn"
                      onClick={(e) =>
                        openUploadDocument(res.ApplicationRefNo,res.ProductName)
                      }
                    >
                      Upload
                    </div>
                  </div>
                );
              }
              )}

            {pendingApplicationsFormatted.unresumableApplications &&
              pendingApplicationsFormatted.unresumableApplications.length >
                0 && (
                <div className="app-header">
                  Please find the status of your other applications below
                </div>
              )}
            {pendingApplicationsFormatted.unresumableApplications &&
              pendingApplicationsFormatted.unresumableApplications.length > 0 &&
              pendingApplicationsFormatted.unresumableApplications.map(
                (res: any, index: any) => {
                  return (
                    <div
                      className="application-list"
                      key={res?.ApplicationRefNo}
                    >
                      <div className="application-list__info">
                        <div className="application-list__name">
                          {res?.ProductName}
                        </div>
                        <div className="application-list__details">
                          <div className="application-list__ref">
                            Ref ID: {res?.ApplicationRefNo}
                          </div>
                          <div className="application-list__ref">
                            {res?.ApplicationStatus}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}

            {emptyApplication && (
              <div className="application-list">
                Sorry! there are no pending applications found to continue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApplication;

