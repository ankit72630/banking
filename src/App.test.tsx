import { cleanup, render } from "@testing-library/react";
import App from "./App";
import { shallow, ShallowWrapper } from "enzyme";

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import Spinner from "./shared/components/spinner/spinner";
import Main from "./router/main";
import Model from "./shared/components/model/model";
import storeMockData from "./utils/mock/store-spec.json";
import React from "react";

jest.autoMockOff();
jest.mock("axios", () => ({
  __esModule: true,
}));

jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));


const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store: any;


beforeEach(() => {
  global.scrollTo = jest.fn();
  store = mockStore(storeMockData);
});
afterEach(() => {
  jest.resetAllMocks();
});
afterAll(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("Router Testing", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  test("should render", () => {
    expect(wrapper).not.toBeNull();
  });

 
});

