import { cleanup, render } from "@testing-library/react";
import { shallow, ShallowWrapper } from "enzyme";

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import storeMockData from './../../../utils/mock/store-spec.json';
import MyinfoSingpassLogin from "./myinfo-singpass-login";

jest.autoMockOff();
jest.mock("axios", () => ({
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

describe("MyinfoSingpassLogin Testing", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Provider store={store}>
        <MyinfoSingpassLogin />
      </Provider>
    );
  });

  test("should render", () => {
    expect(wrapper).not.toBeNull();
  });

  test("Should render correctly", () => {
    render(
      <Provider store={store}>
        <MyinfoSingpassLogin />
      </Provider>
    );
    expect(wrapper.find(MyinfoSingpassLogin)).toHaveLength(1);
  });
});

