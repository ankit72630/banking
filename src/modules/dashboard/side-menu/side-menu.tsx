import { useState, useEffect } from "react";
import "./side-menu.scss";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useDispatch, useSelector } from "react-redux";
import { CONSTANTS } from "../../../utils/common/constants";
import { stagesAction } from "../../../utils/store/stages-slice";
import { ValueUpdateAction } from "../../../utils/store/value-update-slice";
import { fieldErrorAction } from "../../../utils/store/field-error-slice";
import {
  dispatchLoader,
  isFormUpdate,
  lovRequests,
} from "../../../services/common-service";
import { getLovMissing } from "../fields/fields.utils";

const SideMenu = (props: KeyWithAnyModel) => {
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const applicationJourney = useSelector(
    (state: StoreModel) => state.stages.journeyType
  );
  const otherMyinfoSelector = useSelector(
    (state: StoreModel) => state.valueUpdate
  );
  const lovSelector = useSelector((state: StoreModel) => state.lov);
  const resumeSelector = useSelector(
    (state: StoreModel) => state.urlParam.resume
  );

  const [currentStageClass, setcurrentStageClass] = useState<string | null>(
    null
  );
  const [sideMenuIndex, setSideMenuIndex] = useState<string | null>(null);
  const [filterLeftMenu, setFilterLeftMenu] = useState([]);
  const dispatch = useDispatch();

  const sideMenuHandler = (stageID: string) => {
    dispatch(stagesAction.updateLastStageInput(stageSelector[0].stageId));
    /** Enabled go back logics */
      dispatch(
        ValueUpdateAction.getChangeUpdate({
          id: stageSelector[0].stageId!,
          changes: false
        })
      );
    /** LOV request will be triggered if see other myinfo stage for side menu */
    if (stageID === "ssf-2") {
      dispatch(ValueUpdateAction.updateOtherMyinfo(true));
      if (!otherMyinfoSelector.otherMyInfo) {
        dispatch(dispatchLoader(true));
        dispatch(lovRequests(stageSelector[0].stageInfo, "ssf-2", null));
      }
    }
    /** Reseting the mandatory fields and stageID */
    if (stageID !== "ssf-1") {
      dispatch(fieldErrorAction.getMandatoryFields(null));
      dispatch(isFormUpdate(true));
      dispatch(stagesAction.resetCurrentStage(stageID));
      dispatch(stagesAction.updateStageId(stageID));
    }
    setcurrentStageClass(stageID);
    //Adding lov call incase of resume previous stage side menu click
    if (resumeSelector) {
      dispatch(
        getLovMissing(
          stageID,
          stageSelector[0].stageInfo.fieldMetaData.data.stages,
          lovSelector
        )
      );
    }
    props.setSelectedLeftMenu(stageID);
    setSideMenuIndex(stageID);
  };
  useEffect(() => {
    const JourneyType = applicationJourney === "ETC" ? "ETC" : "NON_ETC";
    const flitereddata: any = Object.entries(CONSTANTS[JourneyType]).filter(
      (item: KeyWithAnyModel) => {
        const isIbanking = (stageSelector && stageSelector[0].stageInfo && stageSelector[0].stageInfo.applicants['auth_mode_a_1'] === 'IX')
        if (isIbanking) {
          return (
            item[0] !== "totalStages" &&
            item[0] !== "bd-1" &&
            item[0] !== "doc" &&
            item[0] !== "bd-3"
          );
        }
        if (
          stageSelector &&
          stageSelector[0].stageInfo["applicant_documents"] &&
          stageSelector[0].stageInfo["applicant_documents"].length > 0
        ) {
          return (
            item[0] !== "totalStages" &&
            item[0] !== "bd-1" &&
            item[0] !== "bd-1"
          );
        } else {
          return (
            item[0] !== "totalStages" &&
            item[0] !== "bd-1" &&
            item[0] !== "bd-1" &&
            item[0] !== "doc"
          );
        }
      }
    );
    setFilterLeftMenu(flitereddata);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSelector[0].stageId]);

  useEffect(() => {
    setcurrentStageClass(stageSelector[0].stageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideMenuIndex, stageSelector]);

  const idChange = (data: string) => {
    return data === "ssf-1" ? "bd-1" : data;
  };

  return (
    <div className="leftmenu">
      {filterLeftMenu.length > 0 &&
        filterLeftMenu.map((item: KeyWithAnyModel) => {
          return (
            <div
              className={
                currentStageClass === idChange(item[0])
                  ? "current__stage__icon"
                  : "stage__completed"
              }
              key={idChange(item[0])}
            >
              <span
                onClick={() => {
                  sideMenuHandler(idChange(item[0]));
                }}
              >
                {item[1].name}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default SideMenu;

