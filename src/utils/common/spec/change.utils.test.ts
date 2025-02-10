import { cleanup } from "@testing-library/react";
import { store } from "../../store/store";
import { urlParamAction } from "../../store/urlparam-slice";
import { filterDisableFields, getUrl } from "../change.utils";
import formConfigMock from "../../../utils/mock/form-config-spec.json";

const hostUrl = "https://pt.sc.com";

jest.autoMockOff();
jest.mock("axios", () => ({
  __esModule: true,
}));


let formStore: any;
beforeEach(() => {
  formStore = formConfigMock.fields;
});

afterEach(() => {
  cleanup()
  jest.resetAllMocks();
});
afterAll(() => {
  jest.clearAllMocks();
});


const mockUseLocationValue = {
  pathname: "/",
  search: "",
  hash: "",
  state: null,
};

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});
afterAll(() => {
  jest.clearAllMocks();
});
describe("Change utils", () => {
  describe("test getParameterByName", () => {
    xtest("getting parameter with products", () => {
      mockUseLocationValue.pathname = hostUrl + "/?product=210&campaign=R007";
      mockUseLocationValue.search = "?product=210&campaign=R007";
      store.dispatch(urlParamAction.getUrlParameter(mockUseLocationValue));
      expect(getUrl.getParameterByName("product")).toBe("210");
    });
  });

  describe("Validate filterDisableFields",()=>{
      xtest("filterDisableFields should return an array missing mandatory fields by comparing formConfig and MyInfo data",()=>{
        let myInfoMissingValues =  ['email'];
        expect(filterDisableFields(formStore,myInfoMissingValues)).toEqual(["full_name","last_name","mobile_number"])
      });
      xtest("filterDisableFields should return empty array [] if myInfoMissingValues or formStore values doesnt match", () => {
        let myInfoMissingValues = ["testing"];
        expect(filterDisableFields(formStore, myInfoMissingValues)).toEqual([
          "full_name",
          "last_name",
          "email",
          "mobile_number",
        ]);
      });
  })
});

