import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import RadioWithLabel from "./radio-with-label";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("axios", () => ({
  __esModule: true,
}));
jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));

describe("RadioWithLabel Model Component Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;

    test("RadioWithLabel Model component render correctly", () => {
        store = mockStore({name : "aaaa"});
    
        wrapper = shallow(
          <Provider store={store}>
            <RadioWithLabel/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(RadioWithLabel)).toHaveLength(1);
      });
});
