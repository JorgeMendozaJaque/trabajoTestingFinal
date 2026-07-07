describe('reservar', () => {
  it('permite realizar una reserva exitosa', () => {
    cy.visit('https://cabanapinohuacho.mlarac.cl/')
    cy.get('.hero-buttons a[href="/reservar"]').click()
    cy.url().should('include', '/reservar')
    cy.get('[name="checkIn"]').type('2026-07-30')
cy.get('[name="checkOut"]').type('2026-08-30')
cy.get('[name="guests"]').select('1')
cy.get('.text-center > .btn').first().click()
cy.get('[name="guestName"]').type('Renato Escarate')
cy.get('[name="guestEmail"]').type('renato.esc@ejemplo.com')
cy.get('[name="guestPhone"]').type('+56996576890')
cy.get('.d-flex > .btn-primary').click()
cy.get('#bookingForm').submit()
cy.get('.display-5').should('be.visible').and('contain', '¡Reserva exitosa!')



   
    

  })
})