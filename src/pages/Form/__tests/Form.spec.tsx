import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router} from "react-router-dom";
import Form from "../index";
import { DATES_ERROR_MESSAGE, REQUIRED_ERROR_MESSAGE } from "../constants";
import { AppModeContext } from "../../../App";
import "@testing-library/jest-dom";

describe("Form", () => {
  test("renders the correct text on init", () => {
    render(
      <MemoryRouter>
        <Form />
      </MemoryRouter>
    );

    expect(screen.getByText("READ")).toBeTruthy();
    expect(screen.getByText("Dropdown")).toBeTruthy();
    expect(screen.getByText("Input text")).toBeTruthy();
    expect(screen.getByText("Input number")).toBeTruthy();
    expect(screen.getByText("Start")).toBeTruthy();
    expect(screen.getByText("End")).toBeTruthy();
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  test("toggles correctly the app state: READ and EDIT when toggling", async () => {
    render(
      <MemoryRouter>
        <AppModeContext>
          <Form />
        </AppModeContext>
      </MemoryRouter>
    );

    const toggle = screen.getByTestId("appToggle");

    expect(screen.queryByText("EDIT")).toBeNull();
    expect(screen.getByText("READ")).toBeTruthy();

    fireEvent.click(toggle);

    expect(screen.queryByText("READ")).toBeNull();
    expect(screen.getByText("EDIT")).toBeTruthy();
  });

  test("shows correctly the required error for the numeric input", async () => {
    render(
      <MemoryRouter>
        <AppModeContext>
          <Form />
        </AppModeContext>
      </MemoryRouter>
    );

    const toggle = screen.getByTestId("appToggle");
    const submitButton = screen.getByText("Submit");

    fireEvent.click(toggle);
    fireEvent.click(submitButton);

    const error = await screen.findByText(REQUIRED_ERROR_MESSAGE);

    expect(error).toBeInTheDocument();
  });

  test("show correctly the dates overlap error", async () => {
    render(
      <MemoryRouter>
        <AppModeContext>
          <Form />
        </AppModeContext>
      </MemoryRouter>
    );

    const toggle = screen.getByTestId("appToggle");
    fireEvent.click(toggle);

    const startDate = screen.getByPlaceholderText("Select Start Date");
    fireEvent.mouseDown(startDate);
    fireEvent.change(startDate, { target: { value: "05-06-2020" } });

    const endDate = screen.getByPlaceholderText("Select End Date");
    fireEvent.mouseDown(endDate);
    fireEvent.change(endDate, { target: { value: "06-06-2020" } });

    const error = await screen.findByText(DATES_ERROR_MESSAGE);

    expect(error).toBeInTheDocument();
  });

  test("changes correctly the button from green to yellow when date is in the past", async () => {
    render(
      <MemoryRouter>
        <AppModeContext>
          <Form />
        </AppModeContext>
      </MemoryRouter>
    );

    const submitButton = screen.getByTestId("submit");
    expect(submitButton).toHaveStyle("background: green");

    const toggle = screen.getByTestId("appToggle");
    fireEvent.click(toggle);

    const startDate = screen.getByPlaceholderText("Select Start Date");
    fireEvent.mouseDown(startDate);
    fireEvent.change(startDate, { target: { value: "01-01-2000" } });

    expect(submitButton).toHaveStyle("background: yellow");
  });

  test("should have no errors given the numeric input", async () => {
    const history = createMemoryHistory();

    render(
      <Router location={"/"} navigator={history}>
        <AppModeContext>
          <Form />
        </AppModeContext>
      </Router>
    );

    const submitButton = screen.getByText("Submit");
    const toggle = screen.getByTestId("appToggle");
    fireEvent.click(toggle);
    fireEvent.click(submitButton);

    const numberInput = screen.getByTestId("numericInput");
    fireEvent.mouseDown(numberInput);
    fireEvent.change(numberInput, { target: { value: 1 } });

    fireEvent.click(submitButton);

    const error = screen.queryByText(REQUIRED_ERROR_MESSAGE);

    expect(error).toBeNull();
  });
});
