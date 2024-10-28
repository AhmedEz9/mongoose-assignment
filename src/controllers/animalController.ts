import { Request, Response } from 'express';
import { Animal } from '../models/animal';
import { Species } from '../models/species';

// Create a new animal
export const createAnimal = async (req: Request, res: Response) => {
  try {
    const animal = new Animal(req.body);
    await animal.save();
    res.status(201).json(animal);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all animals
export const getAnimals = async (req: Request, res: Response) => {
  try {
    const animals = await Animal.find()
      .populate({
        path: 'species',
        populate: { path: 'category' },
      })
      .select('-__v');
    res.json(animals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get an animal by ID
export const getAnimalById = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate({
        path: 'species',
        populate: { path: 'category' },
      })
      .select('-__v');
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json(animal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update an animal
export const updateAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json(animal);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an animal
export const deleteAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json({ message: 'Animal deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get animals by location
export const getAnimalsByLocation = async (req: Request, res: Response) => {
  try {
    const topRight = req.query.topRight as string;
    const bottomLeft = req.query.bottomLeft as string;

    if (!topRight || !bottomLeft) {
      return res.status(400).json({ message: 'topRight and bottomLeft query parameters are required' });
    }

    const [trLat, trLon] = topRight.split(',').map(Number);
    const [blLat, blLon] = bottomLeft.split(',').map(Number);

    const animals = await Animal.find({
      location: {
        $geoWithin: {
          $box: [
            [blLon, blLat],
            [trLon, trLat],
          ],
        },
      },
    })
      .populate({
        path: 'species',
        populate: { path: 'category' },
      })
      .select('-__v');

    res.json(animals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get animals by species name
export const getAnimalsBySpecies = async (req: Request, res: Response) => {
  try {
    const speciesName = req.params.species;

    const species = await Species.findOne({ species_name: speciesName });
    if (!species) return res.status(404).json({ message: 'Species not found' });

    const animals = await Animal.find({ species: species._id })
      .populate({
        path: 'species',
        populate: { path: 'category' },
      })
      .select('-__v');

    res.json(animals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
