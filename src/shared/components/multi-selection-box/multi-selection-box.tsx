import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KeyWithAnyModel,
  LovInputModel,
  LovInputValModel,
  StoreModel,
} from "../../../utils/model/common-model";
import "./multi-selection-box.scss";
import {
  fieldError,
  isFieldUpdate,
  isMyinfoField,
  fieldIdAppend,
  getUrl,
} from "../../../utils/common/change.utils";
import { ValueUpdateAction } from "../../../utils/store/value-update-slice";
import { lastAction } from "../../../utils/store/last-accessed-slice";

const MultiSelectionBox = (props: KeyWithAnyModel) => {
  const [errors, setErrors] = useState(false);
  const lovSelector = useSelector((state: StoreModel) => state.lov);
  const [selectedOption, setSelectedOption] = useState<Array<LovInputValModel>>(
    []
  );
  const fieldErrorSelector = useSelector(
    (state: StoreModel) => state.fielderror.error
  );
  const myInfoResponseSelector = useSelector(
    (state: StoreModel) => state.stages.myinfoResponse
  );
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const userInputSelector = useSelector((state: StoreModel) => state.stages.userInput);
  const [show, hide] = useState(false);
  const [update, setUpdate] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Array<LovInputValModel>>(
    []
  );
  const [isMyinfo, setIsMyinfo] = useState(false);
  const [search, setSearch] = useState("");
  const [maxCount, setMaxCount] = useState(false);
  const [minCount, setMinCount] = useState(true);
  const [initialValue, setInitialValue] = useState<Array<LovInputValModel>>([]);
  const dispatch = useDispatch();
  const max_selects = parseInt(props.data.max_selects);

  useEffect(() => {
    const data = isMyinfoField(
      myInfoResponseSelector,
      props.data.logical_field_name
    );
    setIsMyinfo(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myInfoResponseSelector]);

  useEffect(() => {
    const currentFieldLovRes: Array<KeyWithAnyModel> = lovSelector.lov.filter(
      (res: LovInputModel) => {
        return res.label === props.data.logical_field_name;
      }
    );
    let preSelectedCode: string | null = null;
    const userInputResponse = userInputSelector.applicants[fieldIdAppend(props)];
    // const fieldValue = userInputResponse ? userInputResponse : stageSelector[0].stageInfo.applicants[fieldIdAppend(props)];
    let fieldValue = "";
    if (userInputResponse) {
      fieldValue = userInputResponse;
    } else {
      const updatedStageStore = getUrl.getUpdatedStage();
      const stageApplicant = updatedStageStore.updatedStageInputs.find(
        (ref: any) => ref && ref.stageId === stageSelector[0].stageId
      );
      if (stageApplicant) {
        if (
          stageApplicant.applicants[fieldIdAppend(props)] !== undefined &&
          stageApplicant.applicants[fieldIdAppend(props)] !== null
        ) {
          fieldValue = stageApplicant.applicants[fieldIdAppend(props)];
        } else if (
          stageSelector[0].stageInfo.applicants[fieldIdAppend(props)]
        ) {
          fieldValue =
            stageSelector[0].stageInfo.applicants[fieldIdAppend(props)];
        }
      } else {
        fieldValue =
          stageSelector[0].stageInfo.applicants[fieldIdAppend(props)];
      }
    }
    if (fieldValue) {
      preSelectedCode = fieldValue;
    }
    if (currentFieldLovRes.length > 0) {
      let dropDownData = JSON.parse(
        JSON.stringify(currentFieldLovRes[0].value)
      );
      let preSelectedVal: any = null;
      if (preSelectedCode) {
        preSelectedVal = preSelectedCode.includes(",")
          ? preSelectedCode.split(",")
          : [preSelectedCode];
      }

      const result = dropDownData.reduce(
        (prev: Array<LovInputValModel>, acc: LovInputValModel) => {
          if (preSelectedVal) {
            preSelectedVal.forEach((item: any) => {
              if (acc.CODE_VALUE === item) {
                acc.checked = true;
                prev.push(acc);
              }
            });
          }
          return prev;
        },
        []
      );

      setSelectedOption(dropDownData);
      setSelectedValue(result);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSelector, lovSelector.lov, props.data.logical_field_name]);

  useEffect(() => {
    setErrors(fieldError(fieldErrorSelector, props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldErrorSelector]);

  const dropdownHandler = (event: React.MouseEvent<any>) => {
    event.currentTarget.firstChild.focus();
    hide(true);
    const selectedValueInitVal = [...selectedValue];
    setInitialValue(selectedValueInitVal);
  };

  const close = () => {
    setMinCount(true);
    hide(false);
    setUpdate((prev: boolean) => !prev);
    setSearch("");
    setMaxCount(false);

    setSelectedValue(initialValue);
    setSelectedOption((prev: Array<LovInputValModel>) => {
      let lovObj = prev.map((item: LovInputValModel) => {
        item.checked = false;
        return item;
      });
      initialValue.forEach((response: LovInputValModel) => {
        const lovIndex = lovObj.findIndex(
          (item: LovInputValModel) => item.CODE_VALUE === response.CODE_VALUE
        );
        if (lovIndex >= 0) {
          lovObj[lovIndex].checked = true;
        }
      });
      return lovObj;
    });
  };

  const continueBtn = () => {
    if (!(maxCount || minCount)) {
      const prevValue =
        stageSelector[0].stageInfo.applicants[fieldIdAppend(props)];
      if (prevValue) {
        const prevArrObj = prevValue.includes(",")
          ? prevValue.split(",")
          : [prevValue];
        const selectedObj = selectedValue.reduce((prev: any, acc: any) => {
          prev.push(acc.CODE_VALUE);
          return prev.sort();
        }, []);
        if (prevArrObj.sort().toString() !== selectedObj.toString()) {
          dispatch(
            ValueUpdateAction.getChangeUpdate({
              id: stageSelector[0].stageId,
              changes: true,
            })
          );
        }
      } else {
        dispatch(
          ValueUpdateAction.getChangeUpdate({
            id: stageSelector[0].stageId,
            changes: true,
          })
        );
      }

      if (selectedValue.length > max_selects) {
        setMaxCount(true);
        setMinCount(false);
      } else if (!(selectedValue.length > 0)) {
        hide(true);
      } else {
        setUpdate((prev: boolean) => !prev);
        setMaxCount(false);
        hide(false);
      }
    }
  };

  const addUserInput = (data: LovInputValModel, event: any) => {
    const previousSelectedOption = [...selectedOption];
    const updatedSelectedOption = previousSelectedOption.map(
      (item: LovInputValModel) => {
        if (item.CODE_DESC === data["CODE_DESC"]) {
          item["checked"] = !item["checked"];
        }
        return item;
      }
    );
    setSelectedOption(updatedSelectedOption);

    setSelectedValue((prevUser: Array<LovInputValModel>) => {
      const isExits = prevUser.find(
        (item: LovInputValModel) => item.CODE_VALUE === data["CODE_VALUE"]
      );
      if (!isExits && event.target.checked) {
        prevUser.push(data);
      } else {
        if (!event.target.checked) {
          const fieldIndex = prevUser.findIndex(
            (item: LovInputValModel) => item.CODE_VALUE === data["CODE_VALUE"]
          );
          prevUser.splice(fieldIndex, 1);
        }
      }
      if (!(prevUser.length > max_selects)) {
        if (!(prevUser.length > 0)) {
          setMinCount(true);
        } else {
          setMaxCount(false);
          setMinCount(false);
        }
      }
      return prevUser;
    });
  };

  const removeSelectedValues = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: LovInputValModel
  ) => {
    event.stopPropagation();
    event.isPropagationStopped();

    const previousSelectedValue = [...selectedValue];

    let fieldIndex = previousSelectedValue.findIndex(
      (item: LovInputValModel) => item.CODE_VALUE === data["CODE_VALUE"]
    );
    if (fieldIndex !== -1) {
      previousSelectedValue.splice(fieldIndex, 1);
    }
    setSelectedValue(previousSelectedValue);

    const previousSelectedOption = [...selectedOption];
    const result = previousSelectedOption.map((item: LovInputValModel) => {
      if (item.CODE_VALUE === data["CODE_VALUE"]) {
        item["checked"] = !item["checked"];
      }
      return item;
    });
    setSelectedOption(result);
    if(stageSelector[0].stageId !== 'ssf-1') {
      dispatch(
        ValueUpdateAction.getChangeUpdate({
          id: stageSelector[0].stageId,
          changes: previousSelectedValue.length > 0 ? true : false,
        })
      );  
    }
  };

  useEffect(() => {
    setErrors(false);
    if (selectedValue.length > 0) {
      setMinCount(false);
    }
    const val =
      selectedValue &&
      selectedValue.reduce((prev: Array<string>, acc: LovInputValModel) => {
        prev.push(acc.CODE_VALUE);
        return prev;
      }, []);
    if (props.data.mandatory === "Yes") {
      props.handleCallback(props.data, val.toString());
    }
    if(val.length > 0) {
      dispatch(
        isFieldUpdate(props, val.toString(), props.data.logical_field_name)
      );  
    } else if(props.data.logical_field_name === 'account_currency_9' && getUrl.getUpdatedStage().currentStage !== 'ssf-2') {
      dispatch(
        isFieldUpdate(props, val.toString(), props.data.logical_field_name)
      );
    } else if(props.data.logical_field_name === 'nationality_add') {
      dispatch(
        isFieldUpdate(props, val.toString(), props.data.logical_field_name)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, update]);

  const searchFilter = (item: LovInputValModel) => {
    if (search !== "") {
      return item.CODE_DESC.toLowerCase().includes(search.toLowerCase());
    } else {
      return item.CODE_DESC;
    }
  };
  const focusHandler = (fieldName: string, event: React.FocusEvent<HTMLInputElement>) => {
    dispatch(lastAction.getField(fieldName))
  }
  return (
    <>
      <div className="multi-select">
        <label htmlFor={props.data.logical_field_name}>
          {props.data.rwb_label_name}
        </label>
        <div
          className={`multi-select__field ${
            isMyinfo || props.data.editable ? "disabled" : ""
          }`}
          onClick={(e) => dropdownHandler(e)}
          onFocus={focusHandler.bind(this, props.data.logical_field_name)}
        >
          {selectedValue &&
            selectedValue.length > 0 &&
            selectedValue.map((item: LovInputValModel) => {
              return (
                <span
                  className="multi-select__fieldlabel"
                  key={item.CODE_VALUE}
                >
                  <span>{item.CODE_DESC}</span>
                  <span
                    className="multi-close"
                    onClick={(
                      event: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => removeSelectedValues(event, item)}
                  ></span>
                </span>
              );
            })}
          {!(selectedValue && selectedValue.length > 0) && (
            <input
              type="text"
              className="dropdown-select__input"
              id={fieldIdAppend(props)}
              placeholder={props.data.rwb_label_name}
              onChange={() => {
                //do nothing
              }}
            />
          )}
        </div>
        {errors && (
        <span className="error-msg">
          Please enter {props.data.rwb_label_name}
        </span>
      )}
        {show && selectedOption && (
          <div className="multi-select__background">
            <div className="dropdown-select__bg-curve"></div>
            <div className="multi-select__popup">
              <div className="multi-select__header">
                <div>{props.data.rwb_label_name}</div>
                <div className="close" onClick={close}></div>
              </div>
              <div className="multi-select__search">
                <input
                  autoFocus
                  name="search"
                  type="search"
                  placeholder="Search"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              {maxCount && (
                <div className="max-count">
                  *You have selected maximum options for{" "}
                  {props.data.logical_field_name}
                </div>
              )}
              <div className="multi-select__expand">
                {selectedOption
                  .filter(searchFilter)
                  .map((item: LovInputValModel, index: number) => {
                    return (
                      <div key={index} className="multi-select__item">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(event) => addUserInput(item, event)}
                          value={item.CODE_VALUE}
                          id={item.CODE_VALUE}
                        />
                        <label htmlFor={item.CODE_VALUE}>
                          {item.CODE_DESC}
                        </label>
                      </div>
                    );
                  })}
              </div>
              <div className="multi-select__btn">
                <span
                  className={`${
                    maxCount || minCount ? "multi-select__btn--disabled" : ""
                  }`}
                  onClick={continueBtn}
                >
                  Continue
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MultiSelectionBox;

