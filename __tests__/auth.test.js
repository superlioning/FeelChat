import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SignupPage from "../app/signup/page";
import LoginPage from "../app/login/page";
import { useGlobalState } from "../app/context/GlobalStateContext";

// Mock the dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../app/context/GlobalStateContext", () => ({
  useGlobalState: jest.fn(),
}));

describe("Authentication Tests", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useGlobalState.mockReturnValue({ setRole: jest.fn() });
    global.fetch = jest.fn();
  });

  test("1. SignupPage renders all form fields", () => {
    render(<SignupPage />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("2. SignupPage shows verification code field for Admin role", () => {
    render(<SignupPage />);
    const roleSelect = screen.getByRole("combobox");
    fireEvent.change(roleSelect, { target: { value: "Admin" } });
    expect(screen.getByLabelText("Verification Code")).toBeInTheDocument();
  });

  test("3. LoginPage handles successful login", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ role: "User" }),
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Log In"));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/chat");
    });
  });

  test("4. LoginPage displays error message on failed login", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    });

    render(<LoginPage />);
    const form = screen.getByRole("form");

    // Prevent actual form submission
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Invalid credentials/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("5. SignupPage validates admin verification code", async () => {
    process.env.NEXT_PUBLIC_ADMIN_VERIFICATION_CODE = "correct-code";

    render(<SignupPage />);
    const roleSelect = screen.getByRole("combobox");
    const form = screen.getByRole("form");

    fireEvent.change(roleSelect, { target: { value: "Admin" } });
    const codeInput = screen.getByLabelText("Verification Code");
    fireEvent.change(codeInput, { target: { value: "wrong-code" } });

    // Prevent actual form submission
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Invalid verification code/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});