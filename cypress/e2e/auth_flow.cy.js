describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.deleteTestUser("test@example.com");
    cy.visit("http://localhost:3000");
  });

  it("should allow user to sign up", () => {
    cy.get("button").contains("Sign Up").click();

    // Test signup form
    cy.get("#floatingEmail").type("test@example.com");
    cy.get("#floatingPassword").type("password123");
    cy.get("#floatingName").type("Test User");
    cy.get('button[type="submit"]').click();

    // Should redirect to login page
    cy.url().should("include", "/loginPage");
  });

  it("should allow user to login", () => {
    cy.createTestUser("test@example.com", "password123", "Test User");
    cy.get("button").contains("Login").click();

    // Test login form
    cy.get("#floatingEmail").type("test@example.com");
    cy.get("#floatingPassword").type("password123");
    cy.get('button[type="submit"]').click();

    // Should redirect to chat page
    cy.url().should("include", "/chatPage");
  });

  it("should allow user to send chat messages", () => {
    cy.createTestUser("test@example.com", "password123", "Test User");
    // Login first
    cy.login("test@example.com", "password123");

    // Join chat room
    cy.get("#roomInput").type("test-room");
    cy.get("button").contains("Join Chat").click();

    // Send message
    cy.get("textarea").type("Hello World{enter}");

    // Verify message appears
    cy.contains("Hello World").should("be.visible");
  });
});
