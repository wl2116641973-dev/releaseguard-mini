export interface TestUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

export const TEST_USERS = {
  primary: {
    username: 'Heath93',
    password: 's3cret',
    firstName: 'Ted',
    lastName: 'Parisian',
    displayName: 'Ted P',
  } as TestUser,
  recipient: {
    username: 'Arvilla_Hegmann',
    password: 's3cret',
    firstName: 'Kristian',
    lastName: 'Hegmann',
    displayName: 'Kristian H',
  } as TestUser,
  secondary: {
    username: 'Dina20',
    password: 's3cret',
    firstName: 'Darrel',
    lastName: 'Dina',
    displayName: 'Darrel D',
  } as TestUser,
  invalidUser: {
    username: 'NonExistentUser999',
    password: 'wrong_password_xyz',
    firstName: '',
    lastName: '',
    displayName: '',
  } as TestUser,
};

export const TEST_PAYLOADS = {
  payment: {
    amount: '25.00',
    description: 'Pre-launch QA Automated Test Payment',
  },
  request: {
    amount: '15.00',
    description: 'Pre-launch QA Automated Test Request',
  },
};
