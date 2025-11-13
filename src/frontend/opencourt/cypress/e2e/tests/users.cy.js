/// <reference types="cypress" />

describe('users page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3005');
  });

  it('visits users page and creates a new user', () => {
    cy.contains('button', 'Users').click();

    cy.contains('h4', 'Created Users').should('be.visible');

    cy.get('input[name="user_name"]').type('Test User');

    cy.contains('button', 'Add User').click();

    cy.reload();

    cy.contains('button', 'Users').click();

    cy.get('ul').within(() => {
      cy.get('li').last().should('contain', 'Test User');
    });
  });
});
