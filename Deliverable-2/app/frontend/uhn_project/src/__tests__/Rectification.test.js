import React from "react";
import { render, screen } from "@testing-library/react";
import Rectify from '../Component/Login_email_rectification'; 
import { BrowserRouter as Router } from "react-router-dom";


describe("Rectify component", () => {
  test("renders Rectify component correctly", () => {
    render(
        <Router>
          <Rectify />
        </Router>
      );

    // Check if the help icon is present
    expect(screen.getByLabelText(/help/i)).toBeInTheDocument();

    // Check if the input is present
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    // Check if the Login button is present
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();

    // Check if the Go Back button is present
    expect(
      screen.getByRole("button", { name: /Go Back/i })
    ).toBeInTheDocument();

    // Check if the help icon is present
    expect(screen.getByLabelText(/help/i)).toBeInTheDocument();
  });
});










