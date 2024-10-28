/* eslint-disable @typescript-eslint/no-loss-of-precision */
import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../src/app';

// Load environment variables from the .env file
dotenv.config();

// Use actual ObjectIds from your MongoDB database
let validAnimalId: string; // Define validAnimalId to be set dynamically
const validSpeciesId = '6512eb8e3a8949abf7d12e24'; // Replace with actual species ObjectId

describe('API Endpoints', () => {
  // Setup: Connect to the database before running any tests
  beforeAll(async () => {
    console.log('Database URL:', process.env.MONGODB_URI); // Debug line to check if the variable is correct
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
  });

  // Teardown: Close the database connection after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test case for GET /animals
  it('should get all animals', async () => {
    const response = await request(app).get('/animals');
    console.log('GET /animals Response:', response.body); // Debugging line
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test case for POST /animals
  it('should create a new animal', async () => {
    const newAnimal = {
      animal_name: 'Test Lion',
      birthdate: '2018-05-20',
      species: validSpeciesId, // Use actual species ObjectId
      location: {
        type: 'Point',
        coordinates: [-118.2437, 34.0522],
      },
    };

    const response = await request(app)
      .post('/animals')
      .send(newAnimal);

    console.log('POST /animals Response:', response.body); // Debugging line
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.animal_name).toBe('Test Lion');

    // Capture the ID of the created animal for use in subsequent tests
    validAnimalId = response.body._id;
  });

  // Test case for GET /animals/:id
  it('should get an animal by ID', async () => {
    const response = await request(app).get(`/animals/${validAnimalId}`);
    console.log(`GET /animals/${validAnimalId} Response:`, response.body); // Debugging line
    if (response.status === 404) {
      console.warn('The created animal could not be found.');
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
  });

  // Test case for DELETE /animals/:id
  it('should delete an animal by ID', async () => {
    const response = await request(app).delete(`/animals/${validAnimalId}`);
    console.log(`DELETE /animals/${validAnimalId} Response:`, response.body); // Debugging line
    if (response.status === 404) {
      console.warn('The created animal could not be deleted because it was not found.');
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Animal deleted');
  });
});
