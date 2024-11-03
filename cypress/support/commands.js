Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://localhost:3000/loginPage");
  cy.get("#floatingEmail").type(email);
  cy.get("#floatingPassword").type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("deleteTestUser", (email) => {
  cy.request('POST', 'http://localhost:3000/api/deleteTestUser', { email });
});

Cypress.Commands.add("createTestUser", (email, password, name) => {
  cy.request("POST", "http://localhost:3000/api/signup", {
    email,
    password,
    name,
  });
});