import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { StoreModel } from "../../../utils/model/common-model";
import "./header.scss";
import Close from "../../../shared/components/close/close";
import Title from "../../../utils/common/header-titles";
import Logo from "../../../shared/components/logo/logo";
import StepCount from "../../../shared/components/step-count/step-count";
import {resumeHeaderText} from "../../../utils/common/constants";
import { store } from "../../../utils/store/store";
import { getUrl } from "../../../utils/common/change.utils";

const Header = () => {
  const stageSelector = useSelector((state: StoreModel) => state.stages);
  const applicationJourney = useSelector(
    (state: StoreModel) => state.stages.journeyType
  );
  const [productDetails, setProductDetails] = useState();
  const [headerTitle, setHeaderTitle] = useState("");
  const stageInfoHeight = useRef<HTMLInputElement>(null);
  const [wavesStyle, setWavesStyle] = useState<any>(0);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [headerText, setHeaderText] = useState("");
  const [subheaderText, setSubHeaderText] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);

  useLayoutEffect(() => {
    let clearSetTimeout: ReturnType<typeof setTimeout>;
    function updateSize() {
      setIsMobileView(window.innerWidth < 768);
      if (stageInfoHeight.current) {
        clearSetTimeout = setTimeout(() => {
          const headerProduct: any =
            stageInfoHeight.current!.getElementsByClassName(
              "header__product-info"
            )[0];
          const headerStageInfo: any =
            stageInfoHeight.current!.getElementsByClassName(
              "header__stage-info"
            )[0];
          setWavesStyle({
            height: headerStageInfo["offsetHeight"],
            top: headerProduct["offsetHeight"],
          });
        }, 100);
      }
    }
    ["onload", "resize"].forEach((event) => {
      window.addEventListener(event, updateSize);
    });
    updateSize();

    return () => {
      ["onload", "resize"].forEach((event) => {
        window.removeEventListener(event, updateSize);
      });
      clearTimeout(clearSetTimeout);
    };
  }, [stageSelector]);

  useEffect(() => {
    if (
      stageSelector &&
      stageSelector.stages &&
      stageSelector.stages.length > 0 &&
      stageSelector.stages[0].stageInfo &&
      stageSelector.stages[0].stageInfo.products &&
      stageSelector.stages[0].stageInfo.products.length > 0
    ) {
      setProductDetails(stageSelector.stages[0].stageInfo.products[0].name);
    }
  }, [stageSelector]);
  useEffect(() => {
    const pathname = window.location.pathname;
    if (
      stageSelector &&
      stageSelector.stages &&
      stageSelector.stages.length > 0 &&
      stageSelector.stages[0].stageId
    ) {
      let product_category = null;
      if(getUrl.getParameterByName("auth") !== "upload"){
        product_category = stageSelector.stages[0].stageInfo.products[0].product_category
      }
      setHeaderTitle(
        Title(
          stageSelector.stages[0].stageId,
          applicationJourney,
          product_category
        )
      );
    }
    else if (pathname === "/pending-application") {
      setHeaderText(resumeHeaderText.HEADER_TEXT.resume);
      setSubHeaderText(resumeHeaderText.HEADER_TEXT.resumeSubHeader);
      setShowCloseButton(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSelector]);
  return (
    <>
      {(productDetails || getUrl.getParameterByName("auth") === "upload") && (
        <>
          <div className="header" ref={stageInfoHeight}>
            <div className="header__product-info">
              <div className="header__product-name">
                {getUrl.getParameterByName("auth") !== "upload" && 
                !store.getState().stages.isDocumentUpload && 
                (<div>{productDetails}</div>)}
              </div>
              <div className="header__save-exit">
                {!isMobileView && <Logo />}
                {getUrl.getParameterByName("auth") !== "upload" && 
                !store.getState().stages.isDocumentUpload && <Close />}
              </div>
            </div>
            <div className="header__stage-info">
              <span className="header__stage-h3">{headerTitle}</span>
              <span
                className="header__waves"
                style={{
                  height: wavesStyle.height + "px",
                  top: wavesStyle.top + "px",
                }}
              ></span>
            </div>
          </div>
          <div className="header__border"></div>
        </>
      )}
      {headerText && (
        <div className="pending__resume-header">
          <div>
            <div className="resume__header-name">{headerText}</div>
            {showCloseButton && getUrl.getParameterByName("auth") !== "upload" && 
                !store.getState().stages.isDocumentUpload && <Close authType="resume" />}
            <div className="resume__header-text">{subheaderText}</div> 
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

