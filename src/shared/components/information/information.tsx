import DOMPurify from "dompurify";
import { fieldIdAppend } from "../../../utils/common/change.utils";
import "./information.scss";
import { useSelector } from "react-redux";
import { StoreModel } from "../../../utils/model/common-model";
import Model from "../model/model";
import { useEffect, useState } from "react";
import { checkProductDetails } from "../../../services/common-service";

export const Information = (props: any) => {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isHideTooltipIcon, setIsHideTooltipIcon] = useState<boolean>(true);
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const getMarkup = () => {
    return {
      __html: DOMPurify.sanitize(`
          <div>${props.data.rwb_label_name}</div>
        `),
    };
  };

  const taxSelector = useSelector((state: StoreModel) => state.tax);

  useEffect(() => {
    const checkProductCategory = checkProductDetails(
      stageSelector[0].stageInfo.products
    );
    setIsHideTooltipIcon(checkProductCategory ? true : false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handlePopupBackButton = () => {
    setShowInfoPopup(false);
  };

  return (
    <div
      className={
        (taxSelector && taxSelector.count < taxSelector.maxCount) ||
        props.data.logical_field_name !== "add_tax_residency_note"
          ? "show-info, info-top"
          : "hide-info"
      }
    >
      {stageSelector[0].stageId === "ad-1" && <div className="info__icon"> </div>}
      <div
        className="info"
        dangerouslySetInnerHTML={getMarkup()}
        id={fieldIdAppend(props)}
      ></div>   
      {props.data.info_tooltips === "Yes" && isHideTooltipIcon === false && (
        <div className="tool-tip__icon">
          <div
            className="tool-tip"
            onClick={() => setShowInfoPopup(true)}
          ></div>
         
        </div>
      )}
      {showInfoPopup && (
        <Model name={props.data.logical_field_name} isTooltip={true} data={props.data.details}  handlebuttonClick={handlePopupBackButton} />
      )}
    </div>
  );
};

export default Information;

