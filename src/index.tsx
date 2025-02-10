
import { StrictMode} from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./utils/store/store";
import defaultInterceptor, { injectStore } from "./helpers/default-interceptor";
import TagManager from 'react-gtm-module'
import React from "react";


injectStore(store);
defaultInterceptor();

const tagManagerArgs = {
  gtmId: 'GTM-MCCZMM9'
}

TagManager.initialize(tagManagerArgs)

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Start of Adobe Analytics
declare global {
  interface Window{
    adobeDataLayer: Array<{}>
  }
}
// End of Adobe Analytics

root.render(
  <StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
