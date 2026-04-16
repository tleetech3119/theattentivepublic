import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Scroll, Scale, Shield, Gavel } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PREAMBLE, CONSTITUTION_ARTICLES, BILL_OF_RIGHTS, ADDITIONAL_AMENDMENTS } from "@/data/constitution";
import { SUPREME_COURT_CASES, CASE_CATEGORIES } from "@/data/supremeCourtCases";
import AmendmentTranslator from "@/components/glossary/AmendmentTranslator";
import CaseExplainer from "@/components/glossary/CaseExplainer";

interface Term {
  term: string;
  definition: string;
  category: string;
}

const GLOSSARY_TERMS: Term[] = [
  {
    term: "Midterm Election",
    definition:
      "A general election held near the midpoint of a president's four-year term. All House seats and roughly one-third of Senate seats are up for election.",
    category: "Elections",
  },
  {
    term: "Primary Election",
    definition:
      "An election in which voters choose candidates to represent a political party in the general election.",
    category: "Elections",
  },
  {
    term: "Caucus",
    definition:
      "A meeting of supporters or members of a political party to select candidates or decide policy. Some states use caucuses instead of primaries.",
    category: "Elections",
  },
  {
    term: "Incumbent",
    definition:
      "A person currently holding a political office, especially when running for re-election.",
    category: "Elections",
  },
  {
    term: "Gerrymandering",
    definition:
      "The practice of drawing electoral district boundaries to favor a particular political party or group.",
    category: "Government",
  },
  {
    term: "Filibuster",
    definition:
      "A tactic used in the Senate to delay or block a vote by extending debate. Ending a filibuster requires 60 votes (cloture).",
    category: "Legislation",
  },
  {
    term: "Cloture",
    definition:
      "A procedure used in the Senate to end debate and bring a matter to a vote. Requires a three-fifths majority (60 votes).",
    category: "Legislation",
  },
  {
    term: "Bipartisan",
    definition:
      "Involving cooperation or agreement between two major political parties.",
    category: "Government",
  },
  {
    term: "Appropriations",
    definition:
      "The act of setting aside money for a specific purpose, typically through legislation. Appropriations bills fund government agencies and programs.",
    category: "Legislation",
  },
  {
    term: "Gubernatorial",
    definition: "Relating to the office or role of a state governor.",
    category: "Government",
  },
  {
    term: "Ballot Measure",
    definition:
      "A proposed law or amendment placed on the ballot for voters to approve or reject directly, bypassing the legislature.",
    category: "Elections",
  },
  {
    term: "Whip",
    definition:
      "A party leader in Congress responsible for ensuring party members vote according to the party's position.",
    category: "Government",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(GLOSSARY_TERMS.map((t) => t.category)))];

