import "./thank-you.scss";
import { KeyWithAnyModel } from "../../../utils/model/common-model";
const ThankYouTimeline = (props: KeyWithAnyModel) => {
  return (
    <div className="body__timeline">
      <label>{props.title}</label>
      <div className="body__timeline__inner">
        {props.data.map((tlData: any, index: number) => {
          return (
            <div key={index}>
              <div
                className={`timeline__header ${
                  props.checkCompletedStatus && !tlData.completed_status
                    ? "timeline__circle_outline"
                    : ""
                }`}
              >
                <label>{tlData.header}</label>
              </div>
              <div className="timeline__desc">
                <div>
                  {typeof tlData.content === "string" ? (
                    tlData.content
                  ) : (
                    <ul>
                      {tlData.content.map((item: string, index: number) => {
                        return <li key={index}>{item}</li>;
                      })}
                    </ul>
                  )}
                  {tlData.link_lbl && (
                    <div>
                      <button
                        onClick={() => props.handleLink()}
                        className="thankyou__continue"
                      >
                        {tlData.link_lbl}
                      </button>
                    </div>
                  )}
                </div>
                {tlData.subcontent && (
                  <div className="timeline__sub_content">
                    {tlData.subcontent}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThankYouTimeline;

