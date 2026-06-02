// 2026 Gubernatorial candidates — major-party (D & R) only.
// Source: MultiState (updated April 2026) + Ballotpedia. Hand-curated; update as primaries resolve.
// Last updated: June 2026.

export type GovCandidate = {
  name: string;
  party: "D" | "R";
  note?: string; // e.g. "Incumbent", "Nominee", title
};

export type GovRace = {
  state: string;
  primaryDate: string;
  incumbentTermLimited?: boolean;
  incumbentNotRunning?: boolean;
  battleground?: boolean;
  candidates: GovCandidate[];
};

export const GOV_RACES_2026: GovRace[] = [
  {
    state: "Alabama",
    primaryDate: "May 19, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Doug Jones", party: "D", note: "Fmr. U.S. Senator" },
      { name: "Will Boyd", party: "D", note: "Pastor" },
      { name: "Yolanda Flowers", party: "D" },
      { name: "Chad Martin", party: "D" },
      { name: "Tommy Tuberville", party: "R", note: "U.S. Senator" },
      { name: "Ken McFeeters", party: "R" },
    ],
  },
  {
    state: "Alaska",
    primaryDate: "Aug 18, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Tom Begich", party: "D", note: "Fmr. Senate Minority Leader" },
      { name: "Matt Claman", party: "D", note: "State Senator" },
      { name: "Jonathan Kreiss-Tomkins", party: "D" },
      { name: "Nancy Dahlstrom", party: "R", note: "Lt. Governor" },
      { name: "Adam Crum", party: "R", note: "Fmr. Revenue Commissioner" },
      { name: "Dave Bronson", party: "R", note: "Fmr. Anchorage Mayor" },
      { name: "Shelley Hughes", party: "R", note: "State Senator" },
      { name: "Treg Taylor", party: "R", note: "Fmr. AK Attorney General" },
    ],
  },
  {
    state: "Arizona",
    primaryDate: "Aug 4, 2026",
    candidates: [
      { name: "Katie Hobbs", party: "D", note: "Incumbent Governor" },
      { name: "Andy Biggs", party: "R", note: "U.S. Representative" },
      { name: "David Schweikert", party: "R", note: "U.S. Representative" },
    ],
  },
  {
    state: "Arkansas",
    primaryDate: "Mar 3, 2026",
    candidates: [
      { name: "Fred Love", party: "D", note: "State Senator" },
      { name: "Supha Xayprasith-Mays", party: "D" },
      { name: "Sarah Huckabee Sanders", party: "R", note: "Incumbent Governor" },
    ],
  },
  {
    state: "California",
    primaryDate: "Jun 2, 2026",
    incumbentTermLimited: true,
    battleground: true,
    candidates: [
      { name: "Katie Porter", party: "D", note: "Fmr. U.S. Representative" },
      { name: "Xavier Becerra", party: "D", note: "Fmr. HHS Secretary" },
      { name: "Antonio Villaraigosa", party: "D", note: "Fmr. L.A. Mayor" },
      { name: "Toni Atkins", party: "D", note: "Fmr. State Senate Pres." },
      { name: "Eric Swalwell", party: "D", note: "U.S. Representative" },
      { name: "Tony Thurmond", party: "D", note: "Supt. of Public Instruction" },
      { name: "Betty Yee", party: "D", note: "Fmr. State Controller" },
      { name: "Tom Steyer", party: "D" },
      { name: "Chad Bianco", party: "R", note: "Riverside Co. Sheriff" },
      { name: "Steve Hilton", party: "R", note: "Political commentator" },
    ],
  },
  {
    state: "Colorado",
    primaryDate: "Jun 30, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Michael Bennet", party: "D", note: "U.S. Senator" },
      { name: "Phil Weiser", party: "D", note: "Attorney General" },
      { name: "Greg Lopez", party: "R", note: "Fmr. U.S. Representative" },
      { name: "Mark Baisley", party: "R", note: "State Senator" },
      { name: "Barbara Kirkmeyer", party: "R", note: "State Senator" },
    ],
  },
  {
    state: "Connecticut",
    primaryDate: "Aug 11, 2026",
    candidates: [
      { name: "Ned Lamont", party: "D", note: "Incumbent Governor" },
      { name: "Josh Elliott", party: "D", note: "State Representative" },
      { name: "Ryan Fazio", party: "R", note: "State Senator" },
      { name: "Erin Stewart", party: "R", note: "Fmr. New Britain Mayor" },
      { name: "Betsy McCaughey", party: "R", note: "Fmr. NY Lt. Gov." },
    ],
  },
  {
    state: "Florida",
    primaryDate: "Aug 18, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "David Jolly", party: "D", note: "Fmr. U.S. Representative" },
      { name: "Jerry Demings", party: "D", note: "Orange County Mayor" },
      { name: "Byron Donalds", party: "R", note: "U.S. Representative" },
      { name: "Paul Renner", party: "R", note: "Fmr. FL House Speaker" },
      { name: "James Fishback", party: "R" },
    ],
  },
  {
    state: "Georgia",
    primaryDate: "May 19, 2026",
    incumbentTermLimited: true,
    battleground: true,
    candidates: [
      { name: "Keisha Lance Bottoms", party: "D", note: "Fmr. Atlanta Mayor" },
      { name: "Jason Esteves", party: "D", note: "State Senator" },
      { name: "Michael Thurmond", party: "D" },
      { name: "Derrick Jackson", party: "D", note: "State Representative" },
      { name: "Chris Carr", party: "R", note: "Attorney General" },
      { name: "Burt Jones", party: "R", note: "Lt. Governor" },
      { name: "Brad Raffensperger", party: "R", note: "Secretary of State" },
      { name: "Geoff Duncan", party: "D", note: "Fmr. Lt. Governor" },
    ],
  },
  {
    state: "Hawaii",
    primaryDate: "Aug 8, 2026",
    candidates: [
      { name: "Josh Green", party: "D", note: "Incumbent Governor" },
    ],
  },
  {
    state: "Idaho",
    primaryDate: "May 19, 2026",
    candidates: [
      { name: "Terri Pickens Manweiler", party: "D" },
      { name: "Jill C. Kirkham", party: "D" },
      { name: "Brad Little", party: "R", note: "Incumbent Governor" },
      { name: "Ron James", party: "R", note: "Teton Co. Commissioner" },
    ],
  },
  {
    state: "Illinois",
    primaryDate: "Mar 17, 2026",
    candidates: [
      { name: "JB Pritzker", party: "D", note: "Incumbent — Nominee" },
      { name: "Darren Bailey", party: "R", note: "Fmr. State Sen. — Nominee" },
    ],
  },
  {
    state: "Iowa",
    primaryDate: "Jun 2, 2026",
    incumbentNotRunning: true,
    battleground: true,
    candidates: [
      { name: "Rob Sand", party: "D", note: "State Auditor" },
      { name: "Randy Feenstra", party: "R", note: "U.S. Representative" },
      { name: "Brad Sherman", party: "R", note: "Fmr. State Representative" },
      { name: "Eddie Andrews", party: "R", note: "State Representative" },
    ],
  },
  {
    state: "Kansas",
    primaryDate: "Aug 4, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Cindy Holscher", party: "D", note: "State Senator" },
      { name: "Ethan Corson", party: "D", note: "State Senator" },
      { name: "Scott Schwab", party: "R", note: "Secretary of State" },
      { name: "Ty Masterson", party: "R", note: "State Senate President" },
      { name: "Jeff Colyer", party: "R", note: "Fmr. Governor" },
      { name: "Vicki Schmidt", party: "R", note: "Insurance Commissioner" },
    ],
  },
  {
    state: "Maine",
    primaryDate: "Jun 9, 2026",
    incumbentTermLimited: true,
    candidates: [
      // Verified against Ballotpedia June 9, 2026 primary ballots
      { name: "Shenna Bellows", party: "D", note: "Secretary of State" },
      { name: "Troy Dale Jackson", party: "D", note: "Fmr. Senate President" },
      { name: "Angus King III", party: "D" },
      { name: "Hannah Pingree", party: "D", note: "Fmr. House Speaker" },
      { name: "Nirav Shah", party: "D", note: "Fmr. Maine CDC Director" },
      { name: "Jonathan Bush", party: "R" },
      { name: "Bobby Charles", party: "R", note: "Fmr. U.S. State Dept." },
      { name: "David Jones", party: "R", note: "Businessman" },
      { name: "James Libby", party: "R", note: "Fmr. State Senator" },
      { name: "Garrett Mason", party: "R", note: "Fmr. Senate Majority Leader" },
      { name: "Owen McCarthy", party: "R" },
      { name: "Ben Midgley", party: "R" },
      { name: "Robert J. Wessels", party: "R", note: "Fmr. Paris selectman" },
    ],
  },
  {
    state: "Maryland",
    primaryDate: "Jun 23, 2026",
    candidates: [
      { name: "Wes Moore", party: "D", note: "Incumbent Governor" },
      { name: "Dan Cox", party: "R", note: "Fmr. State Delegate" },
      { name: "Ed Hale", party: "R" },
    ],
  },
  {
    state: "Massachusetts",
    primaryDate: "Sep 1, 2026",
    candidates: [
      { name: "Maura Healey", party: "D", note: "Incumbent Governor" },
      { name: "Mike Kennealy", party: "R", note: "Fmr. MA Housing Secretary" },
      { name: "Brian Shortsleeve", party: "R", note: "Fmr. MBTA GM" },
      { name: "Michael Minogue", party: "R" },
    ],
  },
  {
    state: "Michigan",
    primaryDate: "Aug 4, 2026",
    incumbentTermLimited: true,
    battleground: true,
    candidates: [
      { name: "Jocelyn Benson", party: "D", note: "Secretary of State" },
      { name: "Garlin Gilchrist", party: "D", note: "Lt. Governor" },
      { name: "Chris Swanson", party: "D", note: "Sheriff" },
      { name: "John James", party: "R", note: "U.S. Representative" },
      { name: "Aric Nesbitt", party: "R", note: "Senate Minority Leader" },
      { name: "Tom Leonard", party: "R", note: "Fmr. House Speaker" },
      { name: "Mike Cox", party: "R", note: "Fmr. Attorney General" },
    ],
  },
  {
    state: "Minnesota",
    primaryDate: "Aug 11, 2026",
    candidates: [
      { name: "Amy Klobuchar", party: "D", note: "U.S. Senator" },
      { name: "Lisa Demuth", party: "R", note: "State Representative" },
      { name: "Kristen Robbins", party: "R", note: "State Representative" },
      { name: "Peggy Bennett", party: "R", note: "State Representative" },
      { name: "Kendall Qualls", party: "R" },
      { name: "Mike Lindell", party: "R", note: "MyPillow Founder" },
    ],
  },
  {
    state: "Nebraska",
    primaryDate: "May 12, 2026",
    candidates: [
      { name: "Lynne Walz", party: "D" },
      { name: "Jim Pillen", party: "R", note: "Incumbent Governor" },
    ],
  },
  {
    state: "Nevada",
    primaryDate: "Jun 9, 2026",
    battleground: true,
    candidates: [
      // Verified against Ballotpedia June 9, 2026 primary ballots
      { name: "Sunshine Arterburn", party: "D" },
      { name: "Miqehl Bayfield", party: "D" },
      { name: "Emile Bouari", party: "D" },
      { name: "James Cooper", party: "D" },
      { name: "Aaron Ford", party: "D", note: "Attorney General" },
      { name: "Alexis Hill", party: "D", note: "Washoe Co. Commissioner" },
      { name: "Joe Lombardo", party: "R", note: "Incumbent Governor" },
      { name: "Donald Beaudry Jr.", party: "R" },
      { name: "Irina Hansen", party: "R" },
      { name: "M. Kameron Hawkins", party: "R" },
      { name: "Matthew Winterhawk", party: "R" },
      { name: "Jose Zelaya", party: "R" },
      { name: "Barak Zilberberg", party: "R" },
    ],
  },
  {
    state: "New Hampshire",
    primaryDate: "Sep 8, 2026",
    candidates: [
      { name: "Cinde Warmington", party: "D", note: "Executive Councilor" },
      { name: "Jon Kiper", party: "D" },
      { name: "Kelly Ayotte", party: "R", note: "Incumbent Governor" },
    ],
  },
  {
    state: "New Mexico",
    primaryDate: "Jun 2, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Deb Haaland", party: "D", note: "Fmr. U.S. Interior Secretary" },
      { name: "Sam Bregman", party: "D", note: "Bernalillo Co. DA" },
      { name: "Ken Miyagishima", party: "D", note: "Fmr. Las Cruces Mayor" },
      { name: "Gregg Hull", party: "R", note: "Rio Rancho Mayor" },
      { name: "Steve Lanier", party: "R", note: "State Senator" },
    ],
  },
  {
    state: "New York",
    primaryDate: "Jun 23, 2026",
    candidates: [
      { name: "Kathy Hochul", party: "D", note: "Incumbent Governor" },
      { name: "Bruce Blakeman", party: "R", note: "Nassau Co. Executive" },
      { name: "Pat Hahn", party: "R", note: "Union Leader" },
    ],
  },
  {
    state: "Ohio",
    primaryDate: "May 5, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Amy Acton", party: "D", note: "Fmr. OH Dept. of Health Dir." },
      { name: "Vivek Ramaswamy", party: "R" },
      { name: "Heather Hill", party: "R" },
    ],
  },
  {
    state: "Oklahoma",
    primaryDate: "Jun 16, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Cindy Munson", party: "D", note: "House Minority Leader" },
      { name: "Gentner Drummond", party: "R", note: "Attorney General" },
      { name: "Charles McCall", party: "R", note: "Fmr. House Speaker" },
      { name: "Mike Mazzei", party: "R", note: "Fmr. State Senator" },
      { name: "Chip Keating", party: "R" },
    ],
  },
  {
    state: "Oregon",
    primaryDate: "May 19, 2026",
    candidates: [
      { name: "Tina Kotek", party: "D", note: "Incumbent Governor" },
      { name: "Christine Drazan", party: "R", note: "House Minority Leader" },
      { name: "Ed Diehl", party: "R", note: "State Representative" },
      { name: "Chris Dudley", party: "R", note: "Wealth mgmt. executive" },
      { name: "Danielle Bethell", party: "R", note: "Marion Co. Commissioner" },
    ],
  },
  {
    state: "Pennsylvania",
    primaryDate: "May 19, 2026",
    battleground: true,
    candidates: [
      { name: "Josh Shapiro", party: "D", note: "Incumbent Governor" },
      { name: "Stacy Garrity", party: "R", note: "State Treasurer" },
    ],
  },
  {
    state: "Rhode Island",
    primaryDate: "Sep 8, 2026",
    candidates: [
      { name: "Dan McKee", party: "D", note: "Incumbent Governor" },
      { name: "Helena Buonanno Foulkes", party: "D", note: "Fmr. CVS Executive" },
      { name: "Aaron Guckian", party: "R" },
      { name: "Elaine Pelino", party: "R" },
    ],
  },
  {
    state: "South Carolina",
    primaryDate: "Jun 9, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Jermaine Johnson", party: "D", note: "State Representative" },
      { name: "Billy Webster", party: "D" },
      { name: "Alan Wilson", party: "R", note: "Attorney General" },
      { name: "Pamela Evette", party: "R", note: "Lt. Governor" },
      { name: "Nancy Mace", party: "R", note: "U.S. Representative" },
      { name: "Ralph Norman", party: "R", note: "U.S. Representative" },
      { name: "Josh Kimbrell", party: "R", note: "State Senator" },
    ],
  },
  {
    state: "South Dakota",
    primaryDate: "Jun 2, 2026",
    candidates: [
      { name: "Dan Ahlers", party: "D" },
      { name: "Robert Arnold", party: "D" },
      { name: "Larry Rhoden", party: "R", note: "Incumbent Governor" },
      { name: "Dusty Johnson", party: "R", note: "U.S. Representative" },
      { name: "Jon Hansen", party: "R", note: "Speaker of the House" },
      { name: "Toby Doeden", party: "R", note: "Investment group president" },
    ],
  },
  {
    state: "Tennessee",
    primaryDate: "Aug 6, 2026",
    incumbentTermLimited: true,
    candidates: [
      { name: "Jerri Green", party: "D" },
      { name: "Adam Kurtz", party: "D" },
      { name: "Marsha Blackburn", party: "R", note: "U.S. Senator" },
      { name: "John Rose", party: "R", note: "U.S. Representative" },
      { name: "Monty Fritts", party: "R" },
    ],
  },
  {
    state: "Texas",
    primaryDate: "Mar 3, 2026",
    candidates: [
      { name: "Gina Hinojosa", party: "D", note: "State Representative" },
      { name: "Chris Bell", party: "D", note: "Fmr. U.S. Representative" },
      { name: "Andrew White", party: "D" },
      { name: "Ben Flores", party: "D", note: "Bay City Councilman" },
      { name: "Greg Abbott", party: "R", note: "Incumbent Governor" },
    ],
  },
  {
    state: "Vermont",
    primaryDate: "Aug 11, 2026",
    candidates: [
      { name: "Esther Charlestin", party: "D", note: "VT Commission on Women Co-Chair" },
      { name: "Phil Scott", party: "R", note: "Incumbent Governor" },
    ],
  },
  {
    state: "Wisconsin",
    primaryDate: "Aug 11, 2026",
    incumbentNotRunning: true,
    battleground: true,
    candidates: [
      { name: "Mandela Barnes", party: "D", note: "Fmr. Lt. Governor" },
      { name: "Sarah Rodriguez", party: "D", note: "Lt. Governor" },
      { name: "David Crowley", party: "D", note: "Milwaukee Co. Executive" },
      { name: "Kelda Roys", party: "D", note: "State Senator" },
      { name: "Francesca Hong", party: "D", note: "State Representative" },
      { name: "Tom Tiffany", party: "R", note: "U.S. Representative" },
      { name: "Andy Manske", party: "R" },
    ],
  },
  {
    state: "Wyoming",
    primaryDate: "Aug 18, 2026",
    incumbentNotRunning: true,
    candidates: [
      { name: "Megan Degenfelder", party: "R", note: "Supt. of Public Instruction" },
      { name: "Eric Barlow", party: "R", note: "State Senator" },
      { name: "Brent Bien", party: "R" },
    ],
  },
];
