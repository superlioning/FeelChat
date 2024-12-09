// cypress/e2e/auth.cy.js

describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  const testUser = {
    name: "Tester",
    email: "tester@example.com",
    password: "tester@example.com",
    role: "User",
  };

  it("should allow user login", () => {
    cy.visit("/login");
    cy.get("#floatingEmail").type(testUser.email);
    cy.get("#floatingPassword").type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/chat");
  });

  it("should show error for invalid credentials", () => {
    cy.visit("/login");
    cy.get("#floatingEmail").type("wrong@email.com");
    cy.get("#floatingPassword").type("wrongpassword");
    cy.get('button[type="submit"]').click();
    cy.get(".text-danger").should("be.visible");
  });

  it("should allow user logout", () => {
    // Login first
    cy.visit("/login");
    cy.get("#floatingEmail").type(testUser.email);
    cy.get("#floatingPassword").type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Then test logout
    cy.get("button").contains("Logout").click();
    cy.url().should("include", "/login");
  });
});
