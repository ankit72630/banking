import { checkProductDetails } from '../../services/common-service';
import { getUrl } from '../../utils/common/change.utils';
import { KeyWithAnyModel, ValidationObjModel } from '../../utils/model/common-model';
import rulesUtils from './rules.utils';

const Rules_bd_2 = (props: KeyWithAnyModel, stageInfo: KeyWithAnyModel): KeyWithAnyModel => {
    const validationObj: ValidationObjModel = {
        nonEditable: [],
        hidden: [],
        modifyVisibility:[]
    };
    const auth = getUrl.getParameterByName("auth");
    const isCASAProduct = checkProductDetails(stageInfo.products);
    let defaultVisiblity:any= []
    if(auth === "manual"){
        let hiddenFields = ["postal_code_other","country"]
        if(!isCASAProduct){
            hiddenFields.push('nationality_add');
        }

        if(stageInfo.applicants['residency_status_a_1'] === "FR"){
            defaultVisiblity = ["overseas_contact_country_code","overseas_contact_area_code","overseas_contact_no"];
        }
        validationObj.hidden!.push(hiddenFields);
        validationObj.modifyVisibility!.push(defaultVisiblity)
      }

    return rulesUtils(props, validationObj);
}

export default Rules_bd_2;

