describe('My First Test', () => {
  before(() => {
    cy.visit('localhost:3000/calculator');
  });

  it('Allows user to input values', () => {
    cy.getBySel('test-input').type('fake@email.com').should('have.value', 'fake@email.com');
  });
});
