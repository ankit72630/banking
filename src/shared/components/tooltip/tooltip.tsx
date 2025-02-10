import React, { useEffect, useRef, useState } from "react";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { FindIndex } from "../../../utils/common/change.utils";
import "./tooltip.scss";
import { useSelector } from "react-redux";
import { checkProductDetails } from "../../../services/common-service";

const Tooltip = (props: KeyWithAnyModel) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [isCASAProduct, setIsCASAProduct] = useState<boolean>(false);
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);

  const tooltipRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const productCategory = checkProductDetails(
      stageSelector[0].stageInfo.products
    );
    setIsCASAProduct(productCategory);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (tooltipRef.current && props.isTooltipOpen) {
        props.setIsTooltipOpen(false);
      }
      if (tooltipRef.current && props.isTooltipOpen === false) {
        props.setIsTooltipOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isTooltipOpen]);

  useEffect(() => {
    tooltipRef.current?.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltipRef]);

  const getTooltipContent = (stageInfoDetails: any) => {
    let fieldIndex;
    if (isCASAProduct === false) {
      if (stageInfoDetails.stageId === "ssf-1") {
        fieldIndex = stageInfoDetails.fields.findIndex(
          (fieldIndex: any) =>
            fieldIndex.logical_field_name === "contact_preference"
        );
      }
      if (stageInfoDetails.stageId === "ssf-2") {
        fieldIndex = stageInfoDetails.fields.findIndex(
          (fieldIndex: any) =>
            fieldIndex.logical_field_name === "other_name_or_alias"
        );
      }

      if (fieldIndex >= 0) {
        const stageObj = stageInfoDetails.fields[fieldIndex];
        setTooltipContent(stageObj.details);
      }
    }
  };
  useEffect(() => {
    if (props.stageID !== "rp") {
      const index = FindIndex(stageSelector[0].stageInfo, props.stageID);
      const stageInfoDetails =
        stageSelector[0].stageInfo.fieldMetaData.data.stages[index];
      getTooltipContent(stageInfoDetails);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stageID]);

  return (
    <>
      {props.isTooltipOpen && tooltipContent !== "" && (
        <div className="tooltipContainer">
          <div className="tooltip" ref={tooltipRef}>
            {tooltipContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;

