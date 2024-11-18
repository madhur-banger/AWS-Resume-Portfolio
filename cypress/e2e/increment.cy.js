describe('API Tests', () => {
    const apiUrl = 'https://0ow2l7wz4c.execute-api.us-east-1.amazonaws.com/Prod/visitors'; // Replace with your API Gateway URL
  
    it('should increment the visitor count correctly', () => {
      let initialCount;
  
      // Step 1: Get the current visitor count
      cy.request({
        method: 'GET',
        url: `${apiUrl}`, // Replace with your GET endpoint
        headers: { 'Accept': 'application/json' }
      }).then((response) => {
        expect(response.status).to.equal(200);
        initialCount = response.body.Views;
        cy.log('Initial Visitor Count:', initialCount);
  
        // Step 2: Increment the visitor count
        return cy.request({
          method: 'POST',
          url: `${apiUrl}`, // Replace with your POST endpoint
          headers: { 'Content-Type': 'application/json' }
        });
      }).then((response) => {
        expect(response.status).to.equal(200);
        const updatedCount = response.body.Views;
        cy.log('Updated Visitor Count:', updatedCount);
  
        // Step 3: Validate that the count has incremented
        expect(updatedCount).to.equal(initialCount + 1);
      });
    });
  
    afterEach(() => {
      // Reset the visitor count after tests
      cy.request({
        method: 'POST',
        url: `${apiUrl}`, // Assuming a reset endpoint exists
        body: { tableName: "VisitorCounter" },
        headers: { 'Content-Type': 'application/json' }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });
  