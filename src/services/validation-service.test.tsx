import storeMockData from "../utils/mock/store-spec.json";
import validateService from "./validation-service";

let store: any;

beforeEach(() => {
  store = storeMockData.validation;
});

describe("NRIC Validation", () => {
  test("Valid NRIC test case", () => {
    expect(true).toBe(validateService.isValidNRIC(store.validNRIC));
  });
  test("Invalid NRIC test case", () => {
    expect(false).toBe(validateService.isValidNRIC(store.invalidNRIC));
  });
});
