import "./casa-banner.scss";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCasaBannerData } from "../../../services/common-service";

const CasaBanner = (props: KeyWithAnyModel) => {
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const [isMobile, setIsMobile] = useState(false);
  const [showBanner, setshowBanner] = useState(false);
  const dispatch = useDispatch();

  const [thankyouDetails, setthankyouDetails] = useState({
    ctaLabel: "",
    bannerMobileText: "",
    bannerDesktopText: "",
    bannerMobileImage: "",
    bannerDesktopImage: "",
    ctaUrl: "",
  });

  const applicationJourney = useSelector(
    (state: StoreModel) => state.stages.journeyType
  );

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
        ? true
        : false
    );
    let journeyTypeFunding: string;
    if (applicationJourney === "ETB" || applicationJourney === "NTB") {
      journeyTypeFunding = "ntb";
    } else if (applicationJourney === "ECC" || applicationJourney === "NTC") {
      journeyTypeFunding = "ntc";
    } else {
      journeyTypeFunding = "etc";
    }

    const productCode = stageSelector[0].stageInfo.products[0].product_type;
    dispatch(getCasaBannerData()).then(async (response: any) => {
      let filteredArray: { [x: string]: any }[] = [];
      filteredArray = response.filter(
        (obj: { [x: string]: string | string[] }) =>
          obj["customer-types"].includes(journeyTypeFunding) &&
          obj["product-codes"].includes(productCode)
      );
      setshowBanner(filteredArray[0] ? true : false);
      if (filteredArray[0]) {
        thankyouDetails.ctaLabel = filteredArray[0]["cta-label"] || "";
        thankyouDetails.bannerMobileText =
          filteredArray[0]["banner-text-mobile"] || "";
        thankyouDetails.bannerDesktopText =
          filteredArray[0]["banner-text-desktop"] || "";
        thankyouDetails.bannerMobileImage =
          filteredArray[0]["banner-image-mobile"] || "";
        thankyouDetails.ctaUrl = filteredArray[0]["cta-url"] || "";
      }
      setthankyouDetails(thankyouDetails);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {showBanner && (
        <div className="funding-banner">
          <div>
            <img
              className="funding-banner__img"
              alt="banner"
              src={thankyouDetails.bannerMobileImage}
            />
          </div>
          <div className="funding-banner__description">
            <p className="funding-banner__label">
              {`${
                isMobile
                  ? thankyouDetails.bannerMobileText
                  : thankyouDetails.bannerDesktopText
              }`}
            </p>
            {thankyouDetails.ctaLabel && (
              <div className="funding-banner__banner">
                <a
                  href={thankyouDetails.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="funding-banner__cta"
                >
                  {thankyouDetails.ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CasaBanner;

