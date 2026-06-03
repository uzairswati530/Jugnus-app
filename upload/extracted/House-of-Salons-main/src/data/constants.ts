export type AppointmentStatus = 'Confirmed' | 'In Progress' | 'Done';
export type WalkInStatus = 'Waiting' | 'In Progress' | 'Done';

export interface Appointment {
  id: string;
  time: string;
  customerName: string;
  service: string;
  stylist: string;
  status: AppointmentStatus;
}

export interface WalkIn {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  stylist: string;
  estimatedWait: number;
  status: WalkInStatus;
}

export interface Branch {
  id: string;
  name: string;
  phone: string;
  activeQueue: number;
  todayBookings: number;
  revenue: { today: number; week: number; month: number };
  stylists: { name: string; busy: boolean }[];
}

export interface Service {
  name: string;
  price: number;
  duration: number;
  gender: 'female' | 'male' | 'both';
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  branches: string[];
  bookedSlots: string[];
}

export const BRANCHES: Branch[] = [
  {
    id: 'f10',
    name: 'F10 Markaz, Islamabad',
    phone: '0325-1006659',
    activeQueue: 4,
    todayBookings: 12,
    revenue: { today: 45200, week: 312000, month: 1240000 },
    stylists: [
      { name: 'Ayesha Khan', busy: true },
      { name: 'Sara Ahmed', busy: true },
      { name: 'Nadia Malik', busy: false },
      { name: 'Usman Ali', busy: true },
      { name: 'Bilal Sheikh', busy: false },
    ],
  },
  {
    id: 'bahria-male',
    name: 'Bahria Town Phase 7 (Male)',
    phone: '0300-0395761',
    activeQueue: 2,
    todayBookings: 8,
    revenue: { today: 28600, week: 198000, month: 780000 },
    stylists: [
      { name: 'Usman Ali', busy: true },
      { name: 'Bilal Sheikh', busy: false },
      { name: 'Ahmed Raza', busy: true },
      { name: 'Kamran Shah', busy: false },
      { name: 'Hassan Mir', busy: false },
    ],
  },
  {
    id: 'bahria-ladies',
    name: 'Bahria Town Phase 7 (Ladies)',
    phone: '0300-0477607',
    activeQueue: 5,
    todayBookings: 15,
    revenue: { today: 52800, week: 378000, month: 1560000 },
    stylists: [
      { name: 'Ayesha Khan', busy: true },
      { name: 'Sara Ahmed', busy: true },
      { name: 'Nadia Malik', busy: true },
      { name: 'Zara Hussain', busy: true },
      { name: 'Maria Qureshi', busy: false },
    ],
  },
];

export const FEMALE_SERVICES: Service[] = [
  { name: 'Haircut with Blow Dry', price: 4000, duration: 45, gender: 'female' },
  { name: 'Wash & Blow Dry', price: 2000, duration: 30, gender: 'female' },
  { name: 'Bridal Makeup', price: 40000, duration: 180, gender: 'female' },
  { name: 'Party Makeup', price: 8000, duration: 90, gender: 'female' },
  { name: 'Acrylic Nails', price: 12000, duration: 60, gender: 'female' },
  { name: 'Facial (Basic)', price: 3500, duration: 60, gender: 'female' },
  { name: 'Hair Color (Global)', price: 8000, duration: 120, gender: 'female' },
];

export const MALE_SERVICES: Service[] = [
  { name: 'Haircut', price: 1200, duration: 30, gender: 'male' },
  { name: 'Beard Trim', price: 600, duration: 15, gender: 'male' },
  { name: 'Haircut + Beard', price: 1700, duration: 45, gender: 'male' },
  { name: 'Hair Color', price: 3500, duration: 60, gender: 'male' },
  { name: 'Facial', price: 2500, duration: 60, gender: 'male' },
  { name: 'Head Massage', price: 1500, duration: 30, gender: 'male' },
];

export const STYLISTS: Stylist[] = [
  {
    id: 'ayesha',
    name: 'Ayesha Khan',
    specialty: 'Bridal & Makeup',
    branches: ['f10', 'bahria-ladies'],
    bookedSlots: ['11:00', '12:30', '14:00', '16:00', '18:30'],
  },
  {
    id: 'sara',
    name: 'Sara Ahmed',
    specialty: 'Hair Color & Highlights',
    branches: ['f10', 'bahria-ladies'],
    bookedSlots: ['11:30', '13:00', '15:30', '17:00', '19:30'],
  },
  {
    id: 'nadia',
    name: 'Nadia Malik',
    specialty: 'Nail Art',
    branches: ['f10', 'bahria-ladies'],
    bookedSlots: ['12:00', '14:30', '16:30', '20:00'],
  },
  {
    id: 'usman',
    name: 'Usman Ali',
    specialty: 'Haircut & Beard',
    branches: ['f10', 'bahria-male'],
    bookedSlots: ['11:00', '12:00', '13:30', '15:00', '17:30', '19:00'],
  },
  {
    id: 'bilal',
    name: 'Bilal Sheikh',
    specialty: 'Hair Treatment',
    branches: ['f10', 'bahria-male'],
    bookedSlots: ['11:30', '14:00', '16:00', '18:00', '20:30'],
  },
];

