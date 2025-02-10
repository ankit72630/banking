import { useEffect, useState } from "react";
import "./spinner.scss";
import { Player } from "@lottiefiles/react-lottie-player";
import lottieSrc from "../../../assets/_json/lottie/motorcycle_insurance.json";
import { getCurrentYear, getUrl } from "../../../utils/common/change.utils";
import { StoreModel } from "../../../utils/model/common-model";
import { useSelector } from "react-redux";

const Spinner = () => {
  const channelRefSelector = useSelector(
    (state: StoreModel) => state.urlParam.applicationDetails.channelRefNo
  );
  const [requestUpdate, setRequestUpdate] = useState(true);
  const [currentYear, setCurrentYear] = useState(0);

  useEffect(() => {
    const urlEndPoint = getUrl.getUrlEndPoint();
    let requestTimer = setTimeout(() => {
      setRequestUpdate(false);
    }, 10000);

    const startYear = 1859;
    setCurrentYear(getCurrentYear() - startYear);

    if (urlEndPoint === "success") {
      clearTimeout(requestTimer);
    }
    return () => {
      clearTimeout(requestTimer);
    };
  }, []);

  return (
    <div className={`lottie ${!channelRefSelector ? 'opacity': ''}`}>
      <div className="lottie__container">
        <Player src={lottieSrc} className="player" loop autoplay />
        <div className="lottie__body">
          <div className="lottie__text">
            {requestUpdate ? <>Processing...</> : <>Working on it...</>}
          </div>
          <div className="lottie__footer">
            <div>
              {requestUpdate ? (
                <>
                  Did you know? The Bank opened its first branch in Singapore, {currentYear} years ago in 1859!
                </>
              ) : (
                <>
                  Did you know? We first brought mobile banking (in the form of
                  a bus) to SG more than half a century ago
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
