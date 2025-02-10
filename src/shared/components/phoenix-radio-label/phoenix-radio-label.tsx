import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import "./phoenix-radio-label.scss";
import { useSelector, useDispatch } from "react-redux";
import trustBankConstant from "../../../assets/_json/trust-bank.json";
import { useState, useEffect } from "react";
import validateService from "../../../services/validation-service";
import { dispatchError } from "../../../services/common-service";

const PhoenixRadioLabel = (props: KeyWithAnyModel) => {
  const trustBank = useSelector(
    (state: StoreModel) => state.trustBank.trustBank
  );
  const [offerstatus, setOfferstatus] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const dispatch = useDispatch();
  const [consentFlag, setConsentFlag] = useState(false);

  useEffect(() => {
    if (
      trustBank.applicant.customer_consent_for_limit_porting_a_1 === "P" &&
      offerstatus.toLowerCase() === "decline"
    ) {
      setConsentFlag(true);
    }
    if (
      trustBank &&
      trustBank.products &&
      trustBank.products.length > 0 &&
      trustBank.products[0].offer_details &&
      trustBank.products[0].offer_details.length > 0 &&
      trustBank.products[0].offer_details[0].offer_status
    ) {
      setOfferstatus(trustBank.products[0].offer_details[0].offer_status);
      const amount = trustBank.products[0].offer_details[0].approved_amount;
      setApprovedAmount(validateService.formateCurrency(amount.toFixed(2)));
      setCurrency(
        trustBank.products[0].offer_details[0].approved_amount_currency
      );
    } else {
      const error = {
        response: {
          status: "error",
          statusText: "no response",
        },
      };
      dispatch(dispatchError(error));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="phoenix__Limit__porting">
        <div className="phoenix__Limit__porting__logo"></div>
        <div className="phoenix__Limit__porting__desc">
          <div className="radio__offer__label">
            {consentFlag
              ? trustBankConstant.areYouExistingCustomer
              : trustBankConstant.radioOfferLabel
                  .replace("$$amount", approvedAmount)
                  .replace("$$currency", currency)}
          </div>
          <div className="radio__credit__limit__label">
            {consentFlag
              ? trustBankConstant.pcoApprovedAmountWouldBeZero
              : trustBankConstant.radioCreditLimitLabel}
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoenixRadioLabel;

