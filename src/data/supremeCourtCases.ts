export interface SupremeCourtCase {
  id: string;
  name: string;
  year: number;
  citation: string;
  category: string;
  shortDescription: string;
  background: string;
  ruling: string;
  significance: string;
}

export const SUPREME_COURT_CASES: SupremeCourtCase[] = [
  {
    id: "marbury-madison",
    name: "Marbury v. Madison",
    year: 1803,
    citation: "5 U.S. 137",
    category: "Judicial Power",
    shortDescription: "Established judicial review — the Supreme Court's power to strike down unconstitutional laws.",
    background:
      "William Marbury was appointed justice of the peace by outgoing President John Adams, but his commission was not delivered before Thomas Jefferson took office. Jefferson's Secretary of State, James Madison, refused to deliver it. Marbury sued directly in the Supreme Court.",
    ruling:
      "Chief Justice John Marshall ruled that while Marbury was entitled to his commission, the Court could not order its delivery because the law granting the Court that power (Section 13 of the Judiciary Act of 1789) was itself unconstitutional. This established that the Supreme Court has the power to declare acts of Congress unconstitutional.",
    significance:
      "Created the doctrine of judicial review — the cornerstone of the Court's power and its role as a co-equal branch of government.",
  },
  {
    id: "mcculloch-maryland",
    name: "McCulloch v. Maryland",
    year: 1819,
    citation: "17 U.S. 316",
    category: "Federalism",
    shortDescription: "Affirmed federal supremacy and Congress's implied powers under the Necessary and Proper Clause.",
    background:
      "Maryland tried to tax the Second Bank of the United States, a federal institution. James McCulloch, the bank's cashier, refused to pay. The state sued.",
    ruling:
      "The Court unanimously ruled that Congress had the implied power to charter a national bank under the Necessary and Proper Clause, and that states could not tax federal institutions because 'the power to tax involves the power to destroy.'",
    significance:
      "Cemented the supremacy of federal law over state law and gave Congress broad authority to legislate beyond its enumerated powers.",
  },
  {
    id: "dred-scott",
    name: "Dred Scott v. Sandford",
    year: 1857,
    citation: "60 U.S. 393",
    category: "Civil Rights",
    shortDescription: "Ruled that African Americans were not citizens — widely considered the Court's worst decision.",
    background:
      "Dred Scott, an enslaved man, sued for his freedom after living with his owner in free territories. He argued that residence in free soil made him free.",
    ruling:
      "The Court held that people of African descent — whether enslaved or free — were not and could never be U.S. citizens, and therefore could not sue in federal court. It also struck down the Missouri Compromise, ruling Congress could not ban slavery in the territories.",
    significance:
      "Inflamed sectional tensions and helped trigger the Civil War. Later overturned by the 13th and 14th Amendments. Universally regarded as a moral and legal failure.",
  },
  {
    id: "plessy-ferguson",
    name: "Plessy v. Ferguson",
    year: 1896,
    citation: "163 U.S. 537",
    category: "Civil Rights",
    shortDescription: "Established the 'separate but equal' doctrine that legalized racial segregation.",
    background:
      "Homer Plessy, who was 1/8 Black, deliberately sat in a whites-only train car in Louisiana to challenge the state's Separate Car Act. He was arrested.",
    ruling:
      "The Court ruled 7-1 that 'separate but equal' accommodations did not violate the 14th Amendment's Equal Protection Clause. Justice John Marshall Harlan's lone dissent famously declared 'our Constitution is color-blind.'",
    significance:
      "Provided legal cover for Jim Crow segregation across the South for nearly 60 years. Overturned by Brown v. Board of Education in 1954.",
  },
  {
    id: "brown-board",
    name: "Brown v. Board of Education",
    year: 1954,
    citation: "347 U.S. 483",
    category: "Civil Rights",
    shortDescription: "Declared racial segregation in public schools unconstitutional, overturning Plessy v. Ferguson.",
    background:
      "Linda Brown, a Black third-grader in Topeka, Kansas, was forced to attend a segregated school far from home. The NAACP, led by Thurgood Marshall, consolidated several cases challenging school segregation.",
    ruling:
      "The Court ruled unanimously that 'separate educational facilities are inherently unequal' and violate the 14th Amendment's Equal Protection Clause. Chief Justice Earl Warren wrote that segregation generates feelings of inferiority that affect children's hearts and minds.",
    significance:
      "Catalyzed the modern civil rights movement and dismantled the legal foundation of segregation in America.",
  },
  {
    id: "miranda-arizona",
    name: "Miranda v. Arizona",
    year: 1966,
    citation: "384 U.S. 436",
    category: "Criminal Justice",
    shortDescription: "Required police to inform suspects of their rights before interrogation — the 'Miranda warning.'",
    background:
      "Ernesto Miranda was arrested and confessed to a crime during police interrogation without being told he had the right to remain silent or to an attorney. His confession was used to convict him.",
    ruling:
      "The Court ruled 5-4 that the 5th Amendment's protection against self-incrimination requires police to inform suspects of their rights before custodial interrogation: the right to remain silent, that anything said can be used against them, the right to an attorney, and the right to a court-appointed attorney if they cannot afford one.",
    significance:
      "Created the 'Miranda warning' familiar from countless TV shows. Fundamentally reshaped police procedure and protections for the accused.",
  },
  {
    id: "loving-virginia",
    name: "Loving v. Virginia",
    year: 1967,
    citation: "388 U.S. 1",
    category: "Civil Rights",
    shortDescription: "Struck down state laws banning interracial marriage as unconstitutional.",
    background:
      "Richard Loving (white) and Mildred Jeter (Black and Indigenous) married in Washington, D.C., then returned home to Virginia, where their marriage was illegal. They were arrested and sentenced to a year in prison, suspended on the condition they leave the state.",
    ruling:
      "The Court ruled unanimously that Virginia's anti-miscegenation law violated both the Equal Protection and Due Process Clauses of the 14th Amendment. Marriage is a 'basic civil right.'",
    significance:
      "Invalidated similar laws in 16 states. Later cited as foundational precedent in Obergefell v. Hodges (2015).",
  },
  {
    id: "roe-wade",
    name: "Roe v. Wade",
    year: 1973,
    citation: "410 U.S. 113",
    category: "Privacy",
    shortDescription: "Recognized a constitutional right to abortion — overturned in 2022 by Dobbs v. Jackson.",
    background:
      "'Jane Roe' (Norma McCorvey) challenged a Texas law that criminalized most abortions. She argued the law violated her constitutional right to privacy.",
    ruling:
      "The Court ruled 7-2 that the 14th Amendment's Due Process Clause includes a right to privacy that protects a woman's choice to have an abortion, subject to state interests that grow as pregnancy progresses (the trimester framework).",
    significance:
      "One of the most consequential and contested decisions in U.S. history. Overturned in 2022 by Dobbs v. Jackson Women's Health Organization, returning abortion regulation to the states.",
  },
  {
    id: "us-v-nixon",
    name: "United States v. Nixon",
    year: 1974,
    citation: "418 U.S. 683",
    category: "Executive Power",
    shortDescription: "Limited executive privilege and forced President Nixon to release the Watergate tapes.",
    background:
      "During the Watergate investigation, a special prosecutor subpoenaed tape recordings from President Nixon's Oval Office. Nixon refused, claiming absolute executive privilege.",
    ruling:
      "The Court ruled unanimously (8-0, with Justice Rehnquist recused) that executive privilege is not absolute and must yield to the demands of due process in a criminal trial. Nixon was ordered to release the tapes.",
    significance:
      "Established that the president is not above the law. Nixon resigned 16 days later — the only U.S. president to do so.",
  },
  {
    id: "citizens-united",
    name: "Citizens United v. FEC",
    year: 2010,
    citation: "558 U.S. 310",
    category: "Free Speech",
    shortDescription: "Ruled that corporations and unions can spend unlimited money on political communications.",
    background:
      "Citizens United, a conservative nonprofit, wanted to air a film critical of Hillary Clinton during the 2008 primaries. Federal law restricted corporate-funded political broadcasts close to elections.",
    ruling:
      "The Court ruled 5-4 that the 1st Amendment protects political speech regardless of the speaker's corporate identity, striking down restrictions on independent campaign expenditures by corporations and unions.",
    significance:
      "Dramatically reshaped American campaign finance, enabling Super PACs and a flood of outside spending. One of the most controversial rulings of the 21st century.",
  },
  {
    id: "obergefell-hodges",
    name: "Obergefell v. Hodges",
    year: 2015,
    citation: "576 U.S. 644",
    category: "Civil Rights",
    shortDescription: "Legalized same-sex marriage nationwide as a constitutional right.",
    background:
      "Jim Obergefell sued Ohio for refusing to recognize his marriage to John Arthur, who was dying. Several similar cases from across the country were consolidated.",
    ruling:
      "The Court ruled 5-4 that the 14th Amendment's Due Process and Equal Protection Clauses guarantee same-sex couples the right to marry. Justice Anthony Kennedy wrote that marriage is a fundamental right inherent in personal liberty.",
    significance:
      "Legalized same-sex marriage in all 50 states and recognized LGBTQ+ couples as equal under the law.",
  },
  {
    id: "dobbs-jackson",
    name: "Dobbs v. Jackson Women's Health",
    year: 2022,
    citation: "597 U.S. 215",
    category: "Privacy",
    shortDescription: "Overturned Roe v. Wade, returning abortion regulation to the states.",
    background:
      "Mississippi enacted a law banning most abortions after 15 weeks, directly challenging the framework of Roe v. Wade and Planned Parenthood v. Casey.",
    ruling:
      "The Court ruled 6-3 to uphold Mississippi's law and 5-4 to overturn Roe and Casey entirely, holding that the Constitution does not confer a right to abortion. Authority to regulate abortion was returned to the states.",
    significance:
      "Triggered an immediate patchwork of state laws — some banning abortion, others expanding access. Reshaped American politics and the 2022 midterm elections.",
  },
];

export const CASE_CATEGORIES = [
  "All",
  ...Array.from(new Set(SUPREME_COURT_CASES.map((c) => c.category))),
];
