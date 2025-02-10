import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import Model from "./model";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("axios", () => ({
  __esModule: true,
}));
jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));

describe("Model Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;

    test("Model component render correctly", () => {
        store = mockStore({});
    
        wrapper = shallow(
          <Provider store={store}>
            <Model/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(Model)).toHaveLength(1);
      });
});
