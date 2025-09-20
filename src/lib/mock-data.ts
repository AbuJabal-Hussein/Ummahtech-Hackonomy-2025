import type { Transaction } from "@/app/dashboard/borrower/actions";

export type Business = {
  id: string; // This is the FundRequest ID
  businessId: string;
  name: string;
  category: string;
  description: string;
  location: string;
  imageUrl: string;
  imageHint: string;
  fundingGoal: number;
  fundingRaised: number;
  loansRaised: number;
  donationsRaised: number;
  repaymentHistory: Transaction[];
  updates: { date: string; text: string; imageUrl?: string }[];
  owner: { id: string; name: string; avatarUrl: string };
};

export const businesses: Business[] = [
  {
    id: "1",
    businessId: "biz1",
    name: "Amina's Artisanal Coffee",
    category: "Food & Beverage",
    description: "A mobile coffee cart bringing specialty coffee to the local community. Focused on ethically sourced beans and homemade pastries.",
    location: "City Park, Downtown",
    imageUrl: "https://picsum.photos/seed/amina-coffee/800/600",
    imageHint: "coffee shop",
    fundingGoal: 1200,
    fundingRaised: 1200,
    loansRaised: 1000,
    donationsRaised: 200,
    repaymentHistory: [],
    updates: [{ date: "2023-10-15", text: "We're officially open! Come visit us at the park." }],
    owner: { id: "owner1", name: "Amina Yusuf", avatarUrl: "https://picsum.photos/seed/amina-avatar/100/100" },
  },
  {
    id: "2",
    businessId: "biz2",
    name: "Yusuf's Eid Bakery",
    category: "Crafts & Goods",
    description: "A home-based bakery specializing in traditional sweets and pastries for Eid and other celebrations. Funding needed for a new oven.",
    location: "Greenwood Neighborhood",
    imageUrl: "https://picsum.photos/seed/yusuf-bakery/800/600",
    imageHint: "bakery goods",
    fundingGoal: 800,
    fundingRaised: 550,
    loansRaised: 550,
    donationsRaised: 0,
    repaymentHistory: [],
    updates: [{ date: "2024-03-01", text: "So grateful for the support! We've started ordering ingredients." }],
    owner: { id: "owner2", name: "Yusuf Khan", avatarUrl: "https://picsum.photos/seed/yusuf-avatar/100/100" },
  },
  {
    id: "3",
    businessId: "biz3",
    name: "Farida's Bike Repair",
    category: "Services",
    description: "A community bike repair stand to help neighbors with basic maintenance, promoting sustainable transport and a healthy lifestyle.",
    location: "Riverfront Path",
    imageUrl: "https://picsum.photos/seed/farida-bike/800/600",
    imageHint: "bicycle repair",
    fundingGoal: 500,
    fundingRaised: 250,
    loansRaised: 150,
    donationsRaised: 100,
    repaymentHistory: [],
    updates: [],
    owner: { id: "owner3", name: "Farida Ahmed", avatarUrl: "https://picsum.photos/seed/farida-avatar/100/100" },
  },
  {
    id: "4",
    businessId: "biz4",
    name: "Layla's Local Weaving",
    category: "Arts & Culture",
    description: "Preserving traditional weaving techniques by creating beautiful, handwoven textiles. Seeking funds for high-quality, sustainable yarn.",
    location: "Oakwood Community Center",
    imageUrl: "https://picsum.photos/seed/layla-weaving/800/600",
    imageHint: "weaving loom",
    fundingGoal: 950,
    fundingRaised: 100,
    loansRaised: 0,
    donationsRaised: 100,
    repaymentHistory: [],
    updates: [{ date: "2024-03-10", text: "Excited to start our new collection once we are funded!" }],
    owner: { id: "owner4", name: "Layla Ibrahim", avatarUrl: "https://picsum.photos/seed/layla-avatar/100/100" },
  },
];

export const communityGoals = {
  title: "Launch 5 Businesses This Month!",
  progress: 3,
  target: 5,
  description: "Our collective goal is to help at least five new entrepreneurs get their projects off the ground in the next 30 days. Every contribution, big or small, gets us closer.",
  contributors: [
    { name: "Samira A.", avatarUrl: "https://picsum.photos/seed/c1/100/100", contribution: 150 },
    { name: "David L.", avatarUrl: "https://picsum.photos/seed/c2/100/100", contribution: 75 },
    { name: "Maria G.", avatarUrl: "https://picsum.photos/seed/c3/100/100", contribution: 200 },
    { name: "Chen W.", avatarUrl: "https://picsum.photos/seed/c4/100/100", contribution: 50 },
  ],
  recentActivities: [
    "Samira A. contributed $150 to Yusuf's Eid Bakery.",
    "A new project, Layla's Local Weaving, was just added!",
    "Farida's Bike Repair reached 50% of its funding goal.",
    "David L. made a donation of $75 to the community fund."
  ]
};

export const adminData = {
  users: [
    { id: 'u1', name: 'Amina Yusuf', status: 'Verified', flagged: false },
    { id: 'u2', name: 'Yusuf Khan', status: 'Verified', flagged: false },
    { id: 'u3', name: 'Samira A.', status: 'Verified', flagged: false },
    { id: 'u4', name: 'John Doe', status: 'Pending Verification', flagged: true, reason: 'ID mismatch' },
  ],
  businesses: [
    { id: 'b1', name: "Amina's Artisanal Coffee", owner: 'Amina Yusuf', status: 'Approved', flagged: false },
    { id: 'b2', name: "Yusuf's Eid Bakery", owner: 'Yusuf Khan', status: 'Approved', flagged: false },
    { id: 'b3', name: "Suspicious Gadgets", owner: 'John Doe', status: 'Pending Approval', flagged: true, reason: 'Vague description' },
  ],
  fundingRequests: [
    { id: 'fr1', business: "Amina's Artisanal Coffee", amount: 1200, status: 'Funded', flagged: false },
    { id: 'fr2', business: "Yusuf's Eid Bakery", amount: 800, status: 'In Progress', flagged: false },
    { id: 'fr3', business: "Suspicious Gadgets", amount: 5000, status: 'Pending', flagged: true, reason: 'Unusually high amount for category' },
  ]
};
