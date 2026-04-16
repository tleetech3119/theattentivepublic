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