export const TODAY_APPOINTMENTS: Appointment[] = [
  { id: 'a1', time: '10:00 AM', customerName: 'Fatima Zaidi', service: 'Bridal Makeup', stylist: 'Ayesha Khan', status: 'Done' },
  { id: 'a2', time: '11:30 AM', customerName: 'Sana Riaz', service: 'Haircut with Blow Dry', stylist: 'Sara Ahmed', status: 'Done' },
  { id: 'a3', time: '12:00 PM', customerName: 'Ali Hassan', service: 'Haircut + Beard', stylist: 'Usman Ali', status: 'In Progress' },
  { id: 'a4', time: '01:00 PM', customerName: 'Zara Butt', service: 'Acrylic Nails', stylist: 'Nadia Malik', status: 'In Progress' },
  { id: 'a5', time: '02:30 PM', customerName: 'Kamran Iqbal', service: 'Hair Color', stylist: 'Bilal Sheikh', status: 'Confirmed' },
  { id: 'a6', time: '03:30 PM', customerName: 'Hina Mirza', service: 'Party Makeup', stylist: 'Ayesha Khan', status: 'Confirmed' },
];

export const WALKIN_QUEUE: WalkIn[] = [
  { id: 'w1', customerName: 'Raza Shah', phone: '0311-2345678', service: 'Haircut', stylist: 'Usman Ali', estimatedWait: 15, status: 'In Progress' },
  { id: 'w2', customerName: 'Saima Akhtar', phone: '0321-9876543', service: 'Wash & Blow Dry', stylist: 'Sara Ahmed', estimatedWait: 30, status: 'Waiting' },
  { id: 'w3', customerName: 'Tariq Mehmood', phone: '0333-1122334', service: 'Beard Trim', stylist: 'Bilal Sheikh', estimatedWait: 45, status: 'Waiting' },
  { id: 'w4', customerName: 'Noor Fatima', phone: '0345-5566778', service: 'Facial (Basic)', stylist: 'Nadia Malik', estimatedWait: 60, status: 'Waiting' },
];

export const LOYALTY_HISTORY = [
  { date: '28 May 2026', service: 'Bridal Makeup', amount: 40000, points: 40000 },
  { date: '15 May 2026', service: 'Party Makeup', amount: 8000, points: 8000 },
  { date: '02 May 2026', service: 'Haircut with Blow Dry', amount: 4000, points: 4000 },
  { date: '18 Apr 2026', service: 'Hair Color (Global)', amount: 8000, points: 8000 },
  { date: '03 Apr 2026', service: 'Acrylic Nails', amount: 12000, points: 12000 },
];

export const LOYALTY_STATS = {
  totalMembers: 847,
  newThisMonth: 63,
  pointsIssued: 124500,
  pointsRedeemed: 38200,
  tierBreakdown: { Bronze: 612, Silver: 189, Gold: 46 },
};

export const RECENT_REDEMPTIONS = [
  { customerName: 'Fatima Zaidi', branch: 'Bahria Ladies', pointsUsed: 5000, discountGiven: 500, date: '02 Jun 2026' },
  { customerName: 'Sana Riaz', branch: 'F10 Markaz', pointsUsed: 3500, discountGiven: 350, date: '01 Jun 2026' },
  { customerName: 'Hina Khan', branch: 'Bahria Ladies', pointsUsed: 2000, discountGiven: 200, date: '31 May 2026' },
  { customerName: 'Zara Butt', branch: 'F10 Markaz', pointsUsed: 4500, discountGiven: 450, date: '30 May 2026' },
  { customerName: 'Noor Fatima', branch: 'Bahria Male', pointsUsed: 1500, discountGiven: 150, date: '29 May 2026' },
];

export const TOP_SERVICES_MONTH = [
  { service: 'Bridal Makeup', revenue: 320000, count: 8 },
  { service: 'Haircut with Blow Dry', revenue: 168000, count: 42 },
  { service: 'Hair Color (Global)', revenue: 144000, count: 18 },
  { service: 'Party Makeup', revenue: 112000, count: 14 },
  { service: 'Acrylic Nails', revenue: 108000, count: 9 },
];

