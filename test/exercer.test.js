import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExercerInst = vi.hoisted(() => ({
  getBy: vi.fn(),
  getAllBy: vi.fn(),
  create: vi.fn(),
  removeEntry: vi.fn(),
  update: vi.fn(),
}));

vi.mock('../model/Exercer.js', () => ({ Exercer: vi.fn(function() { return mockExercerInst; }) }));

import { getOneByProAndMethodo, getOneByPro, create, remove } from '../controller/exercer.js';

const mockExercer = { id_pro: 1, id_methodo: 2 };

const mockRes = () => {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
};

describe('exercer controller', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getOneByProAndMethodo()', () => {
    it('renvoie l\'entrée si elle existe', async () => {
      mockExercerInst.getBy.mockResolvedValue(mockExercer);
      const res = mockRes();

      await getOneByProAndMethodo({ params: { id_pro: '1', id_methodo: '2' } }, res);

      expect(mockExercerInst.getBy).toHaveBeenCalledWith({ id_pro: '1', id_methodo: '2' });
      expect(res.json).toHaveBeenCalledWith({ exercer: mockExercer });
    });

    it('renvoie 404 si l\'entrée n\'existe pas', async () => {
      mockExercerInst.getBy.mockResolvedValue(null);
      const res = mockRes();

      await getOneByProAndMethodo({ params: { id_pro: '1', id_methodo: '99' } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getOneByPro()', () => {
    it('renvoie toutes les méthodologies d\'un professionnel', async () => {
      mockExercerInst.getAllBy.mockResolvedValue([mockExercer]);
      const res = mockRes();

      await getOneByPro({ params: { id_pro: '1' } }, res);

      expect(mockExercerInst.getAllBy).toHaveBeenCalledWith({ id_pro: '1' });
      expect(res.json).toHaveBeenCalledWith({ exercer: [mockExercer] });
    });

    it('renvoie 404 si le professionnel n\'existe pas', async () => {
      mockExercerInst.getAllBy.mockResolvedValue(null);
      const res = mockRes();

      await getOneByPro({ params: { id_pro: '99' } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('create()', () => {
    it('crée une nouvelle entrée Exercer', async () => {
      mockExercerInst.create.mockResolvedValue(mockExercer);
      const res = mockRes();

      await create({ body: { id_pro: 1, id_methodo: 2 } }, res);

      expect(mockExercerInst.create).toHaveBeenCalledWith({ id_pro: 1, id_methodo: 2 });
      expect(res.json).toHaveBeenCalledWith({ exercer: mockExercer });
    });
  });

  describe('remove()', () => {
    it('supprime l\'entrée Exercer et renvoie success', async () => {
      mockExercerInst.removeEntry.mockResolvedValue({ affectedRows: 1 });
      const res = mockRes();

      await remove({ params: { id_pro: '1', id_methodo: '2' } }, res);

      expect(mockExercerInst.removeEntry).toHaveBeenCalledWith('1', '2');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
