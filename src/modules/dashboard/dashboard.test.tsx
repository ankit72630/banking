import { cleanup } from "@testing-library/react";

import { shallow, ShallowWrapper } from "enzyme";

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import storeMockData from './../../utils/mock/store-spec.json';
import Dashboard from "./dashboard";

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

describe("Dashboard Testing", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
  });

  test("should render", () => {
    expect(wrapper).not.toBeNull();
  });
});

