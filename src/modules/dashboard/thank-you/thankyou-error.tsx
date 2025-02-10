import "./thank-you.scss";
import { KeyWithAnyModel } from "../../../utils/model/common-model";
import ThankYouBanner from "./thankyou-banner";

const ThankyouError = (props: KeyWithAnyModel) => {
  const applicationDetails = props.applicationDetails;
  const thankyou = props.thankyou;
  return (
    <>
      <ThankYouBanner
        banner_header={thankyou.CCPL.error.banner_header}
        banner_content={false}
      />
      <div className="thankyou__body__outer">
        <div className="thankyou__body">
          <div className="thankyou__title">{thankyou.CCPL.error.title}</div>
          <div className="body__notes">
            <div className="body__notes__desc">
              <div>{thankyou.CCPL.error.content_1}</div>
              <div>{thankyou.CCPL.error.content_2}</div>
              {applicationDetails.errorID && (
                <div>
                  <label>{thankyou.CCPL.error.error_id_lbl}</label>{" "}
                  {applicationDetails.errorID}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="body__refno">
          <button
            onClick={(e) => props.goToIBanking(e)}
            className="thankyou__continue"
          >
            {thankyou[applicationDetails.thankyouText].doneButton}
          </button>
      </div>
    </>
  );
};

export default ThankyouError;

