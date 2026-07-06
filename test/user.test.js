import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUserInst = vi.hoisted(() => ({
  getAll: vi.fn(),
  get: vi.fn(),
  getBy: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));
const mockBcrypt = vi.hoisted(() => ({ hash: vi.fn().mockResolvedValue('hashed_password') }));
const mockJwt    = vi.hoisted(() => ({ sign: vi.fn().mockReturnValue('mock-token') }));

vi.mock('../model/User.js', () => ({ User: vi.fn(function() { return mockUserInst; }) }));
vi.mock('bcrypt',           () => ({ default: mockBcrypt }));
vi.mock('jsonwebtoken',     () => ({ default: mockJwt }));

import { getAll, getOne, create, update, remove } from '../controller/user.js';

const mockUser = { id_user: 1, nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr', password: 'hashed' };

const mockRes = () => {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  return res;
};

describe('user controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBcrypt.hash.mockResolvedValue('hashed_password');
    mockJwt.sign.mockReturnValue('mock-token');
    process.env.JWT_SECRET = 'secret';
  });

  describe('getAll()', () => {
    it('renvoie tous les utilisateurs sans leurs mots de passe', async () => {
      mockUserInst.getAll.mockResolvedValue([{ ...mockUser }, { ...mockUser, id_user: 2 }]);

      const req = {};
      const res = mockRes();

      await getAll(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result).toHaveLength(2);
      expect(result[0].password).toBeUndefined();
    });
  });

  describe('getOne()', () => {
    it('renvoie l\'utilisateur sans son mot de passe', async () => {
      mockUserInst.get.mockResolvedValue({ ...mockUser });

      const req = { params: { id: '1' } };
      const res = mockRes();

      await getOne(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.password).toBeUndefined();
      expect(result.nom).toBe('Dupont');
    });

    it('renvoie 404 si l\'utilisateur n\'existe pas', async () => {
      mockUserInst.get.mockResolvedValue(null);

      const req = { params: { id: '99' } };
      const res = mockRes();

      await getOne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur introuvable' });
    });
  });

  describe('create()', () => {
    it('crée un utilisateur, hache le mot de passe et renvoie un token', async () => {
      mockUserInst.create.mockResolvedValue({ ...mockUser });

      const req = { body: { nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr', password: 'password123' } };
      const res = mockRes();

      await create(req, res);

      const callArg = mockUserInst.create.mock.calls[0][0];
      expect(callArg.password).toBe('hashed_password');
      expect(res.cookie).toHaveBeenCalledWith('token', 'mock-token', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mock-token' }));
    });

    it('renvoie 500 si la création échoue', async () => {
      mockUserInst.create.mockResolvedValue(null);

      const req = { body: { nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr', password: 'pw' } };
      const res = mockRes();

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('update()', () => {
    it('met à jour et renvoie l\'utilisateur sans mot de passe', async () => {
      mockUserInst.update.mockResolvedValue({ ...mockUser, nom: 'Martin' });

      const req = { params: { id: '1' }, body: { nom: 'Martin' } };
      const res = mockRes();

      await update(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.user.nom).toBe('Martin');
      expect(result.user.password).toBeUndefined();
    });

    it('hache le nouveau mot de passe si fourni', async () => {
      mockUserInst.update.mockResolvedValue({ ...mockUser });

      const req = { params: { id: '1' }, body: { password: 'newpassword' } };
      const res = mockRes();

      await update(req, res);

      const callArg = mockUserInst.update.mock.calls[0][0];
      expect(callArg.password).toBe('hashed_password');
    });
  });

  describe('remove()', () => {
    it('supprime l\'utilisateur et renvoie le résultat', async () => {
      mockUserInst.remove.mockResolvedValue({ affectedRows: 1 });

      const req = { params: { id: '1' } };
      const res = mockRes();

      await remove(req, res);

      expect(mockUserInst.remove).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ affectedRows: 1 });
    });
  });
});
