export interface Bill {
  id: number;
  title: string;
  code: string;
  summary: string;
  status: string;
  topic: string;
  progress: number;
  introducedDate: string;
  lastAction: string;
  sponsors: Sponsor[];
  timeline: TimelineEvent[];
  votes: VoteRecord[];
}

export interface Sponsor {
  name: string;
  party: "D" | "R" | "I";
  chamber: string;
  role: "Primary" | "Co-sponsor";
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface VoteRecord {
  chamber: string;
  date: string;
  yea: number;
  nay: number;
  present: number;
  result: "Passed" | "Failed" | "Pending";
}

export const BILLS_DATA: Bill[] = [
  {
    id: 1,
    title: "Clean Energy Investment Act",
    code: "S.1247",
    summary: "Allocates $45 billion in federal funding for renewable energy infrastructure, including solar, wind, and battery storage projects. Establishes tax credits for businesses transitioning to clean energy and creates a Green Jobs Training Fund.",
    status: "In Committee",
    topic: "environment",
    progress: 35,
    introducedDate: "Jan 15, 2026",
    lastAction: "Referred to Senate Committee on Energy and Natural Resources",
    sponsors: [
      { name: "Sen. Maria Chen", party: "D", chamber: "Senate", role: "Primary" },
      { name: "Sen. David Park", party: "D", chamber: "Senate", role: "Co-sponsor" },
      { name: "Rep. Sarah Torres", party: "D", chamber: "House", role: "Co-sponsor" },
      { name: "Sen. Michael Adams", party: "R", chamber: "Senate", role: "Co-sponsor" },
    ],
    timeline: [
      { date: "Jan 15, 2026", title: "Introduced", description: "Bill introduced in the Senate by Sen. Chen", completed: true },
      { date: "Jan 22, 2026", title: "Referred to Committee", description: "Assigned to Senate Committee on Energy and Natural Resources", completed: true },
      { date: "Feb 10, 2026", title: "Committee Hearing", description: "Public hearing held with expert testimony", completed: true },
      { date: "TBD", title: "Committee Vote", description: "Committee markup and vote expected", completed: false },
      { date: "TBD", title: "Floor Vote", description: "Full Senate floor vote", completed: false },
      { date: "TBD", title: "House Consideration", description: "Sent to House for consideration", completed: false },
    ],
    votes: [],
  },
  {
    id: 2,
    title: "Education Funding Reform",
    code: "H.R.3892",
    summary: "Restructures federal education funding to allocate resources based on student need rather than property tax revenue. Increases Title I funding by 30% and creates a new grant program for schools in underserved communities.",
    status: "Floor Vote",
    topic: "education",
    progress: 70,
    introducedDate: "Nov 3, 2025",
    lastAction: "Passed House Committee on Education, scheduled for floor vote",
    sponsors: [
      { name: "Rep. James Walker", party: "R", chamber: "House", role: "Primary" },
      { name: "Rep. Lisa Nguyen", party: "D", chamber: "House", role: "Co-sponsor" },
      { name: "Rep. Robert Garcia", party: "D", chamber: "House", role: "Co-sponsor" },
    ],
    timeline: [
      { date: "Nov 3, 2025", title: "Introduced", description: "Bill introduced in the House by Rep. Walker", completed: true },
      { date: "Nov 15, 2025", title: "Referred to Committee", description: "Assigned to House Committee on Education and the Workforce", completed: true },
      { date: "Dec 8, 2025", title: "Committee Hearing", description: "Hearings with educators and school administrators", completed: true },
      { date: "Jan 20, 2026", title: "Committee Vote", description: "Passed committee 28-19", completed: true },
      { date: "Apr 18, 2026", title: "Floor Vote", description: "Scheduled for House floor vote", completed: false },
      { date: "TBD", title: "Senate Consideration", description: "Sent to Senate if passed", completed: false },
    ],
    votes: [
      { chamber: "House Committee", date: "Jan 20, 2026", yea: 28, nay: 19, present: 2, result: "Passed" },
    ],
  },
  {
    id: 3,
    title: "Digital Privacy Protection Act",
    code: "S.782",
    summary: "Establishes comprehensive federal data privacy standards for technology companies. Requires explicit consent for data collection, grants consumers the right to delete personal data, and creates the Digital Privacy Commission for enforcement.",
    status: "Introduced",
    topic: "technology",
    progress: 15,
    introducedDate: "Mar 1, 2026",
    lastAction: "Introduced in the Senate",
    sponsors: [
      { name: "Sen. David Park", party: "D", chamber: "Senate", role: "Primary" },
      { name: "Sen. Karen Mitchell", party: "R", chamber: "Senate", role: "Co-sponsor" },
    ],
    timeline: [
      { date: "Mar 1, 2026", title: "Introduced", description: "Bill introduced in the Senate by Sen. Park", completed: true },
      { date: "Mar 8, 2026", title: "Referred to Committee", description: "Assigned to Senate Committee on Commerce, Science, and Transportation", completed: false },
      { date: "TBD", title: "Committee Hearing", description: "Awaiting scheduling", completed: false },
      { date: "TBD", title: "Committee Vote", description: "Pending", completed: false },
      { date: "TBD", title: "Floor Vote", description: "Pending", completed: false },
    ],
    votes: [],
  },
  {
    id: 4,
    title: "Affordable Housing Expansion",
    code: "H.R.5120",
    summary: "Invests $28 billion in affordable housing construction and expands rental assistance programs. Includes provisions for first-time homebuyer down payment assistance and incentives for municipalities to reform zoning laws.",
    status: "In Committee",
    topic: "housing",
    progress: 45,
    introducedDate: "Dec 12, 2025",
    lastAction: "Committee hearings concluded, markup scheduled",
    sponsors: [
      { name: "Rep. Lisa Nguyen", party: "D", chamber: "House", role: "Primary" },
      { name: "Rep. James Walker", party: "R", chamber: "House", role: "Co-sponsor" },
      { name: "Sen. Maria Chen", party: "D", chamber: "Senate", role: "Co-sponsor" },
      { name: "Rep. Robert Garcia", party: "D", chamber: "House", role: "Co-sponsor" },
      { name: "Rep. Tom Bradley", party: "R", chamber: "House", role: "Co-sponsor" },
    ],
    timeline: [
      { date: "Dec 12, 2025", title: "Introduced", description: "Bill introduced in the House by Rep. Nguyen", completed: true },
      { date: "Dec 20, 2025", title: "Referred to Committee", description: "Assigned to House Committee on Financial Services", completed: true },
      { date: "Jan 28, 2026", title: "Committee Hearing", description: "Testimony from housing advocates and economists", completed: true },
      { date: "Feb 15, 2026", title: "Additional Hearings", description: "Second round of hearings with state housing officials", completed: true },
      { date: "Apr 22, 2026", title: "Committee Vote", description: "Markup and vote scheduled", completed: false },
      { date: "TBD", title: "Floor Vote", description: "Pending committee approval", completed: false },
    ],
    votes: [],
  },
];
