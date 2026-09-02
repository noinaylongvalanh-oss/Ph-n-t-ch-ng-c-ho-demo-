/**
 * Types and interfaces for the RetroSynth organic retrosynthesis engine
 */

export type BondType = 'single' | 'double' | 'triple' | 'aromatic' | 'wedge' | 'dash';

export interface ChemAtom {
  id: string;
  element: 'C' | 'H' | 'O' | 'N' | 'S' | 'P' | 'Cl' | 'Br' | 'F' | 'I';
  x: number;
  y: number;
  charge?: number; // +1, -1
  radical?: boolean;
  label?: string; // e.g. "OH", "NH2", "COOH"
  implicitHydrogens?: number;
}

export interface ChemBond {
  id: string;
  source: string; // Atom ID
  target: string; // Atom ID
  type: BondType;
  isCleaved?: boolean; // Highlighted as retrosynthetic disconnection site
  label?: string;
  isCleavageSite?: boolean;
  cleavageLabel?: string;
}

export interface MolecularStructure {
  id: string;
  name: string;
  iupacName?: string;
  formula: string;
  molecularWeight: number;
  smiles?: string;
  atoms: ChemAtom[];
  bonds: ChemBond[];
  width?: number;
  height?: number;
  description?: string;
  role?: 'target' | 'intermediate' | 'synthon' | 'synthetic_equivalent' | 'starting_material';
  polarity?: 'a' | 'd' | 'neutral'; // Acceptor (+) or Donor (-)
  synthonOrder?: number; // e.g., 1 for a1, 2 for d2
}

export interface Synthon {
  id: string;
  name: string;
  formula: string;
  polarity: 'electrophilic' | 'nucleophilic'; // Acceptor (a) or Donor (d)
  coreyNotation: string; // e.g., "a¹", "d²", "a³"
  charge: '+' | '-';
  descriptionVi: string;
  descriptionEn: string;
  structure: MolecularStructure;
  syntheticEquivalents: SyntheticEquivalent[];
}

export interface SyntheticEquivalent {
  id: string;
  name: string;
  nameVi: string;
  formula: string;
  structure?: MolecularStructure;
  casNumber?: string;
  commercialAvailability: 'very_cheap' | 'readily_available' | 'custom_synthesis';
  approximateCostVi: string;
  notesVi: string;
}

export type DisconnectionType =
  | 'C-O_ester'
  | 'C-N_amide'
  | 'C-O_ether'
  | 'C-C_aldol'
  | 'C-C_claisen'
  | 'C-C_michael'
  | 'C=C_wittig'
  | 'C-C_grignard'
  | 'C-C_friedel_crafts'
  | 'C-C_diels_alder'
  | 'C-X_halogenation'
  | 'SEAr_nitration'
  | 'SEAr_sulfonation'
  | 'FGI_oxidation'
  | 'FGI_reduction'
  | 'FGI_hydrolysis'
  | 'FGI_substitution';

export interface RetrosyntheticStep {
  id: string;
  stepNumber: number;
  targetId: string;
  targetName: string;
  disconnectionType: DisconnectionType;
  typeLabelVi: string;
  typeLabelEn: string;
  bondCleavedDescriptionVi: string;
  synthons: Synthon[];
  precursors: MolecularStructure[];
  forwardReaction: {
    nameVi: string;
    nameEn: string;
    reagents: string;
    catalyst?: string;
    solvent?: string;
    temperature?: string;
    duration?: string;
    typicalYield: number; // e.g. 88%
    mechanismVi: string;
    byproducts?: string;
    safetyNotesVi?: string;
    greenChemistryNotesVi?: string;
  };
  atomEconomyPercent: number;
  strategicImportanceVi: string;
}

export interface RetrosyntheticRoute {
  id: string;
  name: string;
  nameVi: string;
  routeType: 'industrial' | 'greener' | 'academic' | 'classic';
  isDefault?: boolean;
  totalSteps: number;
  overallYieldEstimate: number;
  startingMaterials: string[];
  advantagesVi: string[];
  drawbacksVi: string[];
  steps: RetrosyntheticStep[];
}

export interface TargetMoleculeEntry {
  id: string;
  name: string;
  nameVi: string;
  category: 'pharmaceutical' | 'flavor_fragrance' | 'polymer_precursor' | 'agrochemical' | 'academic';
  categoryLabelVi: string;
  categoryVi?: string;
  functionalGroupsVi?: string[];
  formula: string;
  molecularWeight: number;
  iupacName: string;
  casNumber: string;
  descriptionVi: string;
  structure: MolecularStructure;
  routes: RetrosyntheticRoute[];
  historicalContextVi: string;
  safetyClassVi: string;
}

export interface OrganicReactionRef {
  id: string;
  name: string;
  nameVi: string;
  type: string;
  retroPattern: string;
  forwardEquation: string;
  reagents: string;
  mechanismSummaryVi: string;
  disconnectionTipVi: string;
  historicalYear?: number;
  discoverer?: string;
}

export interface SynthonRuleRef {
  order: string; // "d¹", "a¹", "d²", "a²", etc.
  type: 'donor' | 'acceptor';
  typeVi: string;
  naturalCharge: string;
  idealizedSynthon: string;
  commonEquivalents: string[];
  typicalReactionsVi: string;
  isUmpolung?: boolean;
  umpolungMethodVi?: string;
}
