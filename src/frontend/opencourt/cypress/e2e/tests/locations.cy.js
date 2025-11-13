/// <reference types="cypress" />

describe('locations page', () => {
    beforeEach(() => {

        cy.visit('http://localhost:3005')
    })

  it('submits the form successfully', () => {
    cy.contains('button', 'Locations').click();

    cy.contains('h4', 'Created Locations');

    cy.get("ul").within(() => {
        cy.get('li').should('contain', 'Game Farm Park | 3030 R ST SE Auburn, WA 98002')
    })

    cy.get('input[name="location_name"]').type('Test Location')
    cy.get('input[name="address"]').type('1234 OpenCourt Ave.')

    cy.contains("button", "Add Location").click()

    cy.reload();
    cy.contains('button', 'Locations').click();

    cy.get("ul").within(() => {
        cy.get('li').should('contain', 'Test Location | 1234 OpenCourt Ave')
    })
    
  })
})
