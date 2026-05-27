import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Helper to generate a unique employee number if not provided
async function generateEmployeeNo(): Promise<string> {
  const lastEmployee = await prisma.employee.findFirst({
    orderBy: { id: 'desc' }
  });
  if (!lastEmployee) {
    return 'EMP-0001';
  }
  const match = lastEmployee.employeeNo.match(/^EMP-(\d+)$/);
  if (match) {
    const nextNum = parseInt(match[1]) + 1;
    return `EMP-${nextNum.toString().padStart(4, '0')}`;
  }
  return `EMP-${(lastEmployee.id + 1).toString().padStart(4, '0')}`;
}

// GET /api/employees
router.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const department = req.query.department as string;
    const countryIdStr = req.query.countryId as string;
    const jobTitleIdStr = req.query.jobTitleId as string;
    const status = req.query.status as string;
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeNo: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (department) {
      where.department = department;
    }

    if (countryIdStr) {
      const countryId = parseInt(countryIdStr);
      if (!isNaN(countryId)) {
        where.countryId = countryId;
      }
    }

    if (jobTitleIdStr) {
      const jobTitleId = parseInt(jobTitleIdStr);
      if (!isNaN(jobTitleId)) {
        where.jobTitleId = jobTitleId;
      }
    }

    if (status) {
      if (status === 'ACTIVE' || status === 'INACTIVE') {
        where.status = status;
      }
    }

    // Execute queries in parallel
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          country: {
            select: { id: true, name: true, code: true }
          },
          jobTitle: {
            select: { id: true, title: true, department: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/employees/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        country: true,
        jobTitle: true
      }
    });

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/employees
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      department,
      salary,
      currency,
      status,
      hiredAt,
      countryId,
      jobTitleId
    } = req.body;

    let employeeNo = req.body.employeeNo;

    // Validate required fields
    if (!fullName || !email || salary === undefined || !countryId || !jobTitleId) {
      res.status(400).json({ error: 'fullName, email, salary, countryId, and jobTitleId are required' });
      return;
    }

    // Verify country exists
    const country = await prisma.country.findUnique({
      where: { id: parseInt(countryId) }
    });
    if (!country) {
      res.status(400).json({ error: 'Specified country does not exist' });
      return;
    }

    // Verify job title exists
    const jobTitle = await prisma.jobTitle.findUnique({
      where: { id: parseInt(jobTitleId) }
    });
    if (!jobTitle) {
      res.status(400).json({ error: 'Specified job title does not exist' });
      return;
    }

    // Check if email already exists
    const existingEmail = await prisma.employee.findUnique({
      where: { email }
    });
    if (existingEmail) {
      res.status(400).json({ error: 'Email is already in use' });
      return;
    }

    // Generate unique employeeNo if not provided
    if (!employeeNo) {
      employeeNo = await generateEmployeeNo();
    } else {
      // Check if employeeNo is unique
      const existingNo = await prisma.employee.findUnique({
        where: { employeeNo }
      });
      if (existingNo) {
        res.status(400).json({ error: 'Employee number already exists' });
        return;
      }
    }

    const employee = await prisma.employee.create({
      data: {
        employeeNo,
        fullName,
        email,
        phone: phone || null,
        department: department || null,
        salary: Number(salary),
        currency: currency || country.currency || 'USD',
        status: status || 'ACTIVE',
        hiredAt: hiredAt ? new Date(hiredAt) : null,
        countryId: parseInt(countryId),
        jobTitleId: parseInt(jobTitleId)
      },
      include: {
        country: true,
        jobTitle: true
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const {
      fullName,
      email,
      phone,
      department,
      salary,
      currency,
      status,
      hiredAt,
      countryId,
      jobTitleId,
      employeeNo
    } = req.body;

    const updateData: any = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (department !== undefined) updateData.department = department;
    if (salary !== undefined) updateData.salary = Number(salary);
    if (currency !== undefined) updateData.currency = currency;
    if (status !== undefined) updateData.status = status;
    if (hiredAt !== undefined) updateData.hiredAt = hiredAt ? new Date(hiredAt) : null;

    if (email !== undefined && email !== employee.email) {
      const existingEmail = await prisma.employee.findUnique({
        where: { email }
      });
      if (existingEmail) {
        res.status(400).json({ error: 'Email is already in use' });
        return;
      }
      updateData.email = email;
    }

    if (employeeNo !== undefined && employeeNo !== employee.employeeNo) {
      const existingNo = await prisma.employee.findUnique({
        where: { employeeNo }
      });
      if (existingNo) {
        res.status(400).json({ error: 'Employee number already exists' });
        return;
      }
      updateData.employeeNo = employeeNo;
    }

    if (countryId !== undefined) {
      const country = await prisma.country.findUnique({
        where: { id: parseInt(countryId) }
      });
      if (!country) {
        res.status(400).json({ error: 'Specified country does not exist' });
        return;
      }
      updateData.countryId = parseInt(countryId);
    }

    if (jobTitleId !== undefined) {
      const jobTitle = await prisma.jobTitle.findUnique({
        where: { id: parseInt(jobTitleId) }
      });
      if (!jobTitle) {
        res.status(400).json({ error: 'Specified job title does not exist' });
        return;
      }
      updateData.jobTitleId = parseInt(jobTitleId);
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        country: true,
        jobTitle: true
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const employee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    await prisma.employee.delete({
      where: { id }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
