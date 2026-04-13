import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-heading font-bold text-primary-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Political Glossary
          </h1>
          <p className="text-primary-foreground/60 text-sm mt-1">
            Key terms and definitions to help you stay informed
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-4 pb-24 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card shadow-card"
          />
        </div>

        {/* Category pills */}
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

        {/* Terms */}
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
      </div>
    </div>
  );
};

export default Glossary;
