import React, { useEffect, useState } from "react";
import { KeyWithAnyModel, StoreModel } from "../../../utils/model/common-model";
import { useSelector, useDispatch } from "react-redux";
import "./loan-details-info.scss";
import loanDetailsConst from "../../../assets/_json/loan-details.json";
import validateService from "../../../services/validation-service";
import interestRates from "../../../assets/_json/bt-interest-rate.json";
import Model from "../model/model";
import { rateAction } from "../../../utils/store/rate-slice";

const LoanDetailsInfo = (props: KeyWithAnyModel) => {
  const userInputSelector = useSelector(
    (state: StoreModel) => state.stages.userInput
  );
  const rate = useSelector((state: StoreModel) => state.rate);
  const stageSelector = useSelector((state: StoreModel) => state.stages.stages);
  const jouney = useSelector((state: StoreModel) => state.stages.journeyType);
  const [monthlyRepayment, setMonthlyRepayment] = useState("");
  const [estimatedCashBack, setEstimatedCashBack] = useState("");
  const [productType, setProductType] = useState(0);
  const [campaign, setcampaign] = useState("");
  const [processingFeeRate, setprocessingFeeRate] = useState(0);
  const [eir, setEir] = useState("");
  const [annualFee, setAnnualFee] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [modelName, setModelName] = useState("");
  const [roi, setRoi] = useState(0);
  const dispatch = useDispatch();
  const [staffCategory, setStaffCategory] = useState("N"); 
  useEffect(() => {
    if (
      stageSelector &&
      stageSelector.length > 0 &&
      stageSelector[0].stageInfo
    ) {
      if (stageSelector[0].stageInfo.products &&
        stageSelector[0].stageInfo.products.length > 0) {
        setcampaign(stageSelector[0].stageInfo.products[0].campaign);
        setProductType(
          parseInt(stageSelector[0].stageInfo.products[0].product_type)
        );
      }
      if (stageSelector[0].stageInfo.applicants) {
        setStaffCategory(stageSelector[0].stageInfo.applicants.staff_category_a_1)
      }
    }
    const arRate = stageSelector[0].stageInfo.applicants['rbp_applied_rate_a_1'] ? stageSelector[0].stageInfo.applicants['rbp_applied_rate_a_1'] : loanDetailsConst.ARDefaultRate;
    setRoi(parseFloat(rate.ar === 0 ? arRate : rate.ar));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const arRate = stageSelector[0].stageInfo.applicants['rbp_applied_rate_a_1'] ? stageSelector[0].stageInfo.applicants['rbp_applied_rate_a_1'] : loanDetailsConst.ARDefaultRate;
  //   setRoi(parseFloat(rate.ar === 0 ? arRate : rate.ar));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [rate]);

  useEffect(() => {
    const interestRate = interestRates.find(
      obj =>
        obj["Promo Code"] === campaign &&
        obj.Tenor === parseInt(userInputSelector.applicants.loan_tenor_a_1)
    );
    if (interestRate) {
      setprocessingFeeRate(interestRate["Processing Fee"]);
      //setEir(interestRate.EIR);
    }
    const effetiveRateObj = validateService.getEIR(
      jouney ? jouney : "",
      staffCategory,
      rate.ar.toString(),
      userInputSelector.applicants.loan_tenor_a_1
    );
    let effetiveRate = 0;
    if (effetiveRateObj) {
      let  effetiveRateArr = effetiveRateObj.split(',');
      effetiveRate = parseFloat(effetiveRateArr[0]);
      setEir(effetiveRateArr[0]);
      dispatch(rateAction.updateEIR(effetiveRateArr[0].toString()));
      if(effetiveRateArr.length > 1){
        setRoi(parseFloat(effetiveRateArr[1]));
        dispatch(rateAction.updateAR(effetiveRateArr[1].toString()));
      }
    } 
    const tenure = userInputSelector.applicants.loan_tenor_a_1
      ? parseFloat(userInputSelector.applicants.loan_tenor_a_1)
      : 0;

    if (productType === 280) {
      const loanAmount = userInputSelector.applicants.required_loan_amount_a_1
        ? parseFloat(userInputSelector.applicants.required_loan_amount_a_1)
        : 0;

      let repaymentAmount =
        (loanAmount * (roi / 100) * (tenure / 12) + loanAmount) / tenure;
      repaymentAmount = repaymentAmount === Infinity ? 0 : repaymentAmount;
      setMonthlyRepayment(
        validateService.formateCurrency(repaymentAmount.toFixed(2))
      );
      //TRUNC(Loan Amount * System EIR /1200,2) *3
      const eir_rate = (validateService.getExcelRate(tenure, -repaymentAmount.toFixed(2), loanAmount, 0, 0) * (tenure / (tenure / 12))) * 100;
      let cashBack = (loanAmount * eir_rate / 1200);
      const cashBackSplit = (cashBack.toString()).split('.');
      cashBack = parseFloat(`${cashBackSplit[0]}${cashBackSplit[1] ? '.' + cashBackSplit[1].substr(0, 2) : ''}`) * 3;
      if (cashBack > loanDetailsConst.maxCashback) {
        cashBack = loanDetailsConst.maxCashback;
      }
      if (jouney === "NTB" || jouney === "NTC" || jouney === "ETB" || jouney === "ECA") {
        cashBack = cashBack + 100;
      } 
      setEstimatedCashBack(
        validateService.formateCurrency(cashBack.toFixed(2), true)
      );
      setAnnualFee(`-SGD 199`);
    } else if (productType === 210) {
      const transferAmount = userInputSelector.applicants.Transfer_amount_a_1
        ? parseFloat(userInputSelector.applicants.Transfer_amount_a_1)
        : 0;
      let repaymentAmount =
        (transferAmount * (effetiveRate / 100) * (tenure / 12) + transferAmount) /
        tenure;
      repaymentAmount = repaymentAmount === Infinity ? 0 : repaymentAmount;
      setMonthlyRepayment(
        validateService.formateCurrency(repaymentAmount.toFixed(2))
      );
      let proccFee = (transferAmount * processingFeeRate) / 100;
      proccFee = proccFee === Infinity ? 0 : proccFee;
      setAnnualFee(
        `+SGD ${validateService.formateCurrency(proccFee.toFixed(2))}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userInputSelector.applicants.required_loan_amount_a_1,
    userInputSelector.applicants.loan_tenor_a_1,
    userInputSelector.applicants.Transfer_amount_a_1,
    productType,
    rate
  ]);

  const handlePopupBackButton = () => {
    setShowModel(false);
  };

  const showLoanInfo = (modelName: string) => {
    setModelName(modelName);
    setShowModel(true);
  };

  const mthPayment = (data:any) => {
    return parseInt(data) ? data : 0
  }
  return (
    <>
      <div className="repayment-table">
        <div className="repayment-header">
          <div className="label">
            {`SGD  ${mthPayment(monthlyRepayment)} / ${userInputSelector.applicants.loan_tenor_a_1 || 0} months`}
          </div>
          <div
            className="info-icon"
            onClick={() => showLoanInfo("showLoanInfo")}
          >
            {" "}
          </div>
        </div>
        <hr />
        {productType === 280 && (
          <>
            <div className="repaymentRow">
              <div className="label">{loanDetailsConst.annualFee}</div>
              <div className="value">{annualFee}</div>
            </div>
            <div className="repaymentRow">
              <div className="label">
                {loanDetailsConst.annulPercentageRate}
              </div>
              <div className="value">{roi}%</div>
            </div>
            <div className="repaymentRow">
              <div className="label">
                {loanDetailsConst.EIR}{" "}
                <span
                  className="info-icon"
                  onClick={() => showLoanInfo("showEIRInfo")}
                ></span>
              </div>
              <div className="value">{eir}% p.a.</div>
            </div>
            {userInputSelector.applicants.required_loan_amount_a_1 >= loanDetailsConst.cashBackCondition.minAmount &&
              userInputSelector.applicants.loan_tenor_a_1 >= loanDetailsConst.cashBackCondition.minTenor && roi >= loanDetailsConst.cashBackCondition.minAR && (
                <div className="repaymentRow">
                  <div className="label">
                    {loanDetailsConst.estimatedCashback}
                  </div>
                  <div className="value">SGD {estimatedCashBack}</div>
                </div>
              )}
          </>
        )}
        {productType === 210 && (
          <>
            <div className="repaymentRow">
              <div className="label">
                {loanDetailsConst.requestedLoanAmount}
              </div>
              <div className="value">
                {`SGD ${validateService.formateCurrency(
                  userInputSelector.applicants.Transfer_amount_a_1,
                  true
                )}`}
              </div>
            </div>
            <div className="repaymentRow">
              <div className="label">
                {loanDetailsConst.OneTimeProcessingFee}
              </div>
              <div className="value">{annualFee}</div>
            </div>
          </>
        )}
      </div>
      {productType === 280 && (
        <div className="loanDetailNote">
          {loanDetailsConst.note}
          <div className="loanDetailNoteInfo">{loanDetailsConst.noteInfo}</div>
        </div>
      )}

      {showModel && (
        <Model name={modelName} handlebuttonClick={handlePopupBackButton} />
      )}
    </>
  );
};

export default LoanDetailsInfo;

