import React, { useEffect, useState } from "react";
import "./progressbar.scss";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useSelector } from "react-redux";
import { getUrl } from "../../../utils/common/change.utils";
import { CONSTANTS } from "../../../utils/common/constants";
import { checkProductDetails } from "../../../services/common-service";

const ProgressBar = () => {
  const stageSelector = useSelector((state: StoreModel) => state.stages);
  const productsSelector = useSelector(
    (state: StoreModel) => state.stages.stages[0].stageInfo.products
  );
  const applicationReferenceNo = getUrl.getChannelRefNo().applicationRefNo;
  const appJourneyType = stageSelector.journeyType;
  const stageIdData: KeyWithAnyModel = CONSTANTS;
  const etcData: KeyWithAnyModel = checkProductDetails(productsSelector)
    ? stageIdData.ETC_CASA
    : stageIdData.ETC_CC;
  const nonEtcData: KeyWithAnyModel = checkProductDetails(productsSelector)
    ? stageIdData.NON_ETC_CASA
    : stageIdData.NON_ETC_CC;
  const [stepDetails, setStepDetails] = useState({
    stepIndex: "",
    totalStages: "",
    progressbarWidth: "",
  });
  useEffect(() => {
    setStepDetails((value) => {
      if (appJourneyType === "ETC") {
        value.totalStages = etcData.totalStages;
        value.stepIndex = etcData[stageSelector.stages[0].stageId].step;
      } else {
        value.totalStages = nonEtcData.totalStages;
        value.stepIndex = nonEtcData[stageSelector.stages[0].stageId].step;
      }
      value.progressbarWidth = (
        (Number(value.stepIndex) / Number(value.totalStages)) *
        100
      ).toString();
      return { ...value };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSelector]);

  return (
    <>
      <div className="progress__header">
        {applicationReferenceNo ? (
          <div className="app_ref">
            Application No.: {applicationReferenceNo}
          </div>
        ) : (
          ""
        )}
        <div className="steps-counter">
          <span>STEP </span>
          <span>{stepDetails.stepIndex}/</span>
          <span>{stepDetails.totalStages}</span>
        </div>
      </div>
      <div className="progress">
        <div
          className="progress__bar"
          style={{ width: stepDetails.progressbarWidth + "%" }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;

