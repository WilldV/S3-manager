import { AuthGuard } from './Auth.guard';

describe('AuthGuard', () => {
  const guard = new AuthGuard();

  describe('validateRequest', () => {
    beforeAll(() => {
      process.env = { ALLOWED_API_KEYS: 'CORRECT_API_KEY' };
    });

    it('should throw API KEY is required error if the API_KEY_HEADER is not present', () => {
      const request = {
        headers: {},
      };

      expect(() => guard.validateRequest(request as Request)).toThrowError(
        'API KEY is required',
      );
    });

    it('should throw Invalid API KEY error if API_KEY_HEADER value is not present in ALLOWED_API_KEYS', () => {
      const request = {
        headers: {
          'X-API-KEY': 'DUMMY_API_KEY',
        },
      };
      expect(() =>
        guard.validateRequest(request as unknown as Request),
      ).toThrowError('Invalid API KEY');
    });

    it('should return true if API_KEY_HEADER value is present in ALLOWED_API_KEYS', () => {
      const request = {
        headers: {
          'X-API-KEY': 'CORRECT_API_KEY',
        },
      };
      expect(guard.validateRequest(request as unknown as Request)).toBe(true);
    });
  });
});
