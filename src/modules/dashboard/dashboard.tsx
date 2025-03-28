import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./dashboard.scss";
import Header from "./header/header";
import Fields from "./fields/fields";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  dispatchLoader,
  getClientInfo,
  lovRequests,
  resumeRequest,
  uploadRequest,
} from "../../services/common-service";
import { StoreModel } from "../../utils/model/common-model";
import MyinfoSingpassLogin from "../../shared/components/myinfo-singpass-login-modal/myinfo-singpass-login";
import PopupModel from "../../shared/components/popup-model/popup-model";
import { urlParamAction } from "../../utils/store/urlparam-slice";
import Model from "../../shared/components/model/model";
import { loaderAction } from "../../utils/store/loader-slice";
import { store } from "../../utils/store/store";
import { getUrl } from "../../utils/common/change.utils";
import { authAction } from "../../utils/store/auth-slice";
import { stagesAction } from "../../utils/store/stages-slice";
import { taxAction } from "../../utils/store/tax-slice";
import { bancaListAction } from "../../utils/store/banca-slice";
import OTPModel from "../../shared/components/otp-modal/otp";
import { nextStage } from "./fields/stage.utils";
import { referralcodeAction } from "../../utils/store/referral-code-slice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const urlParams = useLocation();
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const myInfoAuthSelector = useSelector(
    (state: StoreModel) => state.urlParam.myInfo
  );
  const otpShowSelector = useSelector(
    (state: StoreModel) => state.stages.otpOpen
  );
  const otpResumeSelector = useSelector(
    (state: StoreModel) => state.stages.otpResume
  );
  const referralcodeSelector = useSelector((state: StoreModel) => state.referralcode);
  const [urlInvalid, setUrlInvalid] = useState(false);
  const [marginTop, setMarginTop] = useState(0);
  const headerHeight = useRef<HTMLInputElement>(null);
  const [fieldsComponent, setFieldsComponent] = useState(false);
  const [pointer, setPointer] = useState(false);
  const ctaLoader: any = getUrl.getLoader().cta;
  const [isMobileView, setIsMobileView] = useState<number>(0);
  const [uploadJourney, setFieldsUpload] = useState(false);

  useEffect(() => {
    if (ctaLoader) {
      setPointer(ctaLoader.cta ? true : false);
    }
  }, [ctaLoader]);

  useLayoutEffect(() => {
    let clearSetTimeout: ReturnType<typeof setTimeout>;
    function updateSize() {
      setIsMobileView(window.innerWidth < 768 ? 110 : 167);
      if (headerHeight.current) {
        clearSetTimeout = setTimeout(() => {
          setMarginTop(headerHeight && headerHeight.current!["offsetHeight"]);
        }, 100);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(clearSetTimeout);
    };
  }, [stageSelector]);

  useEffect(() => {
    if (otpResumeSelector) {
      setFieldsComponent(true);
      //dispatch(stagesAction.setOtpResume(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpResumeSelector]);
  
  useEffect(() => {
    dispatch(dispatchLoader(true));
    dispatch(urlParamAction.getUrlParameter(urlParams));
    if (!store.getState().urlParam.validUrl) {
      dispatch(
        loaderAction.getState({
          isFetching: false,
        })
      );
      setUrlInvalid(true);
    } else if (getUrl.getParameterByName("auth") === "resume") {
      dispatch(urlParamAction.isResume(true));
      /* var mobilenumber = sessionStorage.getItem("mobileNumber");
      dispatch(getClientInfo()).then(async (response: any) => {
        if (response) {
          setFieldsComponent(true);
          navigate("/otp");
        }
      });*/
      dispatch(
        authAction.getSession({
          sessionuid: sessionStorage.getItem("session_id"),
        })
      );
      const refNo = sessionStorage.getItem("ref");
    dispatch(urlParamAction.getAuthorize({ applicationRefNo: refNo }));
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("ref");
    dispatch(resumeRequest(refNo)).then(async (response: any) => {
      if (response) {
        if (response.application && response.application.journey_type) {
          dispatch(
            stagesAction.setJourneyType(response.application.journey_type)
          );
        }
        setFieldsComponent(true);
        let stageTo = response.application.stage.page_id;
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

        if (stageTo === "ssf-1" && response.application.journey_type) {
          stageTo = nextStage(stageTo, response.application.journey_type);
          dispatch(
            stagesAction.getStage({
              id: stageTo,
              formConfig: response,
            })
          );
        }
        dispatch(referralcodeAction.setReferralId(response.application.referral_id_2));
        dispatch(stagesAction.updateTaxFields(response.applicants));
        dispatch(bancaListAction.getBancaData(response.applicants));
        dispatch(stagesAction.updateUserInputFields(response.applicants));
        dispatch(taxAction.updateTax(response.applicants));
        dispatch(lovRequests(response, stageTo));
      }
    }); 
    } else if (getUrl.getParameterByName("auth") === "upload") {
      setFieldsUpload(true);
      dispatch(urlParamAction.isUpload(true))
      dispatch(
        authAction.getSession({
         sessionuid: sessionStorage.getItem("session_id"),
        })
      );
      const refNo = sessionStorage.getItem("ref");
      dispatch(urlParamAction.getAuthorize({ applicationRefNo: refNo }));
      sessionStorage.removeItem("session_id");
      sessionStorage.removeItem("ref");
      dispatch(uploadRequest(refNo)).then(async (response: any) => {
        if (response) {
          setFieldsComponent(true);
         // const stageTo = response.application.stage.page_id;
         
          if (
            response.applicant_documents &&
            response.applicant_documents[0] &&
            response.applicant_documents[0].document_list &&
            response.applicant_documents[0].document_list.length <= 0
          ) {delete response.applicant_documents;
          }
          dispatch(
            stagesAction.getStage({
              id: 'doc',
              formConfig: response,
            })
          );
        }
      });
    } else {
      dispatch(getClientInfo()).then(async (response: any) => {
        if (response) {
          setFieldsComponent(true);
          navigate("sg/super-short-form");
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() =>{

    if(stageSelector && stageSelector[0] && stageSelector[0].stageInfo.application.refer){
      dispatch(referralcodeAction.setReferralFlag(stageSelector[0].stageInfo.application.refer));
    }
    if(stageSelector && stageSelector[0]  && stageSelector[0].stageInfo.application.referId){
      if(referralcodeSelector && !(referralcodeSelector.referId)){
        dispatch(referralcodeAction.setReferralId(stageSelector[0].stageInfo.application.referId));
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[stageSelector && stageSelector[0] && stageSelector[0].stageInfo.application])

  return (
    <>
      {(urlInvalid || myInfoAuthSelector) && (
        <PopupModel displayPopup={myInfoAuthSelector || urlInvalid}>
          {urlInvalid ? <Model name="globalError" /> : <MyinfoSingpassLogin />}
        </PopupModel>
      )}

      {stageSelector &&
        stageSelector[0] &&
        stageSelector[0].stageId === "bd-3" &&
        otpShowSelector && <OTPModel />}

      {stageSelector && stageSelector.length > 0 && !otpShowSelector && (
        <div className="app">
          <div className="app__header">
            <div ref={headerHeight}>
              <Header />
            </div>
          </div>
          <div
            className={`app__body ${pointer ? "pointer-none" : ""}`}
            style={{
              marginTop: marginTop + "px",
              height: `calc(100dvh - ${marginTop + isMobileView}px)`,
            }}
          >
            <div className="wrapper">
              <div>{fieldsComponent && <Fields />}</div>
              <div>{/* <NeedHelp /> */}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

