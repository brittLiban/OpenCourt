/// <reference types="cypress" />

describe('event page', () => {
    beforeEach(() => {

        cy.visit('http://localhost:3005')
    })

    it('visits event page and posts multiple events', () => {
        cy.contains('button', 'Events').click()
        cy.get("h4").should('have.text', 'Available Events');

        cy.get("ul").within(() => {
            cy.get('li').should('contain', 'Pickle at the Farm @ Location #1')
        })

        cy.get('input[name="game_name"]').type('Test Game')

        cy.get('input[name="location_id"]').type(2)

        cy.contains("button", "Add Game").click()

        cy.reload()

        cy.contains('button', 'Events').click()

        cy.get("ul").within(() => {
            cy.get('li').last().should('contain', 'Test Game @ Location #2')
        })

        cy.get('input[name="game_name"]').type('Second Test Game')

        cy.get('input[name="location_id"]').type(1)

        cy.contains("button", "Add Game").click()

        cy.get('input[name="game_name"]').type('Third Test Game')

        cy.get('input[name="location_id"]').type(2)

        cy.contains("button", "Add Game").click()

        cy.get('input[name="game_name"]').type('Fourth Test Game')

        cy.get('input[name="location_id"]').type(2)

        cy.contains("button", "Add Game").click()

        cy.reload()

        cy.contains('button', 'Events').click()

        cy.get("ul").within(() => {
            cy.get('li').last().should('contain', 'Fourth Test Game @ Location #2')
            cy.get('li').should('contain', 'Third Test Game @ Location #2')
            cy.get('li').should('contain', 'Second Test Game @ Location #1')
        })


    })

})