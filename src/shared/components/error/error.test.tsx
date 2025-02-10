import { shallow, ShallowWrapper } from "enzyme";
import Error from "./error";

let wrapper: ShallowWrapper;

beforeEach(() => {
  wrapper = shallow(<Error />);
});

describe("Error Component", () => {
  it("should have one <h1> tag", () => {
    expect(wrapper.find("svg")).toHaveLength(1);
  });
});

