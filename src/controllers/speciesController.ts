// File Location: src/controllers/speciesController.ts

import { Request, Response } from 'express';
import { Species } from '../models/species';

// Create a new species
export const createSpecies = async (req: Request, res: Response) => {
  try {
    const species = new Species(req.body);
    await species.save();
    res.status(201).json(species);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all species
export const getSpecies = async (req: Request, res: Response) => {
  try {
    const speciesList = await Species.find()
      .populate('category', 'category_name')
      .select('-__v');
    res.json(speciesList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a species by ID
export const getSpeciesById = async (req: Request, res: Response) => {
  try {
    const species = await Species.findById(req.params.id)
      .populate('category', 'category_name')
      .select('-__v');
    if (!species) return res.status(404).json({ message: 'Species not found' });
    res.json(species);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a species
export const updateSpecies = async (req: Request, res: Response) => {
  try {
    const species = await Species.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!species) return res.status(404).json({ message: 'Species not found' });
    res.json(species);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a species
export const deleteSpecies = async (req: Request, res: Response) => {
  try {
    const species = await Species.findByIdAndDelete(req.params.id);
    if (!species) return res.status(404).json({ message: 'Species not found' });
    res.json({ message: 'Species deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Find species within an area
export const findSpeciesByArea = async (req: Request, res: Response) => {
  try {
    const { type, coordinates } = req.body;

    // Validate the request body
    if (type !== 'Polygon' || !coordinates || !Array.isArray(coordinates)) {
      return res
        .status(400)
        .json({ error: 'Invalid GeoJSON Polygon provided.' });
    }

    // Build the GeoJSON Polygon
    const polygon = {
      type: 'Polygon',
      coordinates,
    };

    // Log for debugging
    console.log('Searching for species within polygon:', JSON.stringify(polygon));

    // Perform the geospatial query
    const speciesList = await Species.find({
      location: {
        $geoWithin: {
          $geometry: polygon,
        },
      },
    })
      .populate('category', 'category_name')
      .select('-__v');

    res.json(speciesList);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
