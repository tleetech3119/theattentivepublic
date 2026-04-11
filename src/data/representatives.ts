export interface Representative {
  id: string;
  name: string;
  party: "D" | "R" | "I";
  chamber: "Senate" | "House";
  state: string;
  district?: string;
  photo?: string;
  rating: string;
  bio: string;
  termStart: string;
  termEnd: string;
  contact: {
    phone: string;
    email: string;
    office: string;
    website: string;
    twitter?: string;
  };
  issueScores: IssueScore[];
  votingHistory: RepVote[];
  committees: string[];
}

export interface IssueScore {
  issue: string;
  score: number; // 0-100
  trend: "up" | "down" | "stable";
}

export interface RepVote {
  billCode: string;
  billTitle: string;
  date: string;
  vote: "Yea" | "Nay" | "Present" | "Not Voting";
  billTopic: string;
}

export const REPS_DATA: Representative[] = [
  {
    id: "sen-chen",
    name: "Sen. Maria Chen",
    party: "D",
    chamber: "Senate",
    state: "California",
    rating: "A-",
    bio: "Senator Maria Chen has served California since 2020. She chairs the Committee on Energy and Natural Resources and is a leading voice on climate policy and clean energy investment.",
    termStart: "Jan 2021",
    termEnd: "Jan 2027",
    contact: {
      phone: "(202) 555-0142",
      email: "senator@chen.senate.gov",
      office: "324 Hart Senate Office Building, Washington, DC 20510",
      website: "https://chen.senate.gov",
      twitter: "@SenChen",
    },
    issueScores: [
      { issue: "environment", score: 92, trend: "up" },
      { issue: "healthcare", score: 85, trend: "stable" },
      { issue: "education", score: 78, trend: "up" },
      { issue: "economy", score: 72, trend: "stable" },
      { issue: "technology", score: 88, trend: "up" },
      { issue: "housing", score: 80, trend: "down" },
    ],
    votingHistory: [
      { billCode: "S.1247", billTitle: "Clean Energy Investment Act", date: "Jan 15, 2026", vote: "Yea", billTopic: "environment" },
      { billCode: "S.782", billTitle: "Digital Privacy Protection Act", date: "Mar 1, 2026", vote: "Yea", billTopic: "technology" },
      { billCode: "S.934", billTitle: "Medicare Expansion Act", date: "Feb 12, 2026", vote: "Yea", billTopic: "healthcare" },
      { billCode: "S.1501", billTitle: "Defense Spending Adjustment", date: "Dec 5, 2025", vote: "Nay", billTopic: "defense" },
      { billCode: "S.445", billTitle: "Tax Reform Simplification", date: "Nov 18, 2025", vote: "Nay", billTopic: "taxes" },
      { billCode: "H.R.5120", billTitle: "Affordable Housing Expansion", date: "Dec 12, 2025", vote: "Yea", billTopic: "housing" },
    ],
    committees: [
      "Committee on Energy and Natural Resources (Chair)",
      "Committee on Commerce, Science, and Transportation",
      "Committee on Environment and Public Works",
    ],
  },
  {
    id: "rep-walker",
    name: "Rep. James Walker",
    party: "R",
    chamber: "House",
    state: "Texas",
    district: "TX-12",
    rating: "B+",
    bio: "Representative James Walker represents Texas's 12th congressional district. Known for bipartisan work on education reform and fiscal responsibility, he serves on the Education and Workforce Committee.",
    termStart: "Jan 2019",
    termEnd: "Jan 2027",
    contact: {
      phone: "(202) 555-0198",
      email: "rep.walker@house.gov",
      office: "1127 Longworth House Office Building, Washington, DC 20515",
      website: "https://walker.house.gov",
      twitter: "@RepWalker",
    },
    issueScores: [
      { issue: "education", score: 88, trend: "up" },
      { issue: "economy", score: 82, trend: "stable" },
      { issue: "taxes", score: 90, trend: "up" },
      { issue: "housing", score: 65, trend: "up" },
      { issue: "environment", score: 42, trend: "down" },
      { issue: "healthcare", score: 55, trend: "stable" },
    ],
    votingHistory: [
      { billCode: "H.R.3892", billTitle: "Education Funding Reform", date: "Nov 3, 2025", vote: "Yea", billTopic: "education" },
      { billCode: "H.R.5120", billTitle: "Affordable Housing Expansion", date: "Dec 12, 2025", vote: "Yea", billTopic: "housing" },
      { billCode: "H.R.2210", billTitle: "Small Business Tax Relief", date: "Oct 8, 2025", vote: "Yea", billTopic: "taxes" },
      { billCode: "H.R.7890", billTitle: "Green Infrastructure Fund", date: "Jan 30, 2026", vote: "Nay", billTopic: "environment" },
      { billCode: "H.R.1155", billTitle: "Healthcare Access Act", date: "Feb 20, 2026", vote: "Nay", billTopic: "healthcare" },
      { billCode: "H.R.4400", billTitle: "Balanced Budget Amendment", date: "Mar 5, 2026", vote: "Yea", billTopic: "economy" },
    ],
    committees: [
      "Committee on Education and the Workforce",
      "Committee on Ways and Means",
      "Committee on the Budget",
    ],
  },
  {
    id: "sen-park",
    name: "Sen. David Park",
    party: "D",
    chamber: "Senate",
    state: "New York",
    rating: "B",
    bio: "Senator David Park has represented New York since 2022. He focuses on technology policy, data privacy, and digital rights. He is a member of the Commerce, Science, and Transportation Committee.",
    termStart: "Jan 2023",
    termEnd: "Jan 2029",
    contact: {
      phone: "(202) 555-0163",
      email: "senator@park.senate.gov",
      office: "218 Russell Senate Office Building, Washington, DC 20510",
      website: "https://park.senate.gov",
      twitter: "@SenPark",
    },
    issueScores: [
      { issue: "technology", score: 95, trend: "up" },
      { issue: "education", score: 76, trend: "stable" },
      { issue: "environment", score: 70, trend: "up" },
      { issue: "healthcare", score: 74, trend: "stable" },
      { issue: "economy", score: 68, trend: "down" },
      { issue: "housing", score: 72, trend: "stable" },
    ],
    votingHistory: [
      { billCode: "S.782", billTitle: "Digital Privacy Protection Act", date: "Mar 1, 2026", vote: "Yea", billTopic: "technology" },
      { billCode: "S.1247", billTitle: "Clean Energy Investment Act", date: "Jan 15, 2026", vote: "Yea", billTopic: "environment" },
      { billCode: "S.934", billTitle: "Medicare Expansion Act", date: "Feb 12, 2026", vote: "Yea", billTopic: "healthcare" },
      { billCode: "S.1501", billTitle: "Defense Spending Adjustment", date: "Dec 5, 2025", vote: "Present", billTopic: "defense" },
      { billCode: "S.445", billTitle: "Tax Reform Simplification", date: "Nov 18, 2025", vote: "Yea", billTopic: "taxes" },
    ],
    committees: [
      "Committee on Commerce, Science, and Transportation",
      "Committee on the Judiciary",
      "Committee on Rules and Administration",
    ],
  },
];
