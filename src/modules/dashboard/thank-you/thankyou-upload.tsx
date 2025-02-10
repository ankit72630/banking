import "./thank-you.scss";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import ThankYouTimeline from "./thankyou-timeline";
import ThankYouBanner from "./thankyou-banner";
import { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ThankYouUpload = (props: KeyWithAnyModel) => {
  const applicationDetails = props.applicationDetails;
  const thankyou = props.thankyou;
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const getTimelineData = () => {
    return [
      {
        header:"Your Documents has been submitted and is being processed now.",
        content:thankyou.Upload.timeline_desc_upload,
        completed_status: true,
      },
      {
        header: "For further assistance, please email to Client Care Centre at sc.com or chat with us via Live Chat at sc.com (operating hours from 9am to 12 midnight, daily including public holidays).",
        content:thankyou.Upload.timeline_desc_upload,
        completed_status: true,
      },
    ];
  };

  

  return (
    <>
      
        <ThankYouBanner
          banner_header={thankyou.Upload.banner_header_upload}
          banner_content={true}
          
        />
      
      <div className="thankyou__body__outer">
        <div className="thankyou__body">
          
          <div className="body__app-details">
            <label>
              {thankyou[applicationDetails.thankyouText].applicationNumber}
            </label>
            <div className="app-details__ref-no">
              {props.applicationReferenceNo!}
            </div>
          </div>
          
          <ThankYouTimeline
            title={thankyou.Upload.timeLine_upload}
            data={getTimelineData()}
            checkCompletedStatus={false}
          />
          
        </div>
      </div>
      <div className="body__refno">
        <button
          onClick={(e) => props.submitForm(e)}
          className="thankyou__continue"
        >
          {thankyou[applicationDetails.thankyouText].nextButton}
        </button>
      </div>
    </>
  );
};

export default ThankYouUpload;
