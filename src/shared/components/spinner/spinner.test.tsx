import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import Spinner from "./spinner";

jest.mock("axios", () => ({
  __esModule: true,
}));
jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));

describe("Spinner Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;

    test("Spinner component render correctly", () => {
        store = mockStore({});
    
        wrapper = shallow(
          <Provider store={store}>
            <Spinner/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(Spinner)).toHaveLength(1);
      });
});
