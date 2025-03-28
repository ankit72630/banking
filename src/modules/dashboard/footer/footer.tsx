import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CONSTANTS } from "../../../utils/common/constants";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import "./footer.scss";
import { getUrl } from "../../../utils/common/change.utils";

const Footer = (props: KeyWithAnyModel) => {
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const [backBtn, setBackBtn] = useState(false);
  const [ctaSpinner, setCtaSpinner] = useState(false);
  const urlEnpoint = getUrl.getUrlEndPoint();

  const backHandler = () => {
    props.backHandler();
  };

  useEffect(() => {
    setCtaSpinner(
      urlEnpoint === "acknowledge" || urlEnpoint === "preserve" ? true : false
    );
  }, [urlEnpoint]);

  useEffect(() => {
    if (stageSelector && stageSelector.length > 0) {
      const isEnableBackBtn =
        stageSelector[0].stageId !== CONSTANTS.STAGE_NAMES.SSF_1 &&
        stageSelector[0].stageId !== CONSTANTS.STAGE_NAMES.BD_1
          ? true
          : false;
      setBackBtn(isEnableBackBtn);
    }
  }, [stageSelector]);

  useEffect(() => {
    if (stageSelector && stageSelector.length > 0) {
      if (
        stageSelector[0].stageId !== CONSTANTS.STAGE_NAMES.SSF_1 &&
        stageSelector[0].stageId !== CONSTANTS.STAGE_NAMES.BD_1 &&
        !props.otherMyinfo
      ) {
        setBackBtn(true);
      } else {
        setBackBtn(props.otherMyinfo);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.otherMyinfo]);

  return (
    <>
      <div className="footer">
        {backBtn && !props.uploadJourney && (
          <div className="back" onClick={backHandler}>
            <span className="arrow"></span> Back
          </div>
        )}
        <button type="submit" className={`continue ${props.validateNxt}`}>
          {ctaSpinner && <div className="circle-spinner"></div>}
          {!ctaSpinner && stageSelector[0].stageId === "rp" || props.uploadJourney == true
            ? "Agree and Submit"
            : "Continue"}
        </button>
      </div>
    </>
  );
};

export default Footer;

