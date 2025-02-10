import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import Toggle from "./toggle";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("axios", () => ({
  __esModule: true,
}));
jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));

describe("Toggle component Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;

    test("Toggle component render correctly", () => {
        store = mockStore({});
    
        wrapper = shallow(
          <Provider store={store}>
            <Toggle/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(Toggle)).toHaveLength(1);
      });
});
