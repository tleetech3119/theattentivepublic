// 2026 state primary results & runoff schedule.
// Hand-curated. Nominees are populated only when a single major-party candidate
// effectively cleared the field (uncontested incumbent, etc.) or when a runoff
// is scheduled per state law. Where official results aren't safely confirmable
// here, the UI falls back to a Ballotpedia link.
//
// Runoff rules used:
//   - Alabama: required if no candidate >50% (runoff Jul 14, 2026)
//   - Georgia: required if no candidate >50% (runoff Jun 16, 2026)
//   - North Carolina: if leader <30% and trailing candidate requests (Jul 14)
//   - Oklahoma: required if no candidate >50% (runoff Aug 25, 2026)
//   - South Carolina: required if no candidate >50% (runoff Jun 23, 2026)
//   - South Dakota: required if no candidate >35% in Gov primary (Aug 11)
//   - Texas: required if no candidate >50% (runoff May 26, 2026)
//   - Mississippi/Arkansas: standard runoffs (n/a in this cycle's data)

export type PrimaryNominee = {
  name: string;
  party: "D" | "R";
  uncontested?: boolean;
};

export type RunoffInfo = {
  party: "D" | "R";
  date: string;
  candidates: string[];
  office: "Governor" | "U.S. Senate";
};

export type StatePrimaryResult = {
  state: string;
  // ISO date the primary was held (used to flag "completed")
  governor?: {
    nominees?: PrimaryNominee[]; // 1 per party where decided
    runoffs?: RunoffInfo[];
    note?: string;
  };
  senate?: {
    nominees?: PrimaryNominee[];
    runoffs?: RunoffInfo[];
    note?: string;
  };
};

export const PRIMARY_RESULTS_2026: StatePrimaryResult[] = [
  {
    state: "Arkansas",
    governor: {
      nominees: [{ name: "Sarah Huckabee Sanders", party: "R", uncontested: true }],
    },
  },
  {
    state: "Texas",
    governor: {
      nominees: [{ name: "Greg Abbott", party: "R", uncontested: true }],
      note: "Democratic field contested — winner advances to Nov 3 general.",
    },
  },
  {
    state: "Illinois",
    governor: {
      nominees: [
        { name: "JB Pritzker", party: "D", uncontested: true },
        { name: "Darren Bailey", party: "R", uncontested: true },
      ],
    },
  },
  {
    state: "Ohio",
    governor: {
      note: "Open seat (DeWine term-limited). Major-party nominees advance to Nov 3 general.",
    },
  },
  {
    state: "Nebraska",
    governor: {
      nominees: [{ name: "Jim Pillen", party: "R", uncontested: true }],
    },
  },
  {
    state: "Alabama",
    governor: {
      note: "Multi-way Republican field — runoff likely if no candidate clears 50%.",
      runoffs: [
        {
          party: "R",
          date: "Jul 14, 2026",
          candidates: ["Top two Republican finishers"],
          office: "Governor",
        },
      ],
    },
  },
  {
    state: "Georgia",
    governor: {
      note: "Republican primary triggered a runoff between the top two finishers.",
      runoffs: [
        {
          party: "R",
          date: "Jun 16, 2026",
          candidates: ["Top two Republican finishers"],
          office: "Governor",
        },
      ],
    },
  },
  {
    state: "Idaho",
    governor: {
      nominees: [{ name: "Brad Little", party: "R" }],
    },
  },
  {
    state: "Oregon",
    governor: {
      nominees: [{ name: "Tina Kotek", party: "D", uncontested: true }],
    },
  },
  {
    state: "Pennsylvania",
    governor: {
      nominees: [
        { name: "Josh Shapiro", party: "D", uncontested: true },
        { name: "Stacy Garrity", party: "R", uncontested: true },
      ],
    },
  },
  {
    state: "Maine",
    governor: {
      note: "Crowded D and R fields — plurality winners advance (no runoff in Maine).",
    },
  },
  {
    state: "Nevada",
    governor: {
      nominees: [{ name: "Joe Lombardo", party: "R" }],
      note: "Democratic field contested — plurality winner advances (no runoff in Nevada).",
    },
  },
  {
    state: "South Carolina",
    governor: {
      note: "Crowded Republican field — runoff scheduled if no candidate clears 50%.",
      runoffs: [
        {
          party: "R",
          date: "Jun 23, 2026",
          candidates: ["Top two Republican finishers"],
          office: "Governor",
        },
      ],
    },
  },
  {
    state: "Oklahoma",
    governor: {
      note: "Multi-way Republican field — runoff scheduled if no candidate clears 50%.",
      runoffs: [
        {
          party: "R",
          date: "Aug 25, 2026",
          candidates: ["Top two Republican finishers"],
          office: "Governor",
        },
      ],
    },
  },
];

export function getPrimaryResult(state: string): StatePrimaryResult | undefined {
  return PRIMARY_RESULTS_2026.find((r) => r.state === state);
}
