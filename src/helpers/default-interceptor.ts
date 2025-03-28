
import axios from "axios";
import { sha256 } from "js-sha256";

import submitService from "../services/submit-service";
import { getTokenChno, getUrl, keyToken } from "../utils/common/change.utils";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

export const generateSHA256Encrypt = (
  request: any,
  sessionUid: string,
  urlEndPoint: any,
  scClientContextHeaders: any
) => {
  const xrtob:any = process.env.REACT_APP_XRTOB;
  const appRef = getUrl.getChannelRefNo().applicationRefNo;
  
  let xrtobWithRefNo = xrtob;
 
  let defaultValue = xrtob + sessionUid;
  if (urlEndPoint === "resume") {
    defaultValue += appRef;
  } else if (urlEndPoint === "authorize" && getUrl.getParameterByName("products")) {
    const product = JSON.parse(JSON.stringify(getUrl.getProductInfo()));
    product.filter((item: any) => {
      delete item.product_description;
      delete item.company_category;
      delete item.product_category_name;
      return item;
    });
    let productInfo = "";
    product.forEach((data: any) => {
      const objKeys = Object.keys(data).sort();
      objKeys.forEach((item: any) => {
        productInfo += data[item];
      });
    });
    scClientContextHeaders["products"] = sha256(xrtob + productInfo);
  } else if (urlEndPoint === "person") {
    const data = getTokenChno();
    scClientContextHeaders['tokenKeys'] = sha256(xrtob + keyToken('authorize-keys'));
    scClientContextHeaders['personKeys'] = sha256(xrtob + keyToken('myinfo-keys'));

    defaultValue += data.channelRefNo + data.code;
  } else if (urlEndPoint === "create") {
    defaultValue += getUrl.getChannelRefNo().channelRefNo;
  } else if (
    urlEndPoint === "personal" ||
    urlEndPoint === "apply" ||
    urlEndPoint === "ngr-offer" ||
    urlEndPoint === "confirm" ||
    urlEndPoint === "preserve" ||
    urlEndPoint === "activate"
  ) {
    defaultValue += `${getUrl.getChannelRefNo().channelRefNo}${
      getUrl.getChannelRefNo().applicationRefNo
    }`;
  } else if(urlEndPoint === 'generate') {
    defaultValue += request.data.mobileNo + request.data.flowType + request.data.applnRefNo;
    scClientContextHeaders["generate_otp"] = sha256(xrtob + request.data.mobileNo + request.data.flowType + request.data.applnRefNo);
  } else if(urlEndPoint === 'verify') {
    defaultValue += request.data['enc-otp'] + request.data['flow-type'] + request.data['key-index'] + request.data['mobile-no'] + request.data['otp-sn'] + request.data['user-id'];
    scClientContextHeaders["verify_otp"] = sha256(xrtob + request.data['enc-otp'] + request.data['flow-type'] + request.data['key-index'] + request.data['mobile-no'] + request.data['otp-sn'] + request.data['user-id']);
  }
  const getToken = getUrl.getParameterByName("SSCode") || getUrl.getParameterByName('transfer-token');
  if (getToken) {
    defaultValue += submitService.generateUUID + getToken
  }
  if (urlEndPoint === "preserve") {
    const stage = request.data.application.stage;
    let stages = "";
    stages += stage.page_id + stage.stage_id;
    scClientContextHeaders["stage"] = sha256(
      xrtobWithRefNo + appRef + getTokenChno().channelRefNo + extractValue(stages)
    );
  } else {
    delete scClientContextHeaders["stage"];
  }
  if (urlEndPoint !== 'generate' && urlEndPoint !== 'verify' && request.data && request.data.application) {
    const application = JSON.parse(JSON.stringify(request.data.application));
    delete application.stage;
    scClientContextHeaders["application"] = sha256(
      xrtob + extractValue(application)
    );
  }

  if (urlEndPoint !== 'generate' && urlEndPoint !== 'verify' && request.data && request.data.applicant) {
    if (appRef) {
      xrtobWithRefNo += appRef;
    }
    scClientContextHeaders["applicants"] = sha256(
      xrtobWithRefNo + getTokenChno().channelRefNo + extractValue(request.data.applicant)
    );
  }
  scClientContextHeaders["authorization"] = sha256(defaultValue);
  if(urlEndPoint === 'generate' || urlEndPoint === 'verify') {
    delete scClientContextHeaders["application"];
    delete scClientContextHeaders["applicants"];
    if(urlEndPoint === 'generate')
    {
      delete scClientContextHeaders["verify_otp"];
    }
    else if(urlEndPoint === 'verify') {
      delete scClientContextHeaders["generate_otp"];
    }
  } else {
    delete scClientContextHeaders["generate_otp"];
    delete scClientContextHeaders["verify_otp"];
  }
};
/** This method used to extract the values from payload list */
const extractValue = (data: any) => {
  let productInfo: string = "";
  const objKeys = Object.keys(data).sort();
  objKeys.forEach((item: any) => {
    productInfo += data[item];
  });
  return productInfo;
};

const defaultInterceptor = () => {
  let scClientContextHeaders: any = {
    Channel: "MOBILE",
    Country: "SG",
    Language: "EN",
    AppName: "RCWB",
    ClientId: "MOBILE",
    InstanceCode: "CB_SG",
    RumDevice: "devicebrowserversion",
    Source: "sc.com",
    DeviceType: "Desktop",
    AgentType: "DESKTOP_BROWSER",
    BrowserAgent: "DESKTOP-BROWSER",
    IPAddress: "",
  };
  
  let abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, 180000);

  axios.interceptors.request.use(
    (request) => {
      let currentEndpoint: any = request.url && request.url.split("/");
      let uUid = submitService.generateUUID;
      let header: any = {
        "Content-Type": "application/json;charset=UTF-8",
      };
      if (process.env.REACT_APP_ENVIRONMENT === "uat") {
        header["Env"] = process.env.REACT_APP_ENVIRONMENT; 
      }
      scClientContextHeaders["reqId"] = uUid;
      if (store.getState().auth.sessionUid !== null) {
        const sessionUid = store.getState().auth.sessionUid;
        const urlEndPoint = currentEndpoint[currentEndpoint.length - 1];
        generateSHA256Encrypt(
          request,
          sessionUid,
          urlEndPoint,
          scClientContextHeaders
        );
        scClientContextHeaders["sessionUID"] = sessionUid;
      }
      if (currentEndpoint[currentEndpoint.length - 1] === "person") {
        header["requestId"] = uUid;

        if(getUrl.getParameterByName("isMyInfoVirtualNRIC")) {
          header["virtual"] = "YES";
        }
      }
      if (currentEndpoint[currentEndpoint.length - 2] === "ibank") {
        const tokenLabel = getUrl.getParameterByName('transfer-token') ? 'transfer-token' : 'code';
        header[tokenLabel] = getUrl.getParameterByName("SSCode") || getUrl.getParameterByName('transfer-token');
      }
      request.headers["SC-CLIENT-CONTEXT"] = JSON.stringify(
        scClientContextHeaders
      );

      request.headers.set(header);

      return {
        ...request,
        signal: abortController.signal,
      };
    }
  );

  axios.interceptors.response.use((res) => {
    clearTimeout(timeout);
    return res;
  });
};

export default defaultInterceptor;
