import {
  MolecularStructure,
  RetrosyntheticStep,
  Synthon,
  SyntheticEquivalent,
  DisconnectionType,
  ChemAtom,
  ChemBond,
} from '../types/chemistry';

export interface DisconnectionCandidate {
  id: string;
  bondId?: string;
  type: DisconnectionType;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  strategicScore: number; // 1-100 (higher = more strategic according to Corey rules)
  step: RetrosyntheticStep;
}

/**
 * Offline Retrosynthetic Disconnection Engine
 * Runs completely in-browser without external network calls.
 */
export function analyzeDisconnections(structure: MolecularStructure): DisconnectionCandidate[] {
  const candidates: DisconnectionCandidate[] = [];
  const atoms = structure.atoms || [];
  const bonds = structure.bonds || [];

  const atomMap = new Map<string, ChemAtom>();
  atoms.forEach((a) => atomMap.set(a.id, a));

  // 1. Scan for Ester bonds: C(=O)-O-C
  bonds.forEach((bond) => {
    const a1 = atomMap.get(bond.source);
    const a2 = atomMap.get(bond.target);
    if (!a1 || !a2) return;

    // Check if bond is C - O where C is a carbonyl carbon
    let carbonylC: ChemAtom | null = null;
    let esterO: ChemAtom | null = null;

    if (a1.element === 'C' && (a2.element === 'O' || a2.label?.includes('O'))) {
      carbonylC = a1;
      esterO = a2;
    } else if (a2.element === 'C' && (a1.element === 'O' || a1.label?.includes('O'))) {
      carbonylC = a2;
      esterO = a1;
    }

    if (carbonylC && esterO && bond.type === 'single') {
      // Check if carbonylC has a double bond to an Oxygen
      const hasDoubleO = bonds.some((b) => {
        if (b.id === bond.id) return false;
        const otherId = b.source === carbonylC!.id ? b.target : b.target === carbonylC!.id ? b.source : null;
        if (!otherId) return false;
        const otherAtom = atomMap.get(otherId);
        return otherAtom && otherAtom.element === 'O' && b.type === 'double';
      });

      if (hasDoubleO) {
        // We found an ester acyl-oxygen bond!
        candidates.push({
          id: `disc_ester_${bond.id}`,
          bondId: bond.id,
          type: 'C-O_ester',
          titleVi: 'Phân cắt Este C-O (Ester Disconnection)',
          titleEn: 'Ester C-O Disconnection',
          descriptionVi:
            'Phân cắt liên kết este thành Synthon acyl [R-C⁺=O] (a¹) và Synthon alkoxit/phenoxit [R\'-O⁻] (d¹). Đây là phân cắt có độ tin cậy cực cao và dễ thực hiện nhất.',
          strategicScore: 95,
          step: {
            id: `step_ester_${bond.id}`,
            stepNumber: 1,
            targetId: structure.id,
            targetName: structure.name,
            disconnectionType: 'C-O_ester',
            typeLabelVi: 'Phân cắt liên kết Este C-O',
            typeLabelEn: 'Ester C-O Disconnection',
            bondCleavedDescriptionVi: 'Phân cắt liên kết este acyl-oxy giữa carbonyl và oxy ether.',
            synthons: [
              {
                id: 'syn_acyl',
                name: 'Acyl cation [R-C⁺=O]',
                formula: 'R-CO⁺',
                polarity: 'electrophilic',
                coreyNotation: 'a¹',
                charge: '+',
                descriptionVi: 'Synthon ái điện tử a¹ trên carbon carbonyl.',
                descriptionEn: 'Electrophilic a1 synthon.',
                structure: {
                  id: 'str_syn_acyl',
                  name: 'Synthon R-CO⁺',
                  formula: 'R-CO⁺',
                  molecularWeight: 43.0,
                  polarity: 'a',
                  synthonOrder: 1,
                  atoms: [
                    { id: 'sa1', element: 'C', x: 80, y: 80, label: 'R' },
                    { id: 'sa2', element: 'C', x: 120, y: 80, charge: 1 },
                    { id: 'sa3', element: 'O', x: 150, y: 55, label: '=O' },
                  ],
                  bonds: [
                    { id: 'sb1', source: 'sa1', target: 'sa2', type: 'single' },
                    { id: 'sb2', source: 'sa2', target: 'sa3', type: 'double' },
                  ],
                },
                syntheticEquivalents: [
                  {
                    id: 'eq_acid_anhydride',
                    name: 'Acid Anhydride',
                    nameVi: 'Anhydrit Axit (RCO)₂O',
                    formula: '(RCO)₂O',
                    commercialAvailability: 'very_cheap',
                    approximateCostVi: 'Rất rẻ',
                    notesVi: 'Tác nhân acyl hóa êm dịu, không sinh khói acid HCl.',
                  },
                  {
                    id: 'eq_acid_chloride',
                    name: 'Acyl Chloride',
                    nameVi: 'Axyl Clorua (R-COCl)',
                    formula: 'R-COCl',
                    commercialAvailability: 'readily_available',
                    approximateCostVi: 'Phổ biến',
                    notesVi: 'Tác nhân acyl hóa hoạt tính cao nhất, cần thêm bazơ để bẫy HCl.',
                  },
                  {
                    id: 'eq_carboxylic_acid',
                    name: 'Carboxylic Acid',
                    nameVi: 'Axit Carboxylic (R-COOH)',
                    formula: 'R-COOH',
                    commercialAvailability: 'very_cheap',
                    approximateCostVi: 'Cực kỳ sẵn có',
                    notesVi: 'Dùng cho phản ứng este hóa Fischer với xúc tác axit H₂SO₄.',
                  },
                ],
              },
              {
                id: 'syn_alkoxy',
                name: 'Alkoxide / Phenoxide [R\'-O⁻]',
                formula: 'R\'-O⁻',
                polarity: 'nucleophilic',
                coreyNotation: 'd¹',
                charge: '-',
                descriptionVi: 'Synthon ái nhân d¹ tại nguyên tử oxy mang điện tích âm.',
                descriptionEn: 'Nucleophilic d1 synthon.',
                structure: {
                  id: 'str_syn_alkoxy',
                  name: 'Synthon R\'-O⁻',
                  formula: 'R\'-O⁻',
                  molecularWeight: 31.0,
                  polarity: 'd',
                  synthonOrder: 1,
                  atoms: [
                    { id: 'so1', element: 'C', x: 80, y: 80, label: 'R\'' },
                    { id: 'so2', element: 'O', x: 120, y: 80, label: '-O⁻', charge: -1 },
                  ],
                  bonds: [{ id: 'sob1', source: 'so1', target: 'so2', type: 'single' }],
                },
                syntheticEquivalents: [
                  {
                    id: 'eq_alcohol',
                    name: 'Alcohol / Phenol',
                    nameVi: 'Ancol hoặc Phenol tương ứng (R\'-OH)',
                    formula: 'R\'-OH',
                    commercialAvailability: 'very_cheap',
                    approximateCostVi: 'Rất rẻ',
                    notesVi: 'Thuốc thử trực tiếp trong phòng thí nghiệm.',
                  },
                ],
              },
            ],
            precursors: [],
            forwardReaction: {
              nameVi: 'Phản ứng Este hóa (Fischer hoặc Ghép nối Steglich)',
              nameEn: 'Esterification (Fischer or Steglich)',
              reagents: 'Axit Carboxylic + Ancol (hoặc Axyl Clorua + Ancol/bazơ)',
              catalyst: 'H₂SO₄ đặc hoặc DCC/DMAP',
              solvent: 'Ancol dư hoặc CH₂Cl₂ (DCM)',
              temperature: '60 - 80 °C (Fischer) hoặc nhiệt độ phòng 25 °C (DCC)',
              duration: '30 - 90 phút',
              typicalYield: 88,
              mechanismVi:
                'Cộng ái nhân của ancol vào carbon carbonyl đã được hoạt hóa, chuyển vị proton và tách phân tử nước.',
              byproducts: 'Nước (H₂O) hoặc muối pyridinium chloride',
              safetyNotesVi: 'Phản ứng tỏa nhiệt khi dùng SOCl₂ hoặc H₂SO₄ đậm đặc.',
            },
            atomEconomyPercent: 86.0,
            strategicImportanceVi: 'Phân cắt liên kết este đơn giản hóa phân tử thành hai phân mảnh độc lập nhỏ hơn.',
          },
        });
      }
    }
  });

  // 2. Scan for Amide bonds: C(=O)-N
  bonds.forEach((bond) => {
    const a1 = atomMap.get(bond.source);
    const a2 = atomMap.get(bond.target);
    if (!a1 || !a2) return;

    let carbonylC: ChemAtom | null = null;
    let amideN: ChemAtom | null = null;

    if (a1.element === 'C' && (a2.element === 'N' || a2.label?.includes('N'))) {
      carbonylC = a1;
      amideN = a2;
    } else if (a2.element === 'C' && (a1.element === 'N' || a1.label?.includes('N'))) {
      carbonylC = a2;
      amideN = a1;
    }

    if (carbonylC && amideN && bond.type === 'single') {
      const hasDoubleO = bonds.some((b) => {
        if (b.id === bond.id) return false;
        const otherId = b.source === carbonylC!.id ? b.target : b.target === carbonylC!.id ? b.source : null;
        if (!otherId) return false;
        const otherAtom = atomMap.get(otherId);
        return otherAtom && otherAtom.element === 'O' && b.type === 'double';
      });

      if (hasDoubleO) {
        candidates.push({
          id: `disc_amide_${bond.id}`,
          bondId: bond.id,
          type: 'C-N_amide',
          titleVi: 'Phân cắt Amit C-N (Amide Disconnection)',
          titleEn: 'Amide C-N Disconnection',
          descriptionVi:
            'Phân cắt liên kết amit thành dẫn xuất axit carboxylic [R-CO⁺] (a¹) và amin [R\'-NH⁻] (d¹). Phản ứng ghép tạo amit có hiệu suất định lượng trong hóa dược.',
          strategicScore: 92,
          step: {
            id: `step_amide_${bond.id}`,
            stepNumber: 1,
            targetId: structure.id,
            targetName: structure.name,
            disconnectionType: 'C-N_amide',
            typeLabelVi: 'Phân cắt liên kết Amit C-N',
            typeLabelEn: 'Amide C-N Disconnection',
            bondCleavedDescriptionVi: 'Phân cắt liên kết amit giữa carbon carbonyl và nguyên tử nitơ.',
            synthons: [
              {
                id: 'syn_amide_acyl',
                name: 'Acyl synthon [R-CO⁺]',
                formula: 'R-CO⁺',
                polarity: 'electrophilic',
                coreyNotation: 'a¹',
                charge: '+',
                descriptionVi: 'Synthon a¹ trên carbon carbonyl.',
                descriptionEn: 'Electrophilic a1 synthon.',
                structure: {
                  id: 'str_syn_am_acyl',
                  name: 'R-CO⁺',
                  formula: 'R-CO⁺',
                  molecularWeight: 43.0,
                  polarity: 'a',
                  synthonOrder: 1,
                  atoms: [
                    { id: 'aa1', element: 'C', x: 80, y: 80, label: 'R' },
                    { id: 'aa2', element: 'C', x: 120, y: 80, charge: 1 },
                    { id: 'aa3', element: 'O', x: 150, y: 55, label: '=O' },
                  ],
                  bonds: [
                    { id: 'aab1', source: 'aa1', target: 'aa2', type: 'single' },
                    { id: 'aab2', source: 'aa2', target: 'aa3', type: 'double' },
                  ],
                },
                syntheticEquivalents: [
                  {
                    id: 'eq_acyl_halide',
                    name: 'Acyl Chloride',
                    nameVi: 'Axyl Clorua (R-COCl) hoặc R-COOH + EDC/HOBt',
                    formula: 'R-COCl',
                    commercialAvailability: 'readily_available',
                    approximateCostVi: 'Phổ biến',
                    notesVi: 'Tác nhân ghép peptid hoặc tổng hợp amit trực tiếp.',
                  },
                ],
              },
              {
                id: 'syn_amine_donor',
                name: 'Amine synthon [R\'-NR\'\'⁻]',
                formula: 'R\'-NH⁻',
                polarity: 'nucleophilic',
                coreyNotation: 'd¹',
                charge: '-',
                descriptionVi: 'Synthon ái nhân d¹ tại nguyên tử nitơ.',
                descriptionEn: 'Nucleophilic d1 amine synthon.',
                structure: {
                  id: 'str_syn_am_donor',
                  name: 'R\'-NH⁻',
                  formula: 'R\'-NH⁻',
                  molecularWeight: 30.0,
                  polarity: 'd',
                  synthonOrder: 1,
                  atoms: [
                    { id: 'an1', element: 'C', x: 80, y: 80, label: 'R\'' },
                    { id: 'an2', element: 'N', x: 120, y: 80, label: '-NH⁻', charge: -1 },
                  ],
                  bonds: [{ id: 'anb1', source: 'an1', target: 'an2', type: 'single' }],
                },
                syntheticEquivalents: [
                  {
                    id: 'eq_amine_free',
                    name: 'Free Amine',
                    nameVi: 'Amin tự do (R\'-NH₂ hoặc R\'R\'\'NH)',
                    formula: 'R\'-NH₂',
                    commercialAvailability: 'very_cheap',
                    approximateCostVi: 'Rất rẻ',
                    notesVi: 'Thuốc thử thương mại phổ biến.',
                  },
                ],
              },
            ],
            precursors: [],
            forwardReaction: {
              nameVi: 'Phản ứng Ghép nối tạo Amit (Schotten-Baumann hoặc EDC/HOBt)',
              nameEn: 'Amide Coupling',
              reagents: 'R-COCl + R\'-NH₂ + Et₃N (hoặc R-COOH + EDC + HOBt)',
              catalyst: 'DMAP (vài mol%)',
              solvent: 'Dichloromethane (DCM) hoặc DMF',
              temperature: '0 - 25 °C',
              duration: '1 - 2 giờ',
              typicalYield: 92,
              mechanismVi:
                'Nguyên tử N của amin tấn công ái nhân vào carbonyl của dẫn xuất axit được hoạt hóa, tạo trung gian tứ diện và tách ion clorua hoặc chất hoạt hóa.',
              byproducts: 'Triethylammonium chloride [Et₃NH⁺ Cl⁻]',
            },
            atomEconomyPercent: 82.5,
            strategicImportanceVi: 'Tạo khung liên kết amit sinh học và dược dụng hàng đầu.',
          },
        });
      }
    }
  });

  // 3. Scan for Aromatic C-C (Friedel-Crafts)
  bonds.forEach((bond) => {
    const a1 = atomMap.get(bond.source);
    const a2 = atomMap.get(bond.target);
    if (!a1 || !a2) return;

    let aromaticC: ChemAtom | null = null;
    let carbonylC: ChemAtom | null = null;

    if (a1.element === 'C' && a2.element === 'C' && bond.type === 'single') {
      const a1IsAro = bonds.some((b) => (b.source === a1.id || b.target === a1.id) && b.type === 'aromatic');
      const a2HasDoubleO = bonds.some((b) => {
        const oId = b.source === a2.id ? b.target : b.target === a2.id ? b.source : null;
        const oAtom = oId ? atomMap.get(oId) : null;
        return oAtom && oAtom.element === 'O' && b.type === 'double';
      });

      if (a1IsAro && a2HasDoubleO) {
        aromaticC = a1;
        carbonylC = a2;
      }
    }

    if (aromaticC && carbonylC) {
      candidates.push({
        id: `disc_fc_${bond.id}`,
        bondId: bond.id,
        type: 'C-C_friedel_crafts',
        titleVi: 'Phân cắt Friedel-Crafts Acyl hóa (Ar-C Disconnection)',
        titleEn: 'Friedel-Crafts Acylation',
        descriptionVi:
          'Phân cắt liên kết giữa vòng benzen và carbon carbonyl thành hợp chất thơm Ar-H (d¹) và ion acylium [R-CO⁺] (a¹).',
        strategicScore: 88,
        step: {
          id: `step_fc_${bond.id}`,
          stepNumber: 1,
          targetId: structure.id,
          targetName: structure.name,
          disconnectionType: 'C-C_friedel_crafts',
          typeLabelVi: 'Phân cắt Friedel-Crafts Acyl hóa',
          typeLabelEn: 'Friedel-Crafts Acylation',
          bondCleavedDescriptionVi: 'Phân cắt liên kết C-C nối trực tiếp nhân thơm và nhóm carbonyl.',
          synthons: [],
          precursors: [],
          forwardReaction: {
            nameVi: 'Phản ứng Friedel-Crafts Acyl hóa',
            nameEn: 'Friedel-Crafts Acylation',
            reagents: 'Ar-H + R-COCl',
            catalyst: 'AlCl₃ khan (1.1 đương lượng)',
            solvent: 'Dichloromethane hoặc Nitrobenzene',
            temperature: '0 - 40 °C',
            duration: '2 giờ',
            typicalYield: 85,
            mechanismVi:
              'Xúc tác AlCl₃ tạo phức với acyl chloride sinh cation acylium bền [R-C⁺=O]. Ion này thực hiện phản ứng thế ái điện tử SEAr vào nhân thơm.',
            byproducts: 'Khí HCl',
          },
          atomEconomyPercent: 78.0,
          strategicImportanceVi: 'Gắn nhóm acyl vào nhân thơm mà không bị đồng phân chuyển vị như ankyl hóa.',
        },
      });
    }
  });

  // 4. Scan for Nitro groups on aromatic ring (FGI / Nitration)
  atoms.forEach((atom) => {
    if (atom.label === 'NO₂' || atom.label === '-NO₂' || atom.label === 'O₂N-') {
      candidates.push({
        id: `disc_nitration_${atom.id}`,
        type: 'SEAr_nitration',
        titleVi: 'Phân cắt SEAr: Nitro hóa vòng thơm',
        titleEn: 'SEAr Nitration Disconnection',
        descriptionVi:
          'Phân cắt nhóm nitro (-NO₂) về hợp chất thơm cơ bản và tác nhân nitro hóa hỗn hợp axit nitric/sunfuric.',
        strategicScore: 85,
        step: {
          id: `step_nitration_${atom.id}`,
          stepNumber: 1,
          targetId: structure.id,
          targetName: structure.name,
          disconnectionType: 'SEAr_nitration',
          typeLabelVi: 'Nitro hóa nhân thơm (SEAr)',
          typeLabelEn: 'Aromatic Nitration',
          bondCleavedDescriptionVi: 'Phân cắt liên kết C-NO₂ đưa về tiền chất thơm Ar-H.',
          synthons: [],
          precursors: [],
          forwardReaction: {
            nameVi: 'Phản ứng Nitro hóa SEAr',
            nameEn: 'Electrophilic Aromatic Nitration',
            reagents: 'Ar-H + HNO₃ đặc / H₂SO₄ đặc (axit sunfonitric)',
            catalyst: 'H₂SO₄',
            solvent: 'Không cần hoặc H₂SO₄ đóng vai trò dung môi',
            temperature: '20 - 55 °C',
            duration: '1 giờ',
            typicalYield: 80,
            mechanismVi:
              'H₂SO₄ proton hóa HNO₃ giải phóng ion nitronium (NO₂⁺) ái điện tử cực mạnh, tấn công vào đám mây pi thơm.',
            byproducts: 'H₂O',
          },
          atomEconomyPercent: 85.0,
          strategicImportanceVi: 'Phương pháp nền tảng đưa nguyên tử nitơ vào vòng benzen.',
        },
      });
    }
  });

  // 5. Scan for Primary/Secondary Alcohols (Retro-Grignard or FGI reduction)
  atoms.forEach((atom) => {
    if (atom.label === 'OH' || atom.label === '-OH' || atom.label === 'HO-') {
      candidates.push({
        id: `disc_alcohol_${atom.id}`,
        type: 'C-C_grignard',
        titleVi: 'Phân cắt C-C Ancol (Retro-Grignard / Carbonyl Addition)',
        titleEn: 'Retro-Grignard Disconnection',
        descriptionVi:
          'Phân cắt một liên kết C-C tại carbon mang nhóm -OH, chuyển nhóm ancol về carbonyl (aldehyd/ceton) và mảnh còn lại thành thuốc thử Grignard (R-MgBr).',
        strategicScore: 86,
        step: {
          id: `step_alcohol_${atom.id}`,
          stepNumber: 1,
          targetId: structure.id,
          targetName: structure.name,
          disconnectionType: 'C-C_grignard',
          typeLabelVi: 'Phân cắt Retro-Grignard',
          typeLabelEn: 'Retro-Grignard Disconnection',
          bondCleavedDescriptionVi: 'Phân cắt liên kết C-C liền kề carbon mang nhóm hydroxy -OH.',
          synthons: [],
          precursors: [],
          forwardReaction: {
            nameVi: 'Phản ứng cộng Grignard vào Carbonyl',
            nameEn: 'Grignard Carbonyl Addition',
            reagents: 'Hợp chất carbonyl + R-MgBr trong THF/Et₂O, sau đó thủy phân NH₄Cl/H₂O',
            catalyst: 'Không cần',
            solvent: 'Dietyl ete hoặc THF khan tuyệt đối',
            temperature: '0 - 25 °C',
            duration: '1 giờ',
            typicalYield: 90,
            mechanismVi:
              'Carbanion R⁻ của thuốc thử Grignard tấn công vào carbon carbonyl mang điện tích dương tạo muối alkoxit.',
            byproducts: 'Mg(OH)Br',
          },
          atomEconomyPercent: 78.0,
          strategicImportanceVi: 'Tạo liên kết C-C mới kèm theo nhóm chức ancol linh hoạt.',
        },
      });
    }
  });

  // Sort candidates by strategic priority score
  return candidates.sort((a, b) => b.strategicScore - a.strategicScore);
}
