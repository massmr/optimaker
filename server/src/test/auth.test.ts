import { verifyPassword, validateWithMauria, logExistingUserOrRegisterNew } from '../services/authService';
import { findUserByEmail } from '../services/userService'
import { handleUserCreation } from '../services/userService';

// Mock the dependencies
jest.mock('../services/authService', () => ({
  findUserByEmail: jest.fn(),
  verifyPassword: jest.fn(),
  validateWithMauria: jest.fn(),
}));

jest.mock('../services/userService', () => ({
  handleUserCreation: jest.fn(),
}));

describe('verifyUserExistenceOrRegister', () => {
  const email = 'test@example.com';
  const password = 'securepassword';

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return the user if they exist and the password is valid', async () => {
    const mockUser = { _id: '123', email, passwordHash: 'hashedpassword', role: 'student' };

    // Mock findUserByEmail to return a user
    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    // Mock verifyPassword to validate the password
    (verifyPassword as jest.Mock).mockResolvedValue(true);

    const result = await logExistingUserOrRegisterNew(email, password);

    expect(findUserByEmail).toHaveBeenCalledWith(email);
    expect(verifyPassword).toHaveBeenCalledWith(password, mockUser.passwordHash);
    expect(result).toEqual(mockUser);
  });

  it('should create a new user if they do not exist and are validated via Mauria', async () => {
    const mockNewUser = { _id: '456', email, role: 'student' };

    // Mock findUserByEmail to return null
    (findUserByEmail as jest.Mock).mockResolvedValue(null);

    // Mock validateWithMauria to return true
    (validateWithMauria as jest.Mock).mockResolvedValue(true);

    // Mock handleUserCreation to create a new user
    (handleUserCreation as jest.Mock).mockResolvedValue(mockNewUser);

    const result = await logExistingUserOrRegisterNew(email, password);

    expect(findUserByEmail).toHaveBeenCalledWith(email);
    expect(validateWithMauria).toHaveBeenCalledWith(email, password);
    expect(handleUserCreation).toHaveBeenCalledWith({ email, password, role: 'student' });
    expect(result).toEqual(mockNewUser);
  });

  it('should throw an error if the password is invalid for an existing user', async () => {
    const mockUser = { _id: '123', email, passwordHash: 'hashedpassword', role: 'student' };

    // Mock findUserByEmail to return a user
    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    // Mock verifyPassword to return false
    (verifyPassword as jest.Mock).mockResolvedValue(false);

    await expect(logExistingUserOrRegisterNew(email, password)).rejects.toThrow('INVALID_PASSWORD');

    expect(findUserByEmail).toHaveBeenCalledWith(email);
    expect(verifyPassword).toHaveBeenCalledWith(password, mockUser.passwordHash);
  });

  it('should throw an error if the user is not validated via Mauria', async () => {
    // Mock findUserByEmail to return null
    (findUserByEmail as jest.Mock).mockResolvedValue(null);

    // Mock validateWithMauria to return false
    (validateWithMauria as jest.Mock).mockResolvedValue(false);

    await expect(logExistingUserOrRegisterNew(email, password)).rejects.toThrow('INVALID_MAURIA_CREDENTIALS');

    expect(findUserByEmail).toHaveBeenCalledWith(email);
    expect(validateWithMauria).toHaveBeenCalledWith(email, password);
  });
});