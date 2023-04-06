import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import { server } from "../mocks/server";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// establish API mocking before all tests
beforeAll(() => server.listen());

afterEach(() => {
  // reset any request handlers that we may add during the tests,
  // so they don't affect other tests
  server.resetHandlers();
  // runs a cleanup after each test case (e.g. clearing jsdom)
  cleanup();
});

// clean up after the tests are finished
afterAll(() => server.close());
