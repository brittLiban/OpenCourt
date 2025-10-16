describe("POST /api/newUser", () => {
  const baseUrl = "http://localhost:3001"; 

  it("should create a new user successfully", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/newUser`,
      body: {
        email: "john@example.com",
        username: "john",
        password: "secret123",
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("email", "john@example.com");
      expect(response.body).to.have.property("username", "john");
    });
  });
});
