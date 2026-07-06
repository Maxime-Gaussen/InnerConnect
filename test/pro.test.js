import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockProInst = vi.hoisted(() => ({
  get: vi.fn(),
  getBy: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  searchByMethodo: vi.fn(),
  getAllProByMethodo: vi.fn(),
}));
const mockFindMedecin = vi.hoisted(() => vi.fn());

vi.mock('../model/Pro.js',               () => ({ Pro: vi.fn(function() { return mockProInst; }) }));
vi.mock('../controller/apiController.js', () => ({ findMedecinByIdentification: mockFindMedecin }));

import { getOne, getByUser, update, searchByVille, verify, register } from '../controller/pro.js';

const mockPro = { id_pro: 1, id_user: 1, nom_cabinet: 'Cabinet Test', ville: 'Marseille' };
const mockMedecin = {
  'Identification nationale PP': '810000002443',
  "Nom d'exercice": 'NAUDILLON',
  "Prénom d'exercice": 'YVES',
  'Libellé profession': 'Médecin',
  'Libellé spécialité': 'Médecine générale',
};

const mockRes = () => {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
};

describe('pro controller', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getOne()', () => {
    it('renvoie le professionnel si trouvé', async () => {
      mockProInst.get.mockResolvedValue(mockPro);

      await getOne({ params: { id: '1' } }, mockRes());
      expect(mockProInst.get).toHaveBeenCalledWith('1');
    });

    it('renvoie 404 si le professionnel n\'existe pas', async () => {
      mockProInst.get.mockResolvedValue(null);
      const res = mockRes();

      await getOne({ params: { id: '99' } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getByUser()', () => {
    it('renvoie le professionnel par id_user', async () => {
      mockProInst.getBy.mockResolvedValue(mockPro);
      const res = mockRes();

      await getByUser({ params: { id_user: '1' } }, res);

      expect(mockProInst.getBy).toHaveBeenCalledWith({ id_user: '1' });
      expect(res.json).toHaveBeenCalledWith({ pro: mockPro });
    });

    it('renvoie 404 si aucun professionnel pour cet utilisateur', async () => {
      mockProInst.getBy.mockResolvedValue(null);
      const res = mockRes();

      await getByUser({ params: { id_user: '99' } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('searchByVille()', () => {
    it('renvoie les professionnels filtrés par ville', async () => {
      mockProInst.searchByMethodo.mockResolvedValue([mockPro]);
      const res = mockRes();

      await searchByVille({ query: { id_methodo: '1', ville: 'Marseille' } }, res);

      expect(mockProInst.searchByMethodo).toHaveBeenCalledWith('1', 'Marseille');
      expect(res.json).toHaveBeenCalledWith([mockPro]);
    });

    it('renvoie 400 si id_methodo est absent', async () => {
      const res = mockRes();

      await searchByVille({ query: { ville: 'Marseille' } }, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('utilise une chaîne vide si ville est absente', async () => {
      mockProInst.searchByMethodo.mockResolvedValue([mockPro]);

      await searchByVille({ query: { id_methodo: '1' } }, mockRes());

      expect(mockProInst.searchByMethodo).toHaveBeenCalledWith('1', '');
    });
  });

  describe('verify()', () => {
    it('renvoie les informations du médecin si le numéro est valide', async () => {
      mockFindMedecin.mockResolvedValue(mockMedecin);
      const res = mockRes();

      await verify({ body: { identificationNationale: '810000002443' } }, res);

      expect(res.json).toHaveBeenCalledWith({
        identificationNationale: '810000002443',
        nom: 'NAUDILLON',
        prenom: 'YVES',
        profession: 'Médecin',
        specialite: 'Médecine générale',
      });
    });

    it('renvoie 404 si le numéro est inconnu', async () => {
      mockFindMedecin.mockResolvedValue(null);
      const res = mockRes();

      await verify({ body: { identificationNationale: '000000000000' } }, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('renvoie 400 si identificationNationale est absent', async () => {
      const res = mockRes();

      await verify({ body: {} }, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('register()', () => {
    it('crée un profil pro avec adresse et ville', async () => {
      mockFindMedecin.mockResolvedValue(mockMedecin);
      mockProInst.getBy.mockResolvedValue(null);
      mockProInst.create.mockResolvedValue(mockPro);
      const res = mockRes();
      res.status = vi.fn().mockReturnValue(res);

      await register({
        body: {
          identificationNationale: '810000002443',
          id_user: 1,
          nom_cabinet: 'Cabinet Test',
          adresse: '1 rue de la Paix',
          ville: 'Marseille',
          description: 'Médecin généraliste',
          horaire_cabinet: 'Lun-Ven 9h-18h',
        },
      }, res);

      expect(mockProInst.create).toHaveBeenCalledWith(expect.objectContaining({
        id_user: 1,
        nom_cabinet: 'Cabinet Test',
        ville: 'Marseille',
        adresse: '1 rue de la Paix',
      }));
    });

    it('renvoie 409 si le professionnel existe déjà', async () => {
      mockFindMedecin.mockResolvedValue(mockMedecin);
      mockProInst.getBy.mockResolvedValue(mockPro);
      const res = mockRes();

      await register({ body: { identificationNationale: '810000002443', id_user: 1 } }, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(mockProInst.create).not.toHaveBeenCalled();
    });

    it('renvoie 403 si le numéro d\'identification est invalide', async () => {
      mockFindMedecin.mockResolvedValue(null);
      const res = mockRes();

      await register({ body: { identificationNationale: '000000000000', id_user: 1 } }, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('renvoie 400 si les champs requis sont absents', async () => {
      const res = mockRes();

      await register({ body: {} }, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
