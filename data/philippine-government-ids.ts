import { GovernmentIdData } from "@/components/ui/government-id-card";

export const PHILIPPINE_GOVERNMENT_IDS: GovernmentIdData[] = [
  {
    id: "national-id",
    title: "National ID",
    subtitle: "Republic of the Philippines",
    backgroundColor: "#e0f2fe", // Soft light blue
    textLines: [
      { width: 'medium' }, // Full Name
      { width: 'short' },  // ID Number
      { width: 'long' },   // Address
      { width: 'medium' }, // Birth Date
      { width: 'short' },  // Sex
    ],
  },
  {
    id: "drivers-license",
    title: "Drivers License",
    subtitle: "Land Transportation Office",
    backgroundColor: "#fce4ec", // Soft light pink/red
    textLines: [
      { width: 'medium' }, // Full Name
      { width: 'short' },  // License No.
      { width: 'long' },   // Address
      { width: 'short' },  // Birth Date
      { width: 'medium' }, // Expiry Date
      { width: 'short' },  // Restrictions
    ],
  },
  {
    id: "postal-id",
    title: "Postal ID",
    subtitle: "Philippine Postal Corporation",
    backgroundColor: "#e8f5e8", // Soft light green
    textLines: [
      { width: 'medium' }, // Full Name
      { width: 'short' },  // Postal ID No.
      { width: 'long' },   // Address
      { width: 'short' },  // Birth Date
      { width: 'medium' }, // Issue Date
    ],
  },
  {
    id: "sss-id",
    title: "SSS ID",
    subtitle: "Social Security System",
    backgroundColor: "#f3e5f5", // Soft light purple
    textLines: [
      { width: 'medium' }, // Full Name
      { width: 'short' },  // SS Number
      { width: 'long' },   // Address
      { width: 'short' },  // Birth Date
      { width: 'medium' }, // Issue Date
    ],
  },
  {
    id: "philhealth-id",
    title: "PhilHealth ID",
    subtitle: "Philippine Health Insurance Corporation",
    backgroundColor: "#fff3e0", // Soft light orange
    textLines: [
      { width: 'medium' }, // Full Name
      { width: 'short' },  // PIN
      { width: 'long' },   // Address
      { width: 'short' },  // Birth Date
      { width: 'medium' }, // Member Type
    ],
  },
  {
    id: "pagibig-id",
    title: "Pag-ibig ID",
    subtitle: "Home Development Mutual Fund",
    backgroundColor: "#e0f7fa", // Soft light cyan
    textLines: [
      { width: 'medium' }, // Full Name
      { width: 'short' },  // MID Number
      { width: 'long' },   // Address
      { width: 'short' },  // Birth Date
      { width: 'medium' }, // Issue Date
    ],
  },
];

export const getGovernmentIdById = (id: string): GovernmentIdData | undefined => {
  return PHILIPPINE_GOVERNMENT_IDS.find(idData => idData.id === id);
};

export const getGovernmentIdsByCategory = (category?: string): GovernmentIdData[] => {
  // Future implementation for categorizing IDs
  return PHILIPPINE_GOVERNMENT_IDS;
};