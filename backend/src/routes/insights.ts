import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/insights/overview
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const totalHeadcount = await prisma.employee.count();
    const activeHeadcount = await prisma.employee.count({
      where: { status: 'ACTIVE' }
    });
    const inactiveHeadcount = await prisma.employee.count({
      where: { status: 'INACTIVE' }
    });

    // Start of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newHiresThisMonth = await prisma.employee.count({
      where: {
        hiredAt: {
          gte: startOfMonth
        }
      }
    });

    // Total monthly payroll grouped by currency for active employees
    const payrollByCurrency = await prisma.employee.groupBy({
      by: ['currency'],
      _sum: {
        salary: true
      },
      _avg: {
        salary: true
      },
      where: {
        status: 'ACTIVE'
      }
    });

    const payrollMetrics = payrollByCurrency.map((item: any) => ({
      currency: item.currency,
      totalPayroll: item._sum.salary ? Number(item._sum.salary) : 0,
      averageSalary: item._avg.salary ? Number(item._avg.salary) : 0
    }));

    res.json({
      headcount: {
        total: totalHeadcount,
        active: activeHeadcount,
        inactive: inactiveHeadcount
      },
      newHiresThisMonth,
      payrollMetrics
    });
  } catch (error) {
    console.error('Error fetching overview insights:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/insights/by-country
router.get('/by-country', async (req: Request, res: Response) => {
  try {
    const countryData = await prisma.country.findMany({
      include: {
        employees: {
          select: {
            salary: true,
            currency: true,
            status: true
          }
        }
      }
    });

    const results = countryData.map((c: any) => {
      const activeEmployees = c.employees.filter((e: any) => e.status === 'ACTIVE');
      const totalPayroll = activeEmployees.reduce((sum: number, e: any) => sum + Number(e.salary), 0);
      const avgSalary = activeEmployees.length > 0 ? totalPayroll / activeEmployees.length : 0;

      return {
        id: c.id,
        name: c.name,
        code: c.code,
        currency: c.currency,
        headcount: c.employees.length,
        activeHeadcount: activeEmployees.length,
        totalPayroll,
        avgSalary
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching insights by country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/insights/by-department
router.get('/by-department', async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        department: true,
        salary: true,
        currency: true,
        status: true
      }
    });

    const deptMap: { [key: string]: {
      department: string;
      headcount: number;
      activeHeadcount: number;
      totalPayroll: number;
    }} = {};

    for (const emp of employees) {
      const deptName = emp.department || 'Unassigned';
      if (!deptMap[deptName]) {
        deptMap[deptName] = {
          department: deptName,
          headcount: 0,
          activeHeadcount: 0,
          totalPayroll: 0
        };
      }

      deptMap[deptName].headcount++;
      if (emp.status === 'ACTIVE') {
        deptMap[deptName].activeHeadcount++;
        deptMap[deptName].totalPayroll += Number(emp.salary);
      }
    }

    const results = Object.values(deptMap).map(d => {
      const avgSalary = d.activeHeadcount > 0 ? d.totalPayroll / d.activeHeadcount : 0;
      return {
        department: d.department,
        headcount: d.headcount,
        activeHeadcount: d.activeHeadcount,
        totalPayroll: d.totalPayroll,
        avgSalary
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching insights by department:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/insights/by-job-title
router.get('/by-job-title', async (req: Request, res: Response) => {
  try {
    const jobTitleData = await prisma.jobTitle.findMany({
      include: {
        employees: {
          select: {
            salary: true,
            status: true
          }
        }
      }
    });

    const results = jobTitleData.map((jt: any) => {
      const activeEmployees = jt.employees.filter((e: any) => e.status === 'ACTIVE');
      const totalPayroll = activeEmployees.reduce((sum: number, e: any) => sum + Number(e.salary), 0);
      const avgSalary = activeEmployees.length > 0 ? totalPayroll / activeEmployees.length : 0;

      return {
        id: jt.id,
        title: jt.title,
        department: jt.department,
        headcount: jt.employees.length,
        activeHeadcount: activeEmployees.length,
        totalPayroll,
        avgSalary
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching insights by job title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/insights/hiring-trends
router.get('/hiring-trends', async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        hiredAt: {
          not: null
        }
      },
      select: {
        hiredAt: true
      }
    });

    // Initialize map with last 12 months to guarantee all months exist in trend
    const trendMap: { [key: string]: number } = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      trendMap[key] = 0;
    }

    // Count hires per month
    for (const emp of employees) {
      if (emp.hiredAt) {
        const date = new Date(emp.hiredAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (trendMap[key] !== undefined) {
          trendMap[key]++;
        }
      }
    }

    const results = Object.entries(trendMap)
      .map(([month, count]) => ({
        month,
        count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(results);
  } catch (error) {
    console.error('Error fetching hiring trends:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
