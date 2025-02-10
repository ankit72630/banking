import { useEffect, useState } from "react";
import "./step-count.scss";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useDispatch, useSelector } from "react-redux";
import { getStageCounts } from "../../../utils/common/constants";
import { checkProductDetails } from "../../../services/common-service";
import { authenticateType, getUrl, removeStageIds } from "../../../utils/common/change.utils";
import { StepCountAction } from "../../../utils/store/step-count-slice";

const StepCount = () => {
  const dispatch = useDispatch();
  const stageSelector = useSelector((state: StoreModel) => state.stages);
  const JourneySelector = useSelector((state: StoreModel) => state.stages.journeyType);
  const stepCountSelector = useSelector((state: StoreModel) => state.stepCount);
  const journeyUpdateSelector = useSelector(
    (state: StoreModel) => state.stepCount.journeyUpdate
  );
  const productsSelector = useSelector(
    (state: StoreModel) => state.stages.stages[0].stageInfo.products
  );
  
  const [stepDetails, setStepDetails] = useState({
    stepIndex: "",
    totalStages: "",
    progressbarWidth: "",
  });

  

  useEffect(() => {
    const stageIdData: KeyWithAnyModel = getStageCounts();
    const etcData: KeyWithAnyModel = checkProductDetails(productsSelector)
      ? stageIdData.ETC_CASA
      : stageIdData.ETC_CC;

    let nonEtcData: KeyWithAnyModel = checkProductDetails(productsSelector)
      ? stageIdData.NON_ETC_CASA
      : stageIdData.NON_ETC_CC;

    const flowType = authenticateType();
    if(!(stepCountSelector.steps)) {
      if(flowType === 'ibnk') {
        dispatch(StepCountAction.setStepCount(etcData));
      } else {
        if (getUrl.getParameterByName("auth") === "resume") {
          let default_seq = removeStageIds(stageSelector);
          const currentId =
            stageSelector.stages[0].stageInfo.application.stage.page_id;
          const currentStageIndex = default_seq.indexOf(currentId) + 1;
          default_seq.splice(currentStageIndex, default_seq.length - 1);
          default_seq.forEach((stageId: string, index: number) => {
            let curr_index = index + 1;
            nonEtcData[stageId].step = (
              parseInt(nonEtcData.startCount) + curr_index
            ).toString();
          });
          nonEtcData.startCount =
            default_seq.length + parseInt(nonEtcData.startCount);
          if (default_seq.includes("doc")) {
            nonEtcData.totalStages = parseInt(nonEtcData.startCount) + 1;
          }
          if (default_seq.includes("bd-2")) {
            nonEtcData.totalStages = parseInt(nonEtcData.startCount) + 1;
          }
          if (default_seq.includes("ld-1")) {
            nonEtcData.totalStages = parseInt(nonEtcData.startCount) + 1;
          }
        }
        dispatch(StepCountAction.setStepCount(nonEtcData));
      }
    } else if(!journeyUpdateSelector && JourneySelector === 'ETC') {
        dispatch(StepCountAction.setStepCount(etcData));
        dispatch(StepCountAction.setJourneyUpdate(true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSelector && stageSelector.stages[0].stageId, JourneySelector]);

  useEffect(() => {
    const stepCount = getUrl.getSteps().steps;
    setStepDetails((value) => {
      if(stepCount) {
        value.totalStages = stepCount.totalStages;
        value.stepIndex = stepCount[stageSelector.stages[0].stageId].step;
      }
      return { ...value };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSelector, JourneySelector]);

  return (
    <>
      <div className="steps-counter">
        (<span>{stepDetails.stepIndex}/</span>
        <span>{stepDetails.totalStages}</span>)
      </div>
    </>
  );
};

export default StepCount;

