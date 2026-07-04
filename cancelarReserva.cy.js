describe('cancelar_reserva', () => {
  it('passes', () => {
    cy.visit('https://cabanapinohuacho.mlarac.cl/admin/login')
    cy.get('#username').type('admin')
    cy.get('#password').type('admin123')
    cy.get('.btn').click()
    cy.get('.list-group > [href="/admin/reservas"]').click()

    // Acepta automáticamente el confirm() nativo del navegador
    cy.on('window:confirm', () => true)

    // Toma la reserva más reciente que aún tenga botón de cancelar disponible
    cy.get('[id^="reservation-"]')
      .filter(':has(.text-center > .btn)')
      .first()
      .find('.text-center > .btn')
      .click()

    // Verifica que la cancelación fue exitosa
    cy.get('.alert', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'cancelada')
  })
})