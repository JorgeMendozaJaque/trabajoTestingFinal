describe('cambiar precio', () => {
  it('passes', () => {
    cy.visit('https://cabanapinohuacho.mlarac.cl/admin/login')
    cy.get('#username').type('admin')
    cy.get('#password').type('admin123')
    cy.get('.btn').click()
    cy.get('.list-group > [href="/admin/precios"]').click()
    cy.get('#categoryPrice').type('50000')
    cy.get('#updateCategoryForm > .btn').click()

    cy.get('.alert', { timeout: 3000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.log('Texto real del alert: ' + text)
      })
  })
})