const Glossary = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [caseSearch, setCaseSearch] = useState("");
  const [activeCaseCategory, setActiveCaseCategory] = useState("All");

  const filteredCases = SUPREME_COURT_CASES.filter((c) => {
    const matchesSearch =
      !caseSearch ||
      c.name.toLowerCase().includes(caseSearch.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(caseSearch.toLowerCase());
    const matchesCategory =
      activeCaseCategory === "All" || c.category === activeCaseCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.year - b.year);

  const filtered = GLOSSARY_TERMS.filter((t) => {
    const matchesSearch =
      !search ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-heading font-bold text-primary-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Civic Library
          </h1>
          <p className="text-primary-foreground/60 text-sm mt-1">
            Key terms, founding documents, and the Bill of Rights — explained
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-4 pb-24">
        <Tabs defaultValue="glossary" className="w-full">
          <TabsList className="grid grid-cols-5 w-full bg-card shadow-card h-auto p-1 gap-0.5">
            <TabsTrigger value="glossary" className="text-[10px] flex flex-col gap-0.5 py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Glossary</span>
            </TabsTrigger>
            <TabsTrigger value="preamble" className="text-[10px] flex flex-col gap-0.5 py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Scroll className="w-3.5 h-3.5" />
              <span>Preamble</span>
            </TabsTrigger>
            <TabsTrigger value="constitution" className="text-[10px] flex flex-col gap-0.5 py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Scale className="w-3.5 h-3.5" />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="bill-of-rights" className="text-[10px] flex flex-col gap-0.5 py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span>Amendments</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="text-[10px] flex flex-col gap-0.5 py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gavel className="w-3.5 h-3.5" />
              <span>Cases</span>
            </TabsTrigger>
          </TabsList>

          {/* Glossary tab */}
          <TabsContent value="glossary" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card shadow-card"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground shadow-card hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filtered.length === 0 && (
                <div className="bg-card rounded-xl p-6 shadow-card text-center text-muted-foreground text-sm">
                  No terms found. Try adjusting your search.
                </div>
              )}
              {filtered.map((t) => (
                <div key={t.term} className="bg-card rounded-xl p-4 shadow-card">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading font-bold text-foreground text-sm">
                      {t.term}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.definition}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Preamble tab */}
          <TabsContent value="preamble" className="space-y-4 mt-4">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Scroll className="w-5 h-5 text-civic-teal" />
                <h2 className="font-heading font-bold text-foreground">{PREAMBLE.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{PREAMBLE.intro}</p>
              <blockquote className="border-l-4 border-civic-teal/40 pl-4 py-2 italic text-sm text-foreground leading-relaxed font-serif">
                "{PREAMBLE.text}"
              </blockquote>
              <AmendmentTranslator title={PREAMBLE.title} text={PREAMBLE.text} />
            </div>
          </TabsContent>

          {/* Constitution tab */}
          <TabsContent value="constitution" className="space-y-3 mt-4">
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-xs text-muted-foreground leading-relaxed">
                The U.S. Constitution is organized into seven Articles that establish the framework of American government.
                Each article below is a condensed summary of its core provisions — tap the translator for plain-English context.
              </p>
            </div>
            {CONSTITUTION_ARTICLES.map((article) => (
              <div key={article.number} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-start justify-between mb-1 gap-2">
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-sm">
                      Article {article.number}: {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{article.summary}</p>
                  </div>
                </div>
                <blockquote className="mt-3 border-l-4 border-civic-teal/30 pl-3 py-1 text-xs text-foreground/90 leading-relaxed font-serif italic">
                  {article.text}
                </blockquote>
                <AmendmentTranslator
                  title={`Article ${article.number}: ${article.title}`}
                  text={article.text}
                />
              </div>
            ))}
          </TabsContent>

          {/* Amendments tab */}
          <TabsContent value="bill-of-rights" className="space-y-3 mt-4">
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-xs text-muted-foreground leading-relaxed">
                All 27 amendments to the U.S. Constitution. The first ten — the <strong className="text-foreground">Bill of Rights</strong> — were ratified December 15, 1791. The remaining 17 were added between 1795 and 1992.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Bill of Rights (1–10)
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {BILL_OF_RIGHTS.map((amendment) => (
              <AmendmentCard key={amendment.number} amendment={amendment} />
            ))}

            <div className="flex items-center gap-2 pt-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Later Amendments (11–27)
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {ADDITIONAL_AMENDMENTS.map((amendment) => (
              <AmendmentCard key={amendment.number} amendment={amendment} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const AmendmentCard = ({ amendment }: { amendment: typeof BILL_OF_RIGHTS[number] }) => (
  <div className="bg-card rounded-xl p-4 shadow-card">
    <div className="flex items-start gap-3 mb-2">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-civic-teal/10 flex items-center justify-center text-civic-teal font-bold text-xs">
        {amendment.romanNumeral}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground text-sm">
          {amendment.number}
          {getOrdinalSuffix(amendment.number)} Amendment
        </h3>
        <p className="text-xs text-muted-foreground">{amendment.shortName}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">Ratified {amendment.ratified}</p>
      </div>
    </div>
    <blockquote className="border-l-4 border-civic-teal/30 pl-3 py-1 text-xs text-foreground/90 leading-relaxed font-serif italic">
      {amendment.text}
    </blockquote>
    <AmendmentTranslator
      title={`${amendment.number}${getOrdinalSuffix(amendment.number)} Amendment — ${amendment.shortName}`}
      text={amendment.text}
    />
  </div>
);

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default Glossary;
