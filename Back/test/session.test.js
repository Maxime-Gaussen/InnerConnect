import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUserInst = vi.hoisted(() => ({ getBy: vi.fn() }));
const mockBcrypt   = vi.hoisted(() => ({ compare: vi.fn(), hash: vi.fn() }));
const mockJwt      = vi.hoisted(() => ({ sign: vi.fn().mockReturnValue('mock-token'), verify: vi.fn() }));

vi.mock('../model/User.js', () => ({ User: vi.fn(function() { return mockUserInst; }) }));
vi.mock('bcrypt',           () => ({ default: mockBcrypt }));
vi.mock('jsonwebtoken',     () => ({ default: mockJwt }));

import { login, get, logout } from '../controller/session.js';

const mockUser = { id_user: 1, email: 'jean@test.fr', password: 'hashed', nom: 'Dupont' };

const mockRes = () => {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
};

describe('session controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockJwt.sign.mockReturnValue('mock-token');
    process.env.JWT_SECRET = 'secret';
  });

  describe('login()', () => {
    it('renvoie un token et l\'utilisateur si les identifiants sont corrects', async () => {
      mockUserInst.getBy.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);

      const req = { body: { email: 'jean@test.fr', password: 'password123' } };
      const res = mockRes();

      await login(req, res);

      expect(mockUserInst.getBy).toHaveBeenCalledWith({ email: 'jean@test.fr' });
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed');
      expect(res.cookie).toHaveBeenCalledWith('token', 'mock-token', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mock-token' }));
    });

    it('renvoie 401 si le mot de passe est incorrect', async () => {
      mockUserInst.getBy.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false);

      const req = { body: { email: 'jean@test.fr', password: 'mauvais' } };
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Identifiants incorrects' });
    });

    it('renvoie 401 si l\'utilisateur n\'existe pas', async () => {
      mockUserInst.getBy.mockResolvedValue(null);

      const req = { body: { email: 'inconnu@test.fr', password: 'password123' } };
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('get()', () => {
    it('renvoie l\'utilisateur sans son mot de passe', async () => {
      const req = { user: { ...mockUser } };
      const res = mockRes();

      await get(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.user.password).toBeUndefined();
      expect(result.user.nom).toBe('Dupont');
    });
  });

  describe('logout()', () => {
    it('efface le cookie et renvoie success', async () => {
      const req = {};
      const res = mockRes();

      await logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
