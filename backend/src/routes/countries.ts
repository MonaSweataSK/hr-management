import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/countries
router.get('/', async (req: Request, res: Response) => {
  try {
    const countries = await prisma.country.findMany({
      include: {
        _count: {
          select: { employees: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/countries/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const country = await prisma.country.findUnique({
      where: { id },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });

    if (!country) {
      res.status(404).json({ error: 'Country not found' });
      return;
    }

    res.json(country);
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/countries
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, code, currency } = req.body;

    if (!name || !code) {
      res.status(400).json({ error: 'Name and code are required' });
      return;
    }

    // Check if code is unique
    const existing = await prisma.country.findUnique({
      where: { code }
    });

    if (existing) {
      res.status(400).json({ error: 'Country code already exists' });
      return;
    }

    const country = await prisma.country.create({
      data: {
        name,
        code,
        currency: currency || 'USD'
      }
    });

    res.status(201).json(country);
  } catch (error) {
    console.error('Error creating country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/countries/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const { name, code, currency } = req.body;

    // Check if country exists
    const country = await prisma.country.findUnique({
      where: { id }
    });

    if (!country) {
      res.status(404).json({ error: 'Country not found' });
      return;
    }

    // If code is being changed, verify uniqueness
    if (code && code !== country.code) {
      const existing = await prisma.country.findUnique({
        where: { code }
      });
      if (existing) {
        res.status(400).json({ error: 'Country code already exists' });
        return;
      }
    }

    const updated = await prisma.country.update({
      where: { id },
      data: {
        name: name !== undefined ? name : country.name,
        code: code !== undefined ? code : country.code,
        currency: currency !== undefined ? currency : country.currency
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/countries/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    // Check if country exists
    const country = await prisma.country.findUnique({
      where: { id },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });

    if (!country) {
      res.status(404).json({ error: 'Country not found' });
      return;
    }

    if (country._count.employees > 0) {
      res.status(400).json({ error: 'Cannot delete country with active employees' });
      return;
    }

    await prisma.country.delete({
      where: { id }
    });

    res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
