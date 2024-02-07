import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    expect(account.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    const error = new InsufficientFundsError(initialBalance);
    expect(() => account.withdraw(105)).toThrowError(error);
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = new BankAccount(100);
    const account2 = new BankAccount(50);
    expect(() => account1.transfer(150, account2)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = new BankAccount(100);
    expect(() => account.transfer(50, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', async () => {
    const account = new BankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toEqual(150);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    account.withdraw(30);
    expect(account.getBalance()).toEqual(70);
  });

  test('should transfer money', () => {
    const account1 = new BankAccount(100);
    const account2 = new BankAccount(50);
    account1.transfer(30, account2);
    expect(account1.getBalance()).toEqual(70);
    expect(account2.getBalance()).toEqual(80);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = new BankAccount(100);
    const balance = await account.fetchBalance();
    expect(typeof balance === 'number' || balance === null).toBeTruthy();
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(75);
    const returnedBalance = await account.fetchBalance();
    expect(typeof returnedBalance).toBe('number');
    expect(returnedBalance).toEqual(75);
    jest.restoreAllMocks();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = new BankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(75);
    expect(account.getBalance()).toEqual(100);
    await account.synchronizeBalance();
    expect(account.getBalance()).toEqual(75);
    jest.restoreAllMocks();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = new BankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    expect(() => account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
    jest.restoreAllMocks();
  });
});
