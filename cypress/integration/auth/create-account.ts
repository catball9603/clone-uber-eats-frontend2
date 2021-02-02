describe('Create Account', () => {
  const user = cy;
  it('should see email/password validation errors', () => {
    //시작 페이지를 create-account에서 시작
    user.visit('/');
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type('non@good');
    user.get('.text-sm').should('have.text', 'Please enter a valid email');
    user.findAllByPlaceholderText(/email/i).clear();
    user.get('.text-sm').should('have.text', 'Email is required');
    user
      .findAllByPlaceholderText(/password/i)
      .type('a')
      .clear();
    user.get('.grid > :nth-child(4)').should('have.text', 'Password is required');
  });

  it('should be able to create account', () => {
    user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === 'createAccountMutation') {
        req.reply((res) => {
          res.send({
            fixture: 'auth/create-account.json',
          });
        });
      }
    });
    user.visit('/create-account');
    user.findByPlaceholderText(/email/i).type('hokmahgrace@naver.com');
    user.findAllByPlaceholderText(/password/i).type('121212');
    user.findByRole('button').click();
    user.wait(1000);
    //@ts-ignore
    user.login('hokmahgrace@naver.com', '121212');
  });
});
