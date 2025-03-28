import { AppDispatch } from "../../../services/common-service";
import { FindIndex } from "../../../utils/common/change.utils";
import {
  KeyWithAnyModel,
  StageDetails,
  aliasStoreModel
} from "../../../utils/model/common-model";
import { fieldErrorAction } from "../../../utils/store/field-error-slice";
import { stagesAction } from "../../../utils/store/stages-slice";
import { aliasAction } from "../../../utils/store/alias-slice";
import { getUrl } from "../../../utils/common/change.utils";

export const getFields = (
  getStages: Array<StageDetails>,
  aliasSelector: aliasStoreModel,
  action: string
): any => {
  return (dispatch: AppDispatch) => {
    const stageId = getStages[0].stageId === "ssf-1" ? "ssf-2" : getStages[0].stageId;
    const stageIndex = FindIndex(getStages[0].stageInfo, stageId);
    let fields: Array<KeyWithAnyModel> | undefined = getStages[0].stageInfo.fieldMetaData.data.stages[stageIndex].fields;
    let newFileds: Array<KeyWithAnyModel> = [];
    let newFieldsArray: Array<string> = [];
    const journeyType = getUrl.getJourneyType();

    let getClonedField = (logical_field_name: string) => {
      if (fields) {
        let field = fields.find(
          fieldData => fieldData.logical_field_name === logical_field_name
        );
        if (field && field.logical_field_name) {
          return { ...field };
        } else {
          return null;
        }
      } else {
        return null;
      }
    };

    const getSequence = () => {
      for (let i = 1; i <= aliasSelector.maxCount; i++) {
        let isItemFound = false;
        aliasSelector.fields.forEach((field: string) => {
          if (field && field.split("_")[1] === i.toString()) {
            isItemFound = true;
          }
        });
        if (!isItemFound) {
          return i;
        }
      }
    };

    aliasSelector.fields.forEach((field: string) => {
      let alias = getClonedField("alias");
      if (field && alias) {
        alias.logical_field_name = field;
        alias.component_type = "Text";
        alias.rwb_label_name = alias.rwb_label_name +' '+ field.split('_')[1];
        if (journeyType) {
          alias.hide_remove_btn = true;
        }
        newFileds.push(alias);
        newFieldsArray.push(alias.logical_field_name);
      }
    });

    if (newFieldsArray.length > 0) {
      dispatch(fieldErrorAction.getMandatoryFields(newFieldsArray));
      dispatch(
        stagesAction.removeAddToggleField({
          removeFields: [],
          newFields: newFieldsArray,
          value: ""
        })
      );
    }

    if (aliasSelector.count < aliasSelector.maxCount && action === "add") {
      dispatch(aliasAction.updateCount(aliasSelector.count + 1));
      let alias = getClonedField("alias");
      if (alias) {
        const seqNo = getSequence();
        alias.logical_field_name = "alias_" + seqNo;
        alias.component_type = "Text";
        alias.rwb_label_name = alias.rwb_label_name +' '+ seqNo;
        newFileds.push(alias);
        dispatch(fieldErrorAction.getMandatoryFields([alias.logical_field_name]));
        dispatch(aliasAction.addAliasField(alias.logical_field_name));
        dispatch(
          stagesAction.removeAddToggleField({
            removeFields: [],
            newFields: [alias.logical_field_name],
            value: ""
          })
        );
      }
    }

    return newFileds;
  };
};

