import { PrismaClient, Prisma } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Simple random phone generator (no external faker lib needed)
function randomPhone(): string {
  const part = () => Math.floor(100 + Math.random() * 900).toString();
  const last = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `+1-${part()}-${part()}-${last()}`;
}

// Initialize Prisma client with the PrismaPg adapter (required by Prisma v7)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Helper arrays for random data
const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah', 'David', 'Laura', 'Robert', 'Olivia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Lee'];
const indianFirstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Ananya', 'Diya', 'Ishaan', 'Aanya', 'Rahul', 'Neha', 'Priya', 'Amit', 'Sanjay', 'Vikram', 'Anjali', 'Karan', 'Sneha', 'Rohan', 'Divya'];
const indianLastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Nair', 'Gupta', 'Joshi', 'Rao', 'Choudhury', 'Mehta', 'Gill', 'Sen', 'Das', 'Mishra', 'Prasad', 'Pillai', 'Bose', 'Deshmukh'];
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Support'];

async function main() {
  console.log('🟢 Starting seed...');

  // ---- 1️⃣ Ensure a few reference rows exist (countries, job titles) ----
  const countriesData = [
    { name: 'United States', code: 'US', currency: 'USD' },
    { name: 'India', code: 'IN', currency: 'INR' },
    { name: 'Germany', code: 'DE', currency: 'EUR' },
    { name: 'Brazil', code: 'BR', currency: 'BRL' },
    { name: 'Japan', code: 'JP', currency: 'JPY' },
  ];

  await prisma.country.createMany({ data: countriesData, skipDuplicates: true });

  const jobTitlesData = [
    { title: 'Software Engineer', department: 'Engineering' },
    { title: 'Product Manager', department: 'Product' },
    { title: 'Sales Representative', department: 'Sales' },
    { title: 'HR Specialist', department: 'HR' },
    { title: 'Finance Analyst', department: 'Finance' },
  ];
  await prisma.jobTitle.createMany({ data: jobTitlesData, skipDuplicates: true });

  // Fetch IDs for random assignment
  const countries = await prisma.country.findMany({ select: { id: true, code: true } });
  const countryIds = countries.map(c => c.id);
  const indiaCountry = countries.find(c => c.code === 'IN');
  const indiaCountryId = indiaCountry ? indiaCountry.id : null;
  const jobTitleIds = (await prisma.jobTitle.findMany({ select: { id: true } })).map(j => j.id);

  // ---- 2️⃣ Build 10,000 employee objects (using createMany for bulk insert) ----
  const EMP_COUNT = 10_000;
  const employees: Prisma.EmployeeCreateManyInput[] = [];

  for (let i = 1; i <= EMP_COUNT; i++) {
    const countryId = countryIds[Math.floor(Math.random() * countryIds.length)];
    const isIndian = countryId === indiaCountryId;

    const fnList = isIndian ? indianFirstNames : firstNames;
    const lnList = isIndian ? indianLastNames : lastNames;

    const fn = fnList[Math.floor(Math.random() * fnList.length)];
    const ln = lnList[Math.floor(Math.random() * lnList.length)];
    const fullName = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`;
    const phone = randomPhone();
    const department = departments[Math.floor(Math.random() * departments.length)];
    const salary = (Math.random() * 90000 + 30000).toFixed(2); // 30k‑120k
    const jobTitleId = jobTitleIds[Math.floor(Math.random() * jobTitleIds.length)];

    employees.push({
      employeeNo: `EMP-${String(i).padStart(5, '0')}`,
      fullName,
      email,
      phone,
      department,
      salary,
      // currency defaults to USD via schema default
      // status defaults to ACTIVE via schema default
      // hiredAt left null (optional)
      countryId,
      jobTitleId,
    });
  }

  console.log('🚀 Inserting 10,000 employee rows...');
  await prisma.employee.createMany({ data: employees, skipDuplicates: true });

  console.log('✅ Seed completed!');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
