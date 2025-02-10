import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import Button from "./button";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("axios", () => ({
  __esModule: true,
}));
jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));

describe("Button Component Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;
    
    test("Button component render correctly", () => {
        store = mockStore({});
    
        wrapper = shallow(
          <Provider store={store}>
            <Button/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(Button)).toHaveLength(1);
      });
});
