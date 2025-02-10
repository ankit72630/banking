import { getUrl } from '../../utils/common/change.utils';
import { KeyWithAnyModel, ValidationObjModel } from '../../utils/model/common-model';
import rulesUtils from './rules.utils';

const Rules_bd_3 = (props: KeyWithAnyModel, _application: KeyWithAnyModel): KeyWithAnyModel => {
    const validationObj: ValidationObjModel = {
        nonEditable: [],
        hidden: []
    };
    let hiddenFields: Array<string> = [];
    if (getUrl.getJourneyType() === "ETC") {
        hiddenFields = ["work_type","name_of_employer","name_of_employer_other","name_of_business","job_title","embossed_name"];
    }
    else{
        hiddenFields = ["credit_limit_consent","myinfo_data_cli","embossed_name"];
    }

    validationObj.hidden!.push(hiddenFields);
    return rulesUtils(props, validationObj);
}

export default Rules_bd_3;

