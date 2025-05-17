import * as authService from '../services/authService';
import * as userService from '../services/userService';

// Mock uniquement les fonctions internes, pas la fonction testée
jest.mock('../services/authService', () => ({
  ...jest.requireActual('../services/authService'),
  verifyPassword: jest.fn(),
  validateWithMauria: jest.fn()
}));

jest.mock('../services/userService', () => ({
  findUserByEmail: jest.fn(),
  handleUserCreation: jest.fn()
}));

describe('verifyUserExistenceOrRegister', () => {
  /* ggshield ignore start */
  const email = 'test@test.com';
  const password = 'abcdefghi';
  /* ggshield ignore end */

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user if they exist and the password is valid', async () => {
    const mockUser = { _id: '123', email, passwordHash: 'hashedpassword', role: 'student' };

    (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (authService.verifyPassword as jest.Mock).mockResolvedValue(true);

    const result = await authService.logExistingUserOrRegisterNew(email, password);

    expect(userService.findUserByEmail).toHaveBeenCalledWith(email);
    expect(authService.verifyPassword).toHaveBeenCalledWith(password, mockUser.passwordHash);
    expect(result).toEqual(mockUser);
  });
});