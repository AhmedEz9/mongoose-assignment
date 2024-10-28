import express from 'express';
import {
  createSpecies,
  getSpecies,
  getSpeciesById,
  updateSpecies,
  deleteSpecies,
  findSpeciesByArea,
} from '../controllers/speciesController';

const router = express.Router();

router.post('/', createSpecies);
router.get('/', getSpecies);
router.get('/:id', getSpeciesById);
router.put('/:id', updateSpecies);
router.delete('/:id', deleteSpecies);
router.post('/area', findSpeciesByArea);

export default router;
