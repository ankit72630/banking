import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import "./button.scss";
import { getFields } from "./button.utils";
import renderComponent from "../../../modules/dashboard/fields/renderer";
import { fieldIdAppend } from "../../../utils/common/change.utils";
import trackEvents from "../../../services/track-events";

export const Button = (props: KeyWithAnyModel) => {

  const stageSelector = useSelector(
    (state: StoreModel) => state.stages.stages
  );

  const taxSelector = useSelector(
    (state: StoreModel) => state.tax
  );

  const inputSelector = useSelector(
    (state: StoreModel) => state.stages.userInput
  );

  const taxCustomSelector = useSelector(
    (state: StoreModel) => state.stages.taxCustom
  );

  const dispatch = useDispatch();
  const [field, setField] = useState([]);

  const userInput = (fieldName: string) => {
    if (stageSelector && fieldName === "add_tax_residency") {
      const stageComponents = dispatch(
        getFields(stageSelector, taxSelector, "add", inputSelector)
      );
      setField(stageComponents);
      trackEvents.triggerAdobeEvent('ctaClick', 'Add Tax Residency');
    }
  };

  useEffect(() => {
    if (stageSelector) {
      const stageComponents = dispatch(
        getFields(stageSelector, taxSelector, "get", inputSelector)
      );
      setField(stageComponents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxSelector, taxCustomSelector.addTaxToggle]);

    return (
        <>
         {field &&
          field.map((currentSection: KeyWithAnyModel, index: number) => {
            return renderComponent(
              currentSection,
              index,
              props.handleCallback,
              props.handleFieldDispatch,
              props.value
            );
          })}
          <div className="div__btn">
            <div className="btn__plus">
              <input
                type={props.data.type}
                name={props.data.logical_field_name}
                aria-label={props.data.logical_field_name}
                id={fieldIdAppend(props)}
                placeholder={props.data.rwb_label_name}
                value={props.data.rwb_label_name}
                pattern={props.data.regex}
                className ={(taxSelector && taxSelector.count < taxSelector.maxCount) ? 'show-btn, button' : 'hide-btn'}
                onClick={() =>
                  userInput(props.data.logical_field_name)
                }
                onChange={() => { 
                  //do nothing
                }}
              />
              </div>
          </div>
         
        </>
    )
}

export default Button;

