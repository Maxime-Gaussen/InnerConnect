import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockMethodoInst = vi.hoisted(() => ({
  get: vi.fn(),
  getAll: vi.fn(),
  create: vi.fn(),
  getAllMethodoByPro: vi.fn(),
}));

vi.mock('../model/Methodologie.js', () => ({ Methodologie: vi.fn(function() { return mockMethodoInst; }) }));

import { getOne, getAll, create, getAllMethodologieByPro } from '../controller/methodologie.js';

const mockMethodo  = { id_methodo: 1, titre: 'Médecin', descriptif: 'Médecin généraliste.' };
const mockMethodos = [mockMethodo, { id_methodo: 2, titre: 'Infirmier', descriptif: 'Soins infirmiers.' }];

const mockRes = () => {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
};

describe('methodologie controller', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getOne()', () => {
    it('renvoie la méthodologie si elle existe', async () => {
      mockMethodoInst.get.mockResolvedValue(mockMethodo);
      const res = mockRes();

      await getOne({ params: { id: '1' } }, res);

      expect(mockMethodoInst.get).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ methodo: mockMethodo });
    });

    it('renvoie 404 si la méthodologie n\'existe pas', async () => {
      mockMethodoInst.get.mockResolvedValue(null);
      const res = mockRes();

      await getOne({ params: { id: '99' } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Méthodologie introuvable' });
    });
  });

  describe('getAll()', () => {
    it('renvoie toutes les méthodologies', async () => {
      mockMethodoInst.getAll.mockResolvedValue(mockMethodos);
      const res = mockRes();

      await getAll({}, res);

      expect(res.json).toHaveBeenCalledWith(mockMethodos);
    });

    it('renvoie un tableau vide si aucune méthodologie', async () => {
      mockMethodoInst.getAll.mockResolvedValue([]);
      const res = mockRes();

      await getAll({}, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('create()', () => {
    it('crée une méthodologie avec les bons champs', async () => {
      mockMethodoInst.create.mockResolvedValue(mockMethodo);
      const res = mockRes();

      await create({ body: { titre: 'Médecin', descriptif: 'Médecin généraliste.', img_presentation: 'medecin.jpg' } }, res);

      expect(mockMethodoInst.create).toHaveBeenCalledWith({
        titre: 'Médecin',
        descriptif: 'Médecin généraliste.',
        img_presentation: 'medecin.jpg',
      });
      expect(res.json).toHaveBeenCalledWith(mockMethodo);
    });
  });

  describe('getAllMethodologieByPro()', () => {
    it('renvoie les méthodologies d\'un professionnel', async () => {
      mockMethodoInst.getAllMethodoByPro.mockResolvedValue(mockMethodos);
      const res = mockRes();

      await getAllMethodologieByPro({ params: { id_user: '1' } }, res);

      expect(mockMethodoInst.getAllMethodoByPro).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockMethodos);
    });

    it('renvoie 404 si le professionnel n\'a pas de méthodologie', async () => {
      mockMethodoInst.getAllMethodoByPro.mockResolvedValue(null);
      const res = mockRes();

      await getAllMethodologieByPro({ params: { id_user: '99' } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
