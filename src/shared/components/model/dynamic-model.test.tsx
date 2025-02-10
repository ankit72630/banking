import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import DynamicModel from "./dynamic-model";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("axios", () => ({
  __esModule: true,
}));
jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));

describe("Dynamic Model Component Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;

    test("Dynamic Model component render correctly", () => {
        store = mockStore({});
    
        wrapper = shallow(
          <Provider store={store}>
            <DynamicModel/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(DynamicModel)).toHaveLength(1);
      });
});
