import express from 'express';
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
  getAnimalsByLocation,
  getAnimalsBySpecies,
} from '../controllers/animalController';

const router = express.Router();

router.post('/', createAnimal);
router.get('/', getAnimals);
router.get('/location', getAnimalsByLocation);
router.get('/species/:species', getAnimalsBySpecies);
router.get('/:id', getAnimalById);
router.put('/:id', updateAnimal);
router.delete('/:id', deleteAnimal);

export default router;
