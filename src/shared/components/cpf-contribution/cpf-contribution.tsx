import {useState,useEffect} from 'react'
import { KeyWithAnyModel } from "../../../utils/model/common-model";
import  "./cpf-contribution.scss";

const CPFContribution =(props: KeyWithAnyModel)=>{
const[cpfContributionData,setCpfContributionData]=useState([])
    useEffect(()=>{
      const cpfContributionsDetails = props.cpfContrubutionLogicalValue;
      if(cpfContributionsDetails && cpfContributionsDetails.length > 0){
        const cpfContributionObj = JSON.parse(cpfContributionsDetails);
        setCpfContributionData(cpfContributionObj)
      }  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
     return(
     <>
     <div className="cpf__container">
     <div className="cpf__label">
     <label htmlFor="cpfContribution">{cpfContributionData.length > 0 ?'CPF Contribution Histrory' : ''}</label>
     </div>
     <div className="cpf__table">
    { cpfContributionData && cpfContributionData.length > 0 &&
    cpfContributionData.map((cpfdata :KeyWithAnyModel,index: number) => {
      return(
          <><table>
           <tr key={index}>
           <td>MONTH<span>{cpfdata.month}</span></td>
           <td>DATE PAID<span>{cpfdata.date}</span></td>
           </tr>
            <tr>
            <td>AMOUNT<span>{cpfdata.amount}</span></td>
            <td>EMPLOYER<span>{cpfdata.employer}</span></td>
            </tr>
          </table>
          </>
      )}
    )}
    </div>
    </div>
    </>
    )
}

export default CPFContribution;
