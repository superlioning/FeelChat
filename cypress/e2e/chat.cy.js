// cypress/e2e/chat.cy.js

describe("Chat Functionality", () => {
  const testUser = {
    email: "test@example.com",
    password: "123456",
  };

  beforeEach(() => {
    // Login before each test
    cy.visit("/login");
    cy.get("#floatingEmail").type(testUser.email);
    cy.get("#floatingPassword").type(testUser.password);
    cy.get('button[type="submit"]').click();
  });

  it("should join public chat room", () => {
    cy.get("button").contains("Join Chat").click();
    cy.contains("Public Room").should("be.visible");
  });

  it("should join private chat room", () => {
    const roomNumber = "12345";
    cy.get('input[placeholder="Leave blank for public room"]').type(roomNumber);
    cy.get("button").contains("Join Chat").click();
    cy.contains(`Private Room ${roomNumber}`).should("be.visible");
  });

  it("should send and display messages", () => {
    cy.get("button").contains("Join Chat").click();
    const message = "Hello, World!";
    cy.get('textarea[placeholder="Enter a chat message"]').type(message);
    cy.get('textarea[placeholder="Enter a chat message"]').type("{enter}");
    cy.contains(message).should("be.visible");
  });

  it("should edit message within time window", () => {
    cy.get("button").contains("Join Chat").click();
    const originalMessage = "Original message";
    const editedMessage = "Edited message";

    // Send original message
    cy.get('textarea[placeholder="Enter a chat message"]').type(
      originalMessage
    );
    cy.get('textarea[placeholder="Enter a chat message"]').type("{enter}");

    // Edit message
    cy.contains(originalMessage).trigger("mouseover");
    cy.get("button").contains("Edit").click();
    cy.get("input").clear().type(editedMessage);
    cy.get("input").type("{enter}");

    cy.contains(editedMessage).should("be.visible");
    cy.contains("(edited)").should("be.visible");
  });

  it("should delete message within time window", () => {
    cy.get("button").contains("Join Chat").click();
    const message = "Message to delete";

    // Send message
    cy.get('textarea[placeholder="Enter a chat message"]').type(message);
    cy.get('textarea[placeholder="Enter a chat message"]').type("{enter}");

    // Delete message
    cy.contains(message).trigger("mouseover");
    cy.get("button").contains("Delete").click();

    cy.contains(message).should("not.exist");
  });

  it("should exit chat room", () => {
    cy.get("button").contains("Join Chat").click();
    cy.get("button").contains("Exit Chat").click();
    cy.get('input[placeholder="Leave blank for public room"]').should(
      "be.visible"
    );
  });
});
