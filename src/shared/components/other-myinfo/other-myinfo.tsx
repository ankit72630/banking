import { KeyWithAnyModel } from "../../../utils/model/common-model";
import "./other-myinfo.scss";
import trackEvents from "../../../services/track-events";

const OtherMyinfo = (props: KeyWithAnyModel) => {
  const showHandler = (event:any) => {
    trackEvents.triggerAdobeEvent('ctaClick', 'See Other Myinfo Details');    
    props.handleFieldDispatch(props.data.logical_field_name, "ssf-2", event);
  };

  return (
    <div className="other-info">
      <div className="other-info__inner">
        <div onClick={showHandler}>{props.data.rwb_label_name}</div>
        <div className="chevron"></div>
      </div>
    </div>
  );
};

export default OtherMyinfo;

