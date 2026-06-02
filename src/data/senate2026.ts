// 2026 U.S. Senate races (Class II) — all 33 contested seats.
// Hand-curated: incumbent status + high-confidence declared major-party candidates
// as of 2026. Candidate hover-cards generate AI platform summaries on demand,
// so this list focuses on accuracy over completeness.

export type SenateParty = "D" | "R" | "I";

export type SenateCandidate = {
  name: string;
  party: SenateParty;
  note?: string;
};

export type SenateRace = {
  state: string;
  incumbentParty: SenateParty;
  seatStatus: "incumbent_running" | "retiring" | "open";
  battleground?: boolean;
  candidates: SenateCandidate[];
};

export const SENATE_RACES_2026: SenateRace[] = [
  { state: "Alabama", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Tommy Tuberville", party: "R", note: "Incumbent (running for Governor — seat may open)" }] },
  { state: "Alaska", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Dan Sullivan", party: "R", note: "Incumbent" }] },
  { state: "Arkansas", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Tom Cotton", party: "R", note: "Incumbent" }] },
  { state: "Colorado", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "John Hickenlooper", party: "D", note: "Incumbent" }] },
  { state: "Delaware", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "Chris Coons", party: "D", note: "Incumbent" }] },
  { state: "Georgia", incumbentParty: "D", seatStatus: "incumbent_running", battleground: true,
    candidates: [
      { name: "Jon Ossoff", party: "D", note: "Incumbent" },
      { name: "Buddy Carter", party: "R", note: "U.S. Rep." },
      { name: "Derek Dooley", party: "R" },
    ] },
  { state: "Idaho", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Jim Risch", party: "R", note: "Incumbent" }] },
  { state: "Illinois", incumbentParty: "D", seatStatus: "retiring", battleground: false,
    candidates: [
      { name: "Dick Durbin", party: "D", note: "Retiring — seat open" },
      { name: "Juliana Stratton", party: "D", note: "Lt. Governor" },
      { name: "Robin Kelly", party: "D", note: "U.S. Rep." },
      { name: "Raja Krishnamoorthi", party: "D", note: "U.S. Rep." },
    ] },
  { state: "Iowa", incumbentParty: "R", seatStatus: "incumbent_running", battleground: true,
    candidates: [{ name: "Joni Ernst", party: "R", note: "Incumbent" }] },
  { state: "Kansas", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Roger Marshall", party: "R", note: "Incumbent" }] },
  { state: "Kentucky", incumbentParty: "R", seatStatus: "retiring",
    candidates: [
      { name: "Mitch McConnell", party: "R", note: "Retiring — seat open" },
      { name: "Daniel Cameron", party: "R", note: "Fmr. Attorney General" },
      { name: "Andy Barr", party: "R", note: "U.S. Rep." },
    ] },
  { state: "Louisiana", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Bill Cassidy", party: "R", note: "Incumbent" }] },
  { state: "Maine", incumbentParty: "R", seatStatus: "incumbent_running", battleground: true,
    candidates: [
      { name: "Susan Collins", party: "R", note: "Incumbent" },
      { name: "Graham Platner", party: "D" },
      { name: "Jordan Wood", party: "D" },
    ] },
  { state: "Massachusetts", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "Ed Markey", party: "D", note: "Incumbent" }] },
  { state: "Michigan", incumbentParty: "D", seatStatus: "retiring", battleground: true,
    candidates: [
      { name: "Gary Peters", party: "D", note: "Retiring — seat open" },
      { name: "Mallory McMorrow", party: "D", note: "State Senator" },
      { name: "Haley Stevens", party: "D", note: "U.S. Rep." },
      { name: "Abdul El-Sayed", party: "D" },
      { name: "Mike Rogers", party: "R", note: "Fmr. U.S. Rep." },
    ] },
  { state: "Minnesota", incumbentParty: "D", seatStatus: "retiring", battleground: true,
    candidates: [
      { name: "Tina Smith", party: "D", note: "Retiring — seat open" },
      { name: "Peggy Flanagan", party: "D", note: "Lt. Governor" },
      { name: "Royce White", party: "R" },
    ] },
  { state: "Mississippi", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Cindy Hyde-Smith", party: "R", note: "Incumbent" }] },
  { state: "Montana", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Steve Daines", party: "R", note: "Incumbent" }] },
  { state: "Nebraska", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Pete Ricketts", party: "R", note: "Incumbent" }] },
  { state: "New Hampshire", incumbentParty: "D", seatStatus: "retiring", battleground: true,
    candidates: [
      { name: "Jeanne Shaheen", party: "D", note: "Retiring — seat open" },
      { name: "Chris Pappas", party: "D", note: "U.S. Rep." },
      { name: "Maggie Goodlander", party: "D", note: "U.S. Rep." },
      { name: "Scott Brown", party: "R", note: "Fmr. U.S. Senator" },
    ] },
  { state: "New Jersey", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "Cory Booker", party: "D", note: "Incumbent" }] },
  { state: "New Mexico", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "Ben Ray Luján", party: "D", note: "Incumbent" }] },
  { state: "North Carolina", incumbentParty: "R", seatStatus: "retiring", battleground: true,
    candidates: [
      { name: "Thom Tillis", party: "R", note: "Retiring — seat open" },
      { name: "Roy Cooper", party: "D", note: "Fmr. Governor" },
      { name: "Wiley Nickel", party: "D", note: "Fmr. U.S. Rep." },
      { name: "Michael Whatley", party: "R", note: "Fmr. RNC Chair" },
    ] },
  { state: "Oklahoma", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "James Lankford", party: "R", note: "Incumbent" }] },
  { state: "Oregon", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "Jeff Merkley", party: "D", note: "Incumbent" }] },
  { state: "Rhode Island", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "Jack Reed", party: "D", note: "Incumbent" }] },
  { state: "South Carolina", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Lindsey Graham", party: "R", note: "Incumbent" }] },
  { state: "South Dakota", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Mike Rounds", party: "R", note: "Incumbent" }] },
  { state: "Tennessee", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Bill Hagerty", party: "R", note: "Incumbent" }] },
  { state: "Texas", incumbentParty: "R", seatStatus: "incumbent_running", battleground: true,
    candidates: [
      { name: "John Cornyn", party: "R", note: "Incumbent" },
      { name: "Ken Paxton", party: "R", note: "Attorney General" },
      { name: "Colin Allred", party: "D", note: "Fmr. U.S. Rep." },
    ] },
  { state: "Virginia", incumbentParty: "D", seatStatus: "incumbent_running",
    candidates: [{ name: "Mark Warner", party: "D", note: "Incumbent" }] },
  { state: "West Virginia", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Shelley Moore Capito", party: "R", note: "Incumbent" }] },
  { state: "Wyoming", incumbentParty: "R", seatStatus: "incumbent_running",
    candidates: [{ name: "Cynthia Lummis", party: "R", note: "Incumbent" }] },
];
