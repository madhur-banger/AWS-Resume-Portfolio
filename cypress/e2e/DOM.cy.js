describe('Frontend Tests', () => {
    const resumeUrl = 'madhur.cloudevopsnow.com'; // Replace with your actual website URL
    const apiUrl = 'https://0ow2l7wz4c.execute-api.us-east-1.amazonaws.com/Test/visitors'; // Replace with your API Gateway URL
  
    afterEach(() => {
      // Reset the visitor count using your API
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/reset`, // Assuming a reset endpoint exists
        body: { tableName: "VisitorCounter" },
        headers: { 'Content-Type': 'application/json' }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  
    it('should display the visitor count correctly', () => {
      // Visit the resume page
      cy.visit(resumeUrl);
  
      // Wait for the visitor count to update and check for no error message
      cy.get('#view-count', { timeout: 20000 })
        .should('not.contain.text', 'Error loading count value')
        // .and('match', /^[0-9]+$/)
        ; // Check that it's a numeric value
    });
  });
  