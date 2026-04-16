export interface FoundingDoc {
  title: string;
  intro: string;
  text: string;
}

export interface Amendment {
  number: number;
  romanNumeral: string;
  shortName: string;
  ratified: string;
  text: string;
}

export const PREAMBLE: FoundingDoc = {
  title: "Preamble to the U.S. Constitution",
  intro: "The opening statement of the Constitution, declaring its purpose and source of authority.",
  text: "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.",
};

export interface ConstitutionArticle {
  number: string;
  title: string;
  summary: string;
  text: string;
}

export const CONSTITUTION_ARTICLES: ConstitutionArticle[] = [
  {
    number: "I",
    title: "The Legislative Branch",
    summary: "Establishes Congress (House and Senate), its powers, and how laws are made.",
    text: "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives. The House is composed of members chosen every second Year by the People of the several States. The Senate is composed of two Senators from each State. Congress has the power to lay and collect Taxes, borrow Money, regulate Commerce, coin Money, declare War, raise and support Armies, and make all Laws which shall be necessary and proper for carrying into Execution the foregoing Powers.",
  },
  {
    number: "II",
    title: "The Executive Branch",
    summary: "Establishes the Presidency, election by the Electoral College, and executive powers.",
    text: "The executive Power shall be vested in a President of the United States of America. He shall hold his Office during the Term of four Years, together with the Vice President. The President shall be Commander in Chief of the Army and Navy, shall have Power to grant Reprieves and Pardons, to make Treaties (with Senate consent), and to nominate Ambassadors, Judges of the Supreme Court, and other Officers. The President shall take Care that the Laws be faithfully executed.",
  },
  {
    number: "III",
    title: "The Judicial Branch",
    summary: "Establishes the Supreme Court and the federal court system.",
    text: "The judicial Power of the United States shall be vested in one supreme Court, and in such inferior Courts as the Congress may from time to time ordain and establish. The Judges shall hold their Offices during good Behaviour. The judicial Power shall extend to all Cases arising under this Constitution, the Laws of the United States, and Treaties made under their Authority. The Trial of all Crimes, except in Cases of Impeachment, shall be by Jury.",
  },
  {
    number: "IV",
    title: "States' Relations",
    summary: "Governs relationships between states and addresses new states.",
    text: "Full Faith and Credit shall be given in each State to the public Acts, Records, and judicial Proceedings of every other State. The Citizens of each State shall be entitled to all Privileges and Immunities of Citizens in the several States. New States may be admitted by the Congress into this Union. The United States shall guarantee to every State in this Union a Republican Form of Government.",
  },
  {
    number: "V",
    title: "Amendment Process",
    summary: "Defines how the Constitution can be amended.",
    text: "The Congress, whenever two thirds of both Houses shall deem it necessary, shall propose Amendments to this Constitution, or, on the Application of the Legislatures of two thirds of the several States, shall call a Convention for proposing Amendments. Amendments shall be valid when ratified by the Legislatures of three fourths of the several States, or by Conventions in three fourths thereof.",
  },
  {
    number: "VI",
    title: "Supremacy Clause",
    summary: "Declares the Constitution and federal law supreme over state law.",
    text: "This Constitution, and the Laws of the United States which shall be made in Pursuance thereof, and all Treaties made under the Authority of the United States, shall be the supreme Law of the Land; and the Judges in every State shall be bound thereby. The Senators and Representatives, and all executive and judicial Officers, both of the United States and of the several States, shall be bound by Oath or Affirmation, to support this Constitution; but no religious Test shall ever be required as a Qualification to any Office.",
  },
  {
    number: "VII",
    title: "Ratification",
    summary: "Sets the conditions for the Constitution to take effect.",
    text: "The Ratification of the Conventions of nine States, shall be sufficient for the Establishment of this Constitution between the States so ratifying the Same.",
  },
];

