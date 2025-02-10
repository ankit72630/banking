import { shallow, ShallowWrapper } from "enzyme";
import thunk from "redux-thunk";
import Cards from "./cards";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("axios", () => ({
  __esModule: true,
}));

describe("Cards Component Testing", () => {
    let wrapper: ShallowWrapper;
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store: any;

    test("Cards component render correctly", () => {
        store = mockStore({});
    
        wrapper = shallow(
          <Provider store={store}>
            <Cards/>
          </Provider>
        );
        expect(wrapper.length).toEqual(1);
        expect(wrapper.find(Cards)).toHaveLength(1);
      });
});
