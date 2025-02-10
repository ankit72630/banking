import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import OtherMyinfo from "./other-myinfo";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("axios", () => ({
  __esModule: true,
}));

describe("Other Myinfo Component Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;

    test("Other Myinfo component render correctly", () => {
        store = mockStore({});
    
        wrapper = shallow(
          <Provider store={store}>
            <OtherMyinfo/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(OtherMyinfo)).toHaveLength(1);
      });
});