export const BILL_OF_RIGHTS: Amendment[] = [
  {
    number: 1,
    romanNumeral: "I",
    shortName: "Freedoms of Religion, Speech, Press, Assembly, Petition",
    ratified: "December 15, 1791",
    text: "Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.",
  },
  {
    number: 2,
    romanNumeral: "II",
    shortName: "Right to Bear Arms",
    ratified: "December 15, 1791",
    text: "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.",
  },
  {
    number: 3,
    romanNumeral: "III",
    shortName: "Quartering of Soldiers",
    ratified: "December 15, 1791",
    text: "No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.",
  },
  {
    number: 4,
    romanNumeral: "IV",
    shortName: "Search and Seizure",
    ratified: "December 15, 1791",
    text: "The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.",
  },
  {
    number: 5,
    romanNumeral: "V",
    shortName: "Rights of the Accused; Due Process",
    ratified: "December 15, 1791",
    text: "No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, except in cases arising in the land or naval forces, or in the Militia, when in actual service in time of War or public danger; nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.",
  },
  {
    number: 6,
    romanNumeral: "VI",
    shortName: "Right to a Fair Trial",
    ratified: "December 15, 1791",
    text: "In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial, by an impartial jury of the State and district wherein the crime shall have been committed; and to be informed of the nature and cause of the accusation; to be confronted with the witnesses against him; to have compulsory process for obtaining witnesses in his favor, and to have the Assistance of Counsel for his defence.",
  },
  {
    number: 7,
    romanNumeral: "VII",
    shortName: "Right to a Jury in Civil Cases",
    ratified: "December 15, 1791",
    text: "In Suits at common law, where the value in controversy shall exceed twenty dollars, the right of trial by jury shall be preserved, and no fact tried by a jury, shall be otherwise re-examined in any Court of the United States, than according to the rules of the common law.",
  },
  {
    number: 8,
    romanNumeral: "VIII",
    shortName: "No Cruel and Unusual Punishment",
    ratified: "December 15, 1791",
    text: "Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted.",
  },
  {
    number: 9,
    romanNumeral: "IX",
    shortName: "Rights Retained by the People",
    ratified: "December 15, 1791",
    text: "The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people.",
  },
  {
    number: 10,
    romanNumeral: "X",
    shortName: "Powers Reserved to the States",
    ratified: "December 15, 1791",
    text: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people.",
  },
];

