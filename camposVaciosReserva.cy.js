describe('reservar sin datos', () => {
  it('no permite continuar sin ingresar datos', () => {
    cy.visit('https://cabanapinohuacho.mlarac.cl/')
    cy.get('.hero-buttons a[href="/reservar"]').click()
    cy.url().should('include', '/reservar')

    cy.get('div.text-center > .btn').first().click()

    cy.get('.alert-warning')
      .should('be.visible')
      .and('contain', 'Por favor completa todos los campos de fechas')
  })
})