export const HOURS_HEATMAP = {
  '11:00 AM': 2,
  '11:30 AM': 2,
  '12:00 PM': 5,
  '12:30 PM': 6,
  '01:00 PM': 7,
  '01:30 PM': 8,
  '02:00 PM': 9,
  '02:30 PM': 10,
  '03:00 PM': 9,
  '03:30 PM': 8,
  '04:00 PM': 7,
  '04:30 PM': 6,
  '05:00 PM': 5,
  '05:30 PM': 4,
  '06:00 PM': 8,
  '06:30 PM': 9,
  '07:00 PM': 7,
  '07:30 PM': 6,
  '08:00 PM': 5,
  '08:30 PM': 3,
  '09:00 PM': 2,
  '09:30 PM': 1,
  '10:00 PM': 1,
};

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Hair' | 'Nails' | 'Makeup' | 'Skin' | 'Massage' | 'Other';
  duration: number;
  price: number;
  gender: 'Female' | 'Male' | 'Both';
  branches: string[];
  status: 'Active' | 'Inactive';
}

export interface StaffMember {
  id: string;
  name: string;
  branch: string;
  specialty: string;
  phone: string;
  status: 'Active' | 'Inactive';
  bookingsThisMonth: number;
  revenueThisMonth: number;
  avgRating: number;
}

export const SERVICES_DATABASE: ServiceItem[] = [
  { id: 's1', name: 'Bridal Makeup', category: 'Makeup', duration: 120, price: 40000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's2', name: 'Party Makeup', category: 'Makeup', duration: 60, price: 8000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's3', name: 'Haircut with Blow Dry', category: 'Hair', duration: 45, price: 4000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's4', name: 'Wash & Blow Dry', category: 'Hair', duration: 30, price: 2000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's5', name: 'Hair Color (Global)', category: 'Hair', duration: 90, price: 8000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's6', name: 'Hair Color (Roots)', category: 'Hair', duration: 60, price: 4000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's7', name: 'Acrylic Nails', category: 'Nails', duration: 60, price: 6000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's8', name: 'Gel Nails', category: 'Nails', duration: 45, price: 4000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's9', name: 'Facial (Basic)', category: 'Skin', duration: 45, price: 2500, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's10', name: 'Facial', category: 'Skin', duration: 60, price: 4000, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's11', name: 'Threading', category: 'Hair', duration: 20, price: 300, gender: 'Female', branches: ['f10', 'bahria-ladies'], status: 'Active' },
  { id: 's12', name: 'Haircut', category: 'Hair', duration: 20, price: 1200, gender: 'Male', branches: ['f10', 'bahria-male'], status: 'Active' },
  { id: 's13', name: 'Beard Trim', category: 'Hair', duration: 15, price: 600, gender: 'Male', branches: ['f10', 'bahria-male'], status: 'Active' },
  { id: 's14', name: 'Haircut + Beard', category: 'Hair', duration: 30, price: 1700, gender: 'Male', branches: ['f10', 'bahria-male'], status: 'Active' },
  { id: 's15', name: 'Hair Treatment', category: 'Hair', duration: 45, price: 2250, gender: 'Male', branches: ['f10', 'bahria-male'], status: 'Active' },
  { id: 's16', name: 'Hair Color', category: 'Hair', duration: 60, price: 3500, gender: 'Male', branches: ['f10', 'bahria-male'], status: 'Inactive' },
  { id: 's17', name: 'Facial', category: 'Skin', duration: 60, price: 2500, gender: 'Male', branches: ['f10', 'bahria-male'], status: 'Active' },
  { id: 's18', name: 'Head Massage', category: 'Massage', duration: 30, price: 1500, gender: 'Male', branches: ['f10', 'bahria-male'], status: 'Active' },
];