export const ADDITIONAL_AMENDMENTS: Amendment[] = [
  {
    number: 11,
    romanNumeral: "XI",
    shortName: "Suits Against States",
    ratified: "February 7, 1795",
    text: "The Judicial power of the United States shall not be construed to extend to any suit in law or equity, commenced or prosecuted against one of the United States by Citizens of another State, or by Citizens or Subjects of any Foreign State.",
  },
  {
    number: 12,
    romanNumeral: "XII",
    shortName: "Election of President and Vice President",
    ratified: "June 15, 1804",
    text: "The Electors shall meet in their respective states and vote by ballot for President and Vice-President, one of whom, at least, shall not be an inhabitant of the same state with themselves. They shall name in their ballots the person voted for as President, and in distinct ballots the person voted for as Vice-President. The person having the greatest number of votes for President, shall be the President, if such number be a majority of the whole number of Electors appointed.",
  },
  {
    number: 13,
    romanNumeral: "XIII",
    shortName: "Abolition of Slavery",
    ratified: "December 6, 1865",
    text: "Neither slavery nor involuntary servitude, except as a punishment for crime whereof the party shall have been duly convicted, shall exist within the United States, or any place subject to their jurisdiction. Congress shall have power to enforce this article by appropriate legislation.",
  },
  {
    number: 14,
    romanNumeral: "XIV",
    shortName: "Citizenship, Due Process, and Equal Protection",
    ratified: "July 9, 1868",
    text: "All persons born or naturalized in the United States, and subject to the jurisdiction thereof, are citizens of the United States and of the State wherein they reside. No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States; nor shall any State deprive any person of life, liberty, or property, without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.",
  },
  {
    number: 15,
    romanNumeral: "XV",
    shortName: "Right to Vote — Race",
    ratified: "February 3, 1870",
    text: "The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of race, color, or previous condition of servitude. The Congress shall have power to enforce this article by appropriate legislation.",
  },
  {
    number: 16,
    romanNumeral: "XVI",
    shortName: "Federal Income Tax",
    ratified: "February 3, 1913",
    text: "The Congress shall have power to lay and collect taxes on incomes, from whatever source derived, without apportionment among the several States, and without regard to any census or enumeration.",
  },
  {
    number: 17,
    romanNumeral: "XVII",
    shortName: "Direct Election of Senators",
    ratified: "April 8, 1913",
    text: "The Senate of the United States shall be composed of two Senators from each State, elected by the people thereof, for six years; and each Senator shall have one vote. The electors in each State shall have the qualifications requisite for electors of the most numerous branch of the State legislatures.",
  },
  {
    number: 18,
    romanNumeral: "XVIII",
    shortName: "Prohibition of Alcohol (Repealed)",
    ratified: "January 16, 1919",
    text: "After one year from the ratification of this article the manufacture, sale, or transportation of intoxicating liquors within, the importation thereof into, or the exportation thereof from the United States and all territory subject to the jurisdiction thereof for beverage purposes is hereby prohibited. (Repealed by the 21st Amendment.)",
  },
  {
    number: 19,
    romanNumeral: "XIX",
    shortName: "Women's Right to Vote",
    ratified: "August 18, 1920",
    text: "The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of sex. Congress shall have power to enforce this article by appropriate legislation.",
  },
  {
    number: 20,
    romanNumeral: "XX",
    shortName: "Presidential Terms and Succession",
    ratified: "January 23, 1933",
    text: "The terms of the President and Vice President shall end at noon on the 20th day of January, and the terms of Senators and Representatives at noon on the 3d day of January, of the years in which such terms would have ended if this article had not been ratified; and the terms of their successors shall then begin.",
  },
  {
    number: 21,
    romanNumeral: "XXI",
    shortName: "Repeal of Prohibition",
    ratified: "December 5, 1933",
    text: "The eighteenth article of amendment to the Constitution of the United States is hereby repealed. The transportation or importation into any State, Territory, or possession of the United States for delivery or use therein of intoxicating liquors, in violation of the laws thereof, is hereby prohibited.",
  },
  {
    number: 22,
    romanNumeral: "XXII",
    shortName: "Two-Term Presidential Limit",
    ratified: "February 27, 1951",
    text: "No person shall be elected to the office of the President more than twice, and no person who has held the office of President, or acted as President, for more than two years of a term to which some other person was elected President shall be elected to the office of the President more than once.",
  },
  {
    number: 23,
    romanNumeral: "XXIII",
    shortName: "D.C. Presidential Vote",
    ratified: "March 29, 1961",
    text: "The District constituting the seat of Government of the United States shall appoint in such manner as the Congress may direct: A number of electors of President and Vice President equal to the whole number of Senators and Representatives in Congress to which the District would be entitled if it were a State, but in no event more than the least populous State.",
  },
  {
    number: 24,
    romanNumeral: "XXIV",
    shortName: "Abolition of Poll Taxes",
    ratified: "January 23, 1964",
    text: "The right of citizens of the United States to vote in any primary or other election for President or Vice President, for electors for President or Vice President, or for Senator or Representative in Congress, shall not be denied or abridged by the United States or any State by reason of failure to pay any poll tax or other tax.",
  },
  {
    number: 25,
    romanNumeral: "XXV",
    shortName: "Presidential Succession and Disability",
    ratified: "February 10, 1967",
    text: "In case of the removal of the President from office or of his death or resignation, the Vice President shall become President. Whenever there is a vacancy in the office of the Vice President, the President shall nominate a Vice President who shall take office upon confirmation by a majority vote of both Houses of Congress. Whenever the President transmits to the President pro tempore of the Senate and the Speaker of the House his written declaration that he is unable to discharge the powers and duties of his office, such powers and duties shall be discharged by the Vice President as Acting President.",
  },
  {
    number: 26,
    romanNumeral: "XXVI",
    shortName: "Voting Age Lowered to 18",
    ratified: "July 1, 1971",
    text: "The right of citizens of the United States, who are eighteen years of age or older, to vote shall not be denied or abridged by the United States or any State on account of age. The Congress shall have power to enforce this article by appropriate legislation.",
  },
  {
    number: 27,
    romanNumeral: "XXVII",
    shortName: "Congressional Pay Raises",
    ratified: "May 7, 1992",
    text: "No law, varying the compensation for the services of the Senators and Representatives, shall take effect, until an election of Representatives shall have intervened.",
  },
];
