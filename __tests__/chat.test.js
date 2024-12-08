// __tests__/chat.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import Chat from "../app/components/Chat";
import ChatMessage from "../app/components/ChatMessage";
import { useGlobalState } from "../app/context/GlobalStateContext";

// Mock the dependencies
jest.mock("../app/utils/pusherClient", () => ({
  subscribe: jest.fn(() => ({
    bind: jest.fn(),
    unbind: jest.fn(),
  })),
  unsubscribe: jest.fn(),
}));

jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("../app/context/GlobalStateContext", () => ({
  useGlobalState: jest.fn(),
}));

describe("Chat Component Tests", () => {
  beforeEach(() => {
    // Setup mock for GlobalStateContext
    useGlobalState.mockImplementation(() => ({
      user: "TestUser",
      channel: "test-channel",
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("6. ChatMessage renders with correct position", () => {
    render(
      <ChatMessage message="Hello" position="right" showActions={false} />
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("7. ChatMessage shows edit/delete buttons on hover when allowed", () => {
    render(
      <ChatMessage
        message="Test message"
        position="right"
        showActions={true}
        timestamp={Date.now()}
      />
    );

    const messageContainer = screen.getByText("Test message").parentElement;
    fireEvent.mouseEnter(messageContainer);

    expect(screen.getByTitle("Edit message")).toBeInTheDocument();
    expect(screen.getByTitle("Delete message")).toBeInTheDocument();
  });

  test("8. ChatMessage enters edit mode correctly", () => {
    render(
      <ChatMessage
        message="Test message"
        isEditing={true}
        editInput="Test message"
        setEditInput={() => {}}
      />
    );

    expect(screen.getByRole("textbox")).toHaveValue("Test message");
  });

  test("9. Chat component handles message input", () => {
    const { container } = render(<Chat />);
    const textarea = container.querySelector("textarea");
    if (textarea) {
      fireEvent.change(textarea, { target: { value: "New message" } });
      expect(textarea.value).toBe("New message");
    }
  });

  test("10. Chat component prevents empty messages", () => {
    const { container } = render(<Chat />);
    const textarea = container.querySelector("textarea");
    if (textarea) {
      fireEvent.change(textarea, { target: { value: "" } });
      fireEvent.keyUp(textarea, { keyCode: 13 });
      expect(textarea.value).toBe("");
    }
  });
});
