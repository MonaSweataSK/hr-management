import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/job-titles
router.get('/', async (req: Request, res: Response) => {
  try {
    const jobTitles = await prisma.jobTitle.findMany({
      include: {
        _count: {
          select: { employees: true }
        }
      },
      orderBy: { title: 'asc' }
    });
    res.json(jobTitles);
  } catch (error) {
    console.error('Error fetching job titles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/job-titles/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const jobTitle = await prisma.jobTitle.findUnique({
      where: { id },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });

    if (!jobTitle) {
      res.status(404).json({ error: 'Job title not found' });
      return;
    }

    res.json(jobTitle);
  } catch (error) {
    console.error('Error fetching job title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/job-titles
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, department } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    // Check if title is unique
    const existing = await prisma.jobTitle.findUnique({
      where: { title }
    });

    if (existing) {
      res.status(400).json({ error: 'Job title already exists' });
      return;
    }

    const jobTitle = await prisma.jobTitle.create({
      data: {
        title,
        department: department || null
      }
    });

    res.status(201).json(jobTitle);
  } catch (error) {
    console.error('Error creating job title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/job-titles/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const { title, department } = req.body;

    // Check if job title exists
    const jobTitle = await prisma.jobTitle.findUnique({
      where: { id }
    });

    if (!jobTitle) {
      res.status(404).json({ error: 'Job title not found' });
      return;
    }

    // If title is being changed, verify uniqueness
    if (title && title !== jobTitle.title) {
      const existing = await prisma.jobTitle.findUnique({
        where: { title }
      });
      if (existing) {
        res.status(400).json({ error: 'Job title already exists' });
        return;
      }
    }

    const updated = await prisma.jobTitle.update({
      where: { id },
      data: {
        title: title !== undefined ? title : jobTitle.title,
        department: department !== undefined ? department : jobTitle.department
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating job title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/job-titles/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    // Check if job title exists and get count of employees
    const jobTitle = await prisma.jobTitle.findUnique({
      where: { id },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });

    if (!jobTitle) {
      res.status(404).json({ error: 'Job title not found' });
      return;
    }

    if (jobTitle._count.employees > 0) {
      res.status(400).json({ error: 'Cannot delete job title with active employees' });
      return;
    }

    await prisma.jobTitle.delete({
      where: { id }
    });

    res.json({ message: 'Job title deleted successfully' });
  } catch (error) {
    console.error('Error deleting job title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
