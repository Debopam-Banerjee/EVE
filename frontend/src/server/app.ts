import express from 'express';
import mapsRouter from './routes/maps';

const app = express();

app.use(express.json());
app.use('/api/maps', mapsRouter);

// ... existing code ... 