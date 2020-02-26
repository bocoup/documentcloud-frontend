import { extractErrorData } from "./errorData";

test("extract basic data", () => {
  expect(
    extractErrorData({
      email: ["needed"]
    })
  ).toEqual([{ key: "email", values: ["needed"] }]);

  expect(
    extractErrorData({
      email: ["needed"],
      id: ["missing", "required"]
    })
  ).toEqual([
    { key: "email", values: ["needed"] },
    { key: "id", values: ["missing", "required"] }
  ]);
});

test("extract array data", () => {
  expect(extractErrorData(["missing"])).toEqual([
    { key: null, values: ["missing"] }
  ]);
});