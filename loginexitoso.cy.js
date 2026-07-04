describe('login_exitoso', () => {
  it('passes', () => {
    cy.visit('https://cabanapinohuacho.mlarac.cl/admin/login')

    cy.get('#username').type('admin')
    cy.get('#password').type('admin123')
    cy.get('.btn').click()

    // Verifica que salió de la página de login
    cy.url().should('not.include', '/login')

    // Verifica que llegó al panel de administración
    cy.url().should('include', '/admin')

    // Verifica que algún elemento propio del dashboard esté visible
    cy.get('.navbar-brand').should('be.visible')

    // Verifica que el menú lateral de navegación esté presente
    cy.get('.list-group').should('be.visible')
  })
})