export const STAFF_DATABASE: StaffMember[] = [
  { id: 'st1', name: 'Ayesha Khan', branch: 'F10 Markaz', specialty: 'Bridal & Makeup', phone: '0300-1111111', status: 'Active', bookingsThisMonth: 24, revenueThisMonth: 208000, avgRating: 4.9 },
  { id: 'st2', name: 'Sara Ahmed', branch: 'F10 Markaz', specialty: 'Hair Color & Highlights', phone: '0300-2222222', status: 'Active', bookingsThisMonth: 18, revenueThisMonth: 126000, avgRating: 4.8 },
  { id: 'st3', name: 'Nadia Malik', branch: 'F10 Markaz', specialty: 'Nail Art', phone: '0300-3333333', status: 'Active', bookingsThisMonth: 32, revenueThisMonth: 96000, avgRating: 4.7 },
  { id: 'st4', name: 'Usman Ali', branch: 'F10 Male', specialty: 'Haircut & Beard', phone: '0300-4444444', status: 'Active', bookingsThisMonth: 28, revenueThisMonth: 41200, avgRating: 4.6 },
  { id: 'st5', name: 'Bilal Sheikh', branch: 'F10 Male', specialty: 'Hair Treatment', phone: '0300-5555555', status: 'Active', bookingsThisMonth: 12, revenueThisMonth: 18000, avgRating: 4.5 },
  { id: 'st6', name: 'Ahmed Raza', branch: 'Bahria Male', specialty: 'Haircut & Styling', phone: '0300-6666666', status: 'Active', bookingsThisMonth: 22, revenueThisMonth: 31200, avgRating: 4.7 },
  { id: 'st7', name: 'Kamran Shah', branch: 'Bahria Male', specialty: 'Beard Specialist', phone: '0300-7777777', status: 'Inactive', bookingsThisMonth: 8, revenueThisMonth: 2400, avgRating: 4.3 },
  { id: 'st8', name: 'Zara Hussain', branch: 'Bahria Ladies', specialty: 'Makeup Artist', phone: '0300-8888888', status: 'Active', bookingsThisMonth: 16, revenueThisMonth: 96000, avgRating: 4.9 },
  { id: 'st9', name: 'Maria Qureshi', branch: 'Bahria Ladies', specialty: 'Hair Specialist', phone: '0300-9999999', status: 'Active', bookingsThisMonth: 14, revenueThisMonth: 42000, avgRating: 4.8 },
];


export const ALL_STYLISTS_STATUS: StylistStatus[] = [
  { id: 'ayesha', name: 'Ayesha Khan', branch: 'F10 & Bahria Ladies', specialty: 'Bridal & Makeup', status: 'With Client', bookingsToday: 4, revenueToday: 52000 },
  { id: 'sara', name: 'Sara Ahmed', branch: 'F10 & Bahria Ladies', specialty: 'Hair Color & Highlights', status: 'With Client', bookingsToday: 5, revenueToday: 28000 },
  { id: 'nadia', name: 'Nadia Malik', branch: 'F10 & Bahria Ladies', specialty: 'Nail Art', status: 'Available', bookingsToday: 3, revenueToday: 18000 },
  { id: 'usman', name: 'Usman Ali', branch: 'F10 & Bahria Male', specialty: 'Haircut & Beard', status: 'With Client', bookingsToday: 6, revenueToday: 8200 },
  { id: 'bilal', name: 'Bilal Sheikh', branch: 'F10 & Bahria Male', specialty: 'Hair Treatment', status: 'Available', bookingsToday: 2, revenueToday: 4500 },
  { id: 'ahmed', name: 'Ahmed Raza', branch: 'Bahria Male', specialty: 'Haircut & Styling', status: 'With Client', bookingsToday: 4, revenueToday: 6200 },
  { id: 'kamran', name: 'Kamran Shah', branch: 'Bahria Male', specialty: 'Beard Specialist', status: 'Available', bookingsToday: 1, revenueToday: 600 },
  { id: 'hassan', name: 'Hassan Mir', branch: 'Bahria Male', specialty: 'Head Massage', status: 'Off Today', bookingsToday: 0, revenueToday: 0 },
  { id: 'zara', name: 'Zara Hussain', branch: 'Bahria Ladies', specialty: 'Makeup Artist', status: 'With Client', bookingsToday: 3, revenueToday: 24000 },
  { id: 'maria', name: 'Maria Qureshi', branch: 'Bahria Ladies', specialty: 'Hair Specialist', status: 'Available', bookingsToday: 2, revenueToday: 6000 },
];

export const BRANCH_SERVICES_TODAY = (branchId: string) => {
  const services: Record<string, { name: string; count: number; revenue: number }[]> = {
    'f10': [
      { name: 'Haircut with Blow Dry', count: 8, revenue: 32000 },
      { name: 'Party Makeup', count: 4, revenue: 32000 },
      { name: 'Acrylic Nails', count: 3, revenue: 18000 },
    ],
    'bahria-male': [
      { name: 'Haircut', count: 10, revenue: 12000 },
      { name: 'Haircut + Beard', count: 6, revenue: 10200 },
      { name: 'Beard Trim', count: 8, revenue: 4800 },
    ],
    'bahria-ladies': [
      { name: 'Bridal Makeup', count: 2, revenue: 80000 },
      { name: 'Wash & Blow Dry', count: 6, revenue: 12000 },
      { name: 'Hair Color (Global)', count: 4, revenue: 32000 },
    ],
  };
  return services[branchId] || [];
};

export function formatPKR(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK')}`;
}

export function generateRedemptionCode(): string {
  const num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `HOS-${num}`;
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 11; hour <= 21; hour++) {
    const h = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    slots.push(`${h}:00 ${ampm}`);
    if (hour < 22) slots.push(`${h}:30 ${ampm}`);
  }
  slots.push('10:00 PM');
  return slots;
}
