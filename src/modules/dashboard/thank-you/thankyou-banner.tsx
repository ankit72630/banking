import "./thank-you.scss";
import { Player } from "@lottiefiles/react-lottie-player";
import lottieSrc from "../../../assets/_json/lottie/thankyou_animation.json";
import { KeyWithAnyModel } from "../../../utils/model/common-model";
const ThankYouBanner = (props: KeyWithAnyModel) => {
  return (
    <div className="thankyou__banner">
      <div className="thankyou__banner__left">
        <div className="lottieAnime_success">
          <Player src={lottieSrc} className="player" loop autoplay />
        </div>
        <label>{props.banner_header}</label>
        {props.banner_content && (
          <div className="body__app-desc">
            {props.banner_body_1}
            {props.productName} {props.banner_body_2}
            {props.resumeUrl && (
              <div className="body__app__btn">
                <a rel="noreferrer" href={process.env.REACT_APP_RESUME_URL}>
                  {props.resumeUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYouBanner;
