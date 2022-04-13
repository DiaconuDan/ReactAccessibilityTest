import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Form from "../index";
import {  REQUIRED_ERROR_MESSAGE } from "../constants";
import { AppModeContext } from "../../../App";

describe("LocationTable", () => {
  test("renders correctly initially", () => {
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

  test("toggles correctly the app state: READ and EDIT", async () => {
    render(
      <MemoryRouter>
        <AppModeContext>
          <Form />
        </AppModeContext>
      </MemoryRouter>
    );

    const toggle = screen.getByTestId("appToggle");

    expect(screen.getByText("READ")).toBeTruthy();

    fireEvent.click(toggle);

    expect(screen.getByText("EDIT")).toBeTruthy();
  });

  test("show correctly the required error", async () => {
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
});
