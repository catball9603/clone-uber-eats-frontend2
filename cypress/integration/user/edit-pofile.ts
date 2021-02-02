describe('Edit Profile', () => {
  const user = cy;
  //반복되는 요청
  beforeEach(() => {
    //@ts-ignore
    user.login('hokmahgrace@naver.com', '121212');
  });
  it('can go to /edit-profile using the header', () => {
    user.get('a[href="/edit-profile"]').click();
    //title check
    user.title().should('eq', 'Edit Profile | Uber Eats');
  });

  it('can change email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body?.operationName === 'editProfile') {
        //@ts-ignore
        req.body?.variables?.input?.email = 'hokmahgrace@naver.com';
      }
    });
    user.visit('/edit-profile');
    user.findAllByPlaceholderText(/email/i).clear().type('new@naver.com');
    user.findByRole('button').click();
  });
});
