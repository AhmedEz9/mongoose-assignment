import express from 'express';
import categoryRoutes from './routes/categoryRoutes';
import speciesRoutes from './routes/speciesRoutes';
import animalRoutes from './routes/animalRoutes';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/categories', categoryRoutes);
app.use('/species', speciesRoutes);
app.use('/animals', animalRoutes);

export default app;
