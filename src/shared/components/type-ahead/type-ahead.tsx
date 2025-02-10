import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KeyWithAnyModel,
  LovInputValModel,
  StoreModel,
} from "../../../utils/model/common-model";
import "./type-ahead.scss";
import {
  fieldError,
  isFieldUpdate,
  fieldIdAppend,
} from "../../../utils/common/change.utils";

import { ValueUpdateAction } from "../../../utils/store/value-update-slice";
import { defaultError, getLovData } from "../../../services/common-service";
import { AxiosError } from "axios";
import { getFields } from "../radio-with-label/radio-with-label.utils";
import renderComponent from "../../../modules/dashboard/fields/renderer";

const TypeAhead = (props: KeyWithAnyModel) => {
  const [errors, setErrors] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Array<LovInputValModel>>(
    []
  );
  const lovSelector = useSelector((state: StoreModel) => state.lov);

  const fieldErrorSelector = useSelector(
    (state: StoreModel) => state.fielderror.error
  );
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const [show, hide] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [selectedValue, setSelectedValue] = useState<
    Array<LovInputValModel> | any
  >([]);
  const [field, setField] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    let searchValue: any = null;
    if (lovSelector) {
      lovSelector.lov.forEach((item: any) => {
        if (item.label === props.data.logical_field_name) {
          item.value.forEach((lovItem: any) => {
            if (
              lovItem.CODE_DESC ===
                stageSelector[0].stageInfo.applicants[
                  props.data.logical_field_name + "_a_1"
                ] ||
              lovItem.CODE_VALUE ===
                stageSelector[0].stageInfo.applicants[
                  props.data.logical_field_name + "_a_1"
                ]
            ) {
              searchValue = lovItem;
            }
          });
        }
      });
    }
    if (searchValue) {
      setSelectedValue([searchValue]);
    } else {
      const otherVal = {
        CODE_DESC: "Other",
        CODE_VALUE: "Other",
      };
      setSelectedValue([otherVal]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (search.length > 2) {
      const getData = setTimeout(() => {
        dispatch(getLovData("name_of_employer", search))
          .then((res: any) => {
            if (!(res.data.length > 0)) {
              setShowOption(false);
            } else {
              setShowOption(true);
              setSelectedOption(res.data);
            }
          })
          .catch((error: AxiosError) => {
            defaultError();
            return Promise.reject(error);
          });
      }, 500);
      return () => clearTimeout(getData);
    }
  }, [search, dispatch]);

  useEffect(() => {
    setErrors(fieldError(fieldErrorSelector, props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldErrorSelector]);

  const dropdownHandler = (event: React.MouseEvent<any>) => {
    event.currentTarget.firstChild.focus();
    hide(true);
  };

  const close = () => {
    hide(false);
    setShowOption(false);
  };

  const addUserInput = (data: any) => {
    const previousSelectedOption = [...selectedOption];

    const valueChange = previousSelectedOption.some(
      (item) => item.CODE_VALUE === data.CODE_VALUE && data.checked === false
    );
    if (valueChange) {
      dispatch(
        ValueUpdateAction.getChangeUpdate({
          id: stageSelector[0].stageId,
          changes: true,
        })
      );
    }

    if (data === "other") {
      const stageComponents = dispatch(
        getFields(stageSelector, null, "name_of_employer_other")
      );
      setField(stageComponents);
      const otherVal = {
        CODE_DESC: "Other",
        CODE_VALUE: "Other",
      };
      setSelectedValue([otherVal]);
    } else {
      setSelectedValue([data]);
    }
    hide(false);
    setShowOption(false);
  };

  useEffect(() => {
    setErrors(false);
    const val =
      selectedValue.length > 0 &&
      selectedValue.reduce((prev: Array<string>, acc: LovInputValModel) => {
        prev.push(acc.CODE_VALUE);
        return prev;
      }, []);

    props.handleCallback(props.data, val.toString());
    dispatch(
      isFieldUpdate(props, val.toString(), props.data.logical_field_name)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  return (
    <>
      <div className="typeahead">
        <label htmlFor={props.data.logical_field_name}>
          {props.data.rwb_label_name}
        </label>
        <div
          className={`typeahead__field`}
          onClick={(event) => dropdownHandler(event)}
        >
          {selectedValue &&
            selectedValue.length > 0 &&
            selectedValue.map((item: LovInputValModel) => {
              return (
                <div className="typeahead__fieldlabel" key={item.CODE_VALUE}>
                  <span>{item.CODE_DESC}</span>
                </div>
              );
            })}
          {!(selectedValue && selectedValue.length > 0) && (
            <input
              type="text"
              className="typeahead__input"
              id={fieldIdAppend(props)}
              placeholder={props.data.rwb_label_name}
            />
          )}
        </div>
        {show && selectedOption && (
          <div className="typeahead__background">
            <div className="typeahead__popup">
              <div className="typeahead__header">
                <div>{props.data.rwb_label_name}</div>
                <div className="close" onClick={close}></div>
              </div>

              <div className="typeahead__search">
                <label htmlFor="search"></label>
                <input
                  autoFocus
                  name="search"
                  className="typeahead__search"
                  type="search"
                  placeholder="Type here to search"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              {
                <div className="typeahead__expand">
                  {!showOption && <div>No Data Found. Please try again.</div>}
                  {showOption &&
                    selectedOption.map(
                      (item: LovInputValModel, index: number) => {
                        return (
                          <div key={index} className="typeahead__item">
                            <input
                              type="radio"
                              checked={item.checked}
                              onClick={() => addUserInput(item)}
                              onChange={() => { 
                                //do nothing
                              }}
                              value={item.CODE_VALUE}
                              id={item.CODE_VALUE}
                            />
                            <label htmlFor={item.CODE_VALUE}>
                              {item.CODE_DESC}
                            </label>
                          </div>
                        );
                      }
                    )}
                  {showOption && selectedOption.length > 0 && (
                    <div
                      className="typeahead__item"
                      onClick={() => addUserInput("other")}
                    >
                      <label>Others</label>
                    </div>
                  )}
                </div>
              }
            </div>
          </div>
        )}
      </div>
      {errors && (
        <span className="error-msg">
          Please enter {props.data.rwb_label_name}
        </span>
      )}
      <div>
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
      </div>
    </>
  );
};

export default TypeAhead;

