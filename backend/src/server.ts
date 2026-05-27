import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import employeesRouter from './routes/employees';
import countriesRouter from './routes/countries';
import jobTitlesRouter from './routes/jobTitles';
import insightsRouter from './routes/insights';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/employees', employeesRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/job-titles', jobTitlesRouter);
app.use('/api/insights', insightsRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root path fallback/redirect
app.get('/', (_req, res) => {
  res.send('HR Management API is running. Access API endpoints at /api/...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
