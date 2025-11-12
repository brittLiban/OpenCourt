/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('loading pages', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:80')
  })

  it('loads front page', () => {
    cy.get('[data-cy="home-title"]').should('contain', 'Welcome to OpenCourt')
    cy.contains('h3', 'Welcome to OpenCourt')
    
    cy.contains('button', 'Users').click()
    cy.contains('h4', 'Created Users')
  })
})