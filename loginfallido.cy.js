describe('login_fallido', () => {
  it('passes', () => {
    cy.visit('https://cabanapinohuacho.mlarac.cl/admin/login')

    cy.get('#username').type('admin')
    cy.get('#password').type('wrongpassword')
    cy.get('.btn').click()

    // Verifica que el mensaje de error sea visible
    cy.get('li').should('be.visible').and('contain', 'Credenciales inválidas')

    // Verifica que NO redirigió al panel de admin
    cy.url().should('include', '/login')

    // Verifica que sigue en la pantalla de login (el form de login sigue visible)
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
  })
})