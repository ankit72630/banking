import React, { useState, useEffect } from "react";
import "./toggle.scss";
import { useDispatch, useSelector } from "react-redux";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { isFieldUpdate } from "../../../utils/common/change.utils";
import Alias from "../../components/alias/alias";
import { aliasAction } from "../../../utils/store/alias-slice";
import { fieldErrorAction } from "../../../utils/store/field-error-slice";
import { stagesAction } from "../../../utils/store/stages-slice";
import { lastAction } from "../../../utils/store/last-accessed-slice";

const Toggle = (props: KeyWithAnyModel) => {
  const [defaultValue, setDefaultValue] = useState(false);
  const [stageId, setStageId] = useState("");
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const aliasSelector = useSelector((state: StoreModel) => state.alias);
  const journeyType = useSelector(
    (state: StoreModel) => state.stages.journeyType
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      stageSelector &&
      stageSelector[0] &&
      stageSelector[0].stageInfo &&
      stageSelector[0].stageInfo.applicants
    ) {
      if (
        props.data.logical_field_name === "cheque_book_request" ||
        props.data.logical_field_name === "other_name_or_alias"
      ) {
        const storeVal =
          stageSelector[0].stageInfo.applicants[
            props.data.logical_field_name + "_a_1"
          ];
        if (storeVal) {
          dispatch(
            isFieldUpdate(props, storeVal, props.data.logical_field_name)
          );
        }

        if (
          stageSelector[0].stageInfo.applicants[
            props.data.logical_field_name + "_a_1"
          ] === "Y"
        ) {
          setDefaultValue(true);
        } else if (
          stageSelector[0].stageInfo.applicants[
            props.data.logical_field_name + "_a_1"
          ] === "N"
        ) {
          setDefaultValue(false);
        } else {
          setDefaultValue(false);
          if (props.data.logical_field_name !== "other_name_or_alias") {
            dispatch(isFieldUpdate(props, "N", props.data.logical_field_name));
          }
        }
      }
      if (
        stageSelector &&
        stageSelector.length > 0 &&
        stageSelector[0].stageId
      ) {
        setStageId(stageSelector[0].stageId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggle = () => {
    dispatch(lastAction.getField(props.data.logical_field_name));
    if (defaultValue) {
      setDefaultValue(false);
      dispatch(isFieldUpdate(props, "N", props.data.logical_field_name));

      if (
        props.data.logical_field_name === "other_name_or_alias" &&
        aliasSelector &&
        aliasSelector.fields.length > 0
      ) {
        dispatch(fieldErrorAction.removeMandatoryFields(aliasSelector.fields));
        dispatch(
          stagesAction.removeAddToggleField({
            removeFields: aliasSelector.fields,
            newFields: [],
          })
        );
        dispatch(aliasAction.resetAliasField([]));
      }
    } else {
      setDefaultValue(true);
      dispatch(isFieldUpdate(props, "Y", props.data.logical_field_name));
      if (
        props.data.logical_field_name === "other_name_or_alias" &&
        aliasSelector &&
        aliasSelector.count < 1
      ) {
        dispatch(fieldErrorAction.getMandatoryFields(["alias_1"]));
        dispatch(aliasAction.addAliasField("alias_1"));
        dispatch(aliasAction.updateCount(1));
      }
    }
  };

  return (
    <>
      {!(stageId === "ssf-2" && journeyType) && (
        <div className="toggle__content">
          <div className="toggle__content__inner">
            <div className="toggle__desc">{props.data.rwb_label_name}</div>
            <div className="toggle__button__block">
              <div className="toggle__button" onClick={() => onToggle()}>
                <input
                  onChange={() => {
                    // do nothing
                  }}
                  type="checkbox"
                  checked={defaultValue}
                />
                <span className="toggle__slider"></span>
              </div>
            </div>
          </div>
        </div>
      )}
      {defaultValue &&
        props.data.logical_field_name === "other_name_or_alias" && (
          <Alias
            handleCallback={props.handleCallback}
            handleFieldDispatch={props.handleFieldDispatch}
            value={props.value}
          />
        )}
    </>
  );
};

export default Toggle;

