describe('editar_precio_dashboard', () => {
  it('passes', () => {
    cy.visit('https://cabanapinohuacho.mlarac.cl/admin/login')
    cy.get('#username').type('admin')
    cy.get('#password').type('admin123')
    cy.get('.btn').click()
    cy.get('.list-group > [href="/admin/precios"]').click()
    cy.get(':nth-child(1) > :nth-child(6) > .btn').click()
    cy.get(':nth-child(3) > .input-group > [name="price"]').click().clear().type('50000')
    cy.get('.modal-footer > .btn-primary').click()

    cy.get('.alert-success', { timeout: 5000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.log('Texto de la alerta: ' + text)
      })
  })
})