import { OrganicReactionRef } from '../types/chemistry';

export const ORGANIC_REACTIONS: OrganicReactionRef[] = [
  {
    id: 'aldol',
    name: 'Aldol Reaction & Condensation',
    nameVi: 'Phản ứng Ngưng tụ Aldol',
    type: 'C-C Bond (1,3-Difunctional)',
    retroPattern: 'R-CH(OH)-CH₂-COR  ===>  R-CHO  +  CH₃-COR (Ancol beta-hydroxy hoặc enone)',
    forwardEquation: 'R-CHO + R\'-CH₂-COR"  →  R-CH(OH)-CH(R\')-COR"  →  R-CH=C(R\')-COR" + H₂O',
    reagents: 'NaOH hoặc KOH loãng, EtOH, đun nóng (đối với ngưng tụ tách nước)',
    mechanismSummaryVi:
      'Bazơ tách proton alpha của hợp chất carbonyl tạo ion enolat nucleophile; enolat tấn công vào nhóm carbonyl của phân tử thứ hai tạo beta-hydroxy aldehyde/ketone (aldol). Đun nóng sẽ tách nước tạo dẫn xuất alpha,beta-không no.',
    disconnectionTipVi:
      'Khi nhìn thấy hợp chất 1,3-hydroxy carbonyl hoặc enone alpha,beta-không no, phân cắt liên kết giữa C-alpha và C-beta.',
    historicalYear: 1872,
    discoverer: 'Charles-Adolphe Wurtz & Aleksandr Borodin',
  },
  {
    id: 'claisen',
    name: 'Claisen Condensation',
    nameVi: 'Phản ứng Ngưng tụ Claisen',
    type: 'C-C Bond (1,3-Dicarbonyl)',
    retroPattern: 'R-CO-CH₂-COOR\'  ===>  R-COOR\'  +  CH₃-COOR\' (Hợp chất beta-ketoeste)',
    forwardEquation: '2 R-CH₂-COOEt + NaOEt  →  R-CH₂-CO-CH(R)-COOEt + EtOH',
    reagents: 'Natri ethoxit (NaOEt) trong EtOH khan, sau đó axit hóa nhẹ bằng HCl loãng',
    mechanismSummaryVi:
      'Alkoxide bứt proton alpha của este tạo enolat ester, tấn công vào phân tử este thứ hai qua cơ chế cộng-tách ái nhân acyl, giải phóng phân tử rượu và tạo thành beta-ketoeste.',
    disconnectionTipVi:
      'Đối với hợp chất 1,3-dicarbonyl (beta-keto este), phân cắt liên kết giữa carbon alpha và carbon carbonyl của nhóm ceton.',
    historicalYear: 1887,
    discoverer: 'Rainer Ludwig Claisen',
  },
  {
    id: 'michael',
    name: 'Michael Addition',
    nameVi: 'Phản ứng Cộng liên hợp Michael',
    type: 'C-C Bond (1,5-Difunctional)',
    retroPattern: 'R-CO-CH₂-CH₂-CH(COOEt)₂  ===>  R-CO-CH=CH₂  +  CH₂(COOEt)₂',
    forwardEquation: 'Michael Acceptor (Enone) + Michael Donor (Enolate)  →  1,5-Dicarbonyl compound',
    reagents: 'Bazơ nhẹ: NEt₃, NaOEt, piperidin hoặc xúc tác chuyển pha',
    mechanismSummaryVi:
      'Nucleophile bền (enolat của malonat, acetoacetat hoặc nitroalkan) tấn công ái nhân theo kiểu cộng 1,4 vào hệ liên hợp của hợp chất carbonyl alpha,beta-không no.',
    disconnectionTipVi:
      'Nhận diện mối liên hệ 1,5-dicarbonyl: luôn phân cắt liên kết C-C giữa C-beta và carbon nucleophile.',
    historicalYear: 1887,
    discoverer: 'Arthur Michael',
  },
  {
    id: 'wittig',
    name: 'Wittig Reaction',
    nameVi: 'Phản ứng Wittig',
    type: 'C=C Bond Formation',
    retroPattern: 'R₁R₂C = CH-R₃  ===>  R₁R₂C=O  +  Ph₃P=CH-R₃ (Ylide photpho)',
    forwardEquation: 'R₂C=O + Ph₃P=CR\'₂  →  R₂C=CR\'₂ + Ph₃P=O',
    reagents: 'Alkyl photphonium halogenua + bazơ mạnh (n-BuLi, NaH hoặc NaHMDS) trong THF khan',
    mechanismSummaryVi:
      'Ylide photpho tấn công nhóm carbonyl của aldehyd hoặc ceton tạo vòng trung gian 4 cạnh oxaphosphetan, sau đó phân rã giải phóng liên kết đôi C=C với hóa học lập thể xác định và triphenylphosphine oxide (Ph₃P=O).',
    disconnectionTipVi:
      'Phân cắt liên kết đôi C=C: biến một đầu thành carbonyl (C=O) và đầu còn lại thành photphonium ylide (hoặc alkyl halide + PPh₃).',
    historicalYear: 1954,
    discoverer: 'Georg Wittig (Giải Nobel Hóa học 1979)',
  },
  {
    id: 'diels_alder',
    name: 'Diels-Alder Cycloaddition',
    nameVi: 'Phản ứng Cộng đóng vòng Diels-Alder [4+2]',
    type: 'Cyclohexene Ring Formation',
    retroPattern: 'Vòng Cyclohexen  ===>  Diene liên hợp (4 pi)  +  Dienophile (2 pi)',
    forwardEquation: '1,3-Diene + Alkene hoạt hóa  →  Cyclohexene derivative',
    reagents: 'Nhiệt độ (nhiệt động) hoặc Axit Lewis (AlCl₃, Sc(OTf)₃, TiCl₄) để hạ nhiệt độ phản ứng',
    mechanismSummaryVi:
      'Phản ứng quang vòng đồng thì (concerted pericyclic [4+2]) giữa 4 electron pi của diene ở cấu dạng s-cis và 2 electron pi của dienophile, tạo ra 2 liên kết sigma C-C mới và 1 liên kết pi.',
    disconnectionTipVi:
      'Khi nhìn thấy vòng 6 cạnh chứa 1 liên kết đôi (cyclohexene), thực hiện phân cắt retro-Diels-Alder bằng cách di chuyển các mũi tên tròn ngược chiều kim đồng hồ để tìm ra diene và dienophile.',
    historicalYear: 1928,
    discoverer: 'Otto Diels & Kurt Alder (Giải Nobel Hóa học 1950)',
  },
  {
    id: 'grignard',
    name: 'Grignard Reaction',
    nameVi: 'Phản ứng Grignard (Cộng hợp chất cơ magie)',
    type: 'C-C Bond (Alcohol Synthesis)',
    retroPattern: 'R₁R₂C(OH)-R₃  ===>  R₁R₂C=O  +  R₃-MgBr',
    forwardEquation: 'R-MgX + R\'-CHO  →  R\'-CH(OMgX)-R  →  R\'-CH(OH)-R + Mg(OH)X',
    reagents: 'Alkyl/Aryl magie halogenua (RMgX) trong ete khan (Et₂O hoặc THF), sau đó thủy phân bằng NH₄Cl/H₂O',
    mechanismSummaryVi:
      'Hợp chất cơ magie đóng vai trò carbanion mạnh (synthon d¹), tấn công ái nhân vào carbon carbonyl (synthon a¹), sau đó proton hóa dung dịch muối alkoxit tạo ancol tương ứng.',
    disconnectionTipVi:
      'Phân cắt liên kết C-C nối trực tiếp vào carbon mang nhóm -OH. Carbon mang nhóm -OH trước đó là carbonyl (aldehyd cho ancol bậc 2, ceton cho ancol bậc 3, fomandehyd cho ancol bậc 1).',
    historicalYear: 1900,
    discoverer: 'Victor Grignard (Giải Nobel Hóa học 1912)',
  },
  {
    id: 'friedel_crafts',
    name: 'Friedel-Crafts Acylation',
    nameVi: 'Phản ứng Friedel-Crafts Acyl hóa',
    type: 'Aromatic C-C Bond',
    retroPattern: 'Ar-CO-R  ===>  Ar-H  +  R-COCl (hoặc (RCO)₂O)',
    forwardEquation: 'Ar-H + R-COCl + AlCl₃  →  Ar-CO-R + HCl + AlCl₃',
    reagents: 'Acyl clorua hoặc anhydrit axit, xúc tác AlCl₃ khan hoặc FeCl₃, BF₃',
    mechanismSummaryVi:
      'Xúc tác AlCl₃ rút ion clorua tạo ion acylium cộng hưởng bền [R-C⁺=O]. Ion này tấn công ái điện tử vào nhân thơm (SEAr), tạo phức sigma sau đó bứt proton phục hồi tính thơm.',
    disconnectionTipVi:
      'Phân cắt liên kết giữa vòng thơm Ar và carbon carbonyl C=O. Khác với ankyl hóa, phản ứng acyl hóa KHÔNG bị chuyển vị carbocation và KHÔNG bị đa thế.',
    historicalYear: 1877,
    discoverer: 'Charles Friedel & James Crafts',
  },
  {
    id: 'williamson',
    name: 'Williamson Ether Synthesis',
    nameVi: 'Tổng hợp Ete Williamson',
    type: 'C-O Ether Bond',
    retroPattern: 'R-O-R\'  ===>  R-O⁻ (Alkoxide/Phenoxide)  +  R\'-X (Alkyl halide bậc 1)',
    forwardEquation: 'R-ONa + R\'-Br  →  R-O-R\' + NaBr',
    reagents: 'Rượu + NaH hoặc K₂CO₃ trong DMF/axeton, sau đó thêm alkyl halogenua bậc 1 hoặc tosylate',
    mechanismSummaryVi:
      'Phản ứng thế ái nhân lưỡng phân tử SN2 kinh điển: ion alkoxit (R-O⁻) tấn công vào carbon mang halogen của alkyl halogenua bậc 1, đẩy nhóm thế đi ra.',
    disconnectionTipVi:
      'Phân cắt liên kết C-O ở phía gốc alkyl ít cản trở không gian hơn (alkyl bậc 1 hoặc methyl) để phản ứng thế SN2 chiếm ưu thế tuyệt đối so với phản ứng tách E2.',
    historicalYear: 1850,
    discoverer: 'Alexander William Williamson',
  },
  {
    id: 'reductive_amination',
    name: 'Reductive Amination',
    nameVi: 'Amin hóa khử (Tổng hợp Amin từ Carbonyl)',
    type: 'C-N Amine Bond',
    retroPattern: 'R₁-CH₂-NH-R₂  ===>  R₁-CHO  +  H₂N-R₂',
    forwardEquation: 'R₂C=O + R\'-NH₂  →  [R₂C=N-R\'] + NaBH₃CN  →  R₂CH-NH-R\'',
    reagents: 'Hợp chất carbonyl + amin, tác nhân khử chọn lọc NaBH₃CN hoặc NaBH(OAc)₃ trong MeOH/DCE',
    mechanismSummaryVi:
      'Amin ngưng tụ với carbonyl tạo imine hoặc ion iminium trung gian trong dung dịch axit yếu (pH ~ 5-6). Tác nhân hydride NaBH₃CN khử chọn lọc imine mà không khử carbonyl tự do.',
    disconnectionTipVi:
      'Phân cắt liên kết C-N của amin: carbon gắn với N được chuyển ngược về carbonyl (aldehyd/ceton) và phân mảnh còn lại là amin bậc thấp hơn.',
    historicalYear: 1971,
    discoverer: 'Borch & Durst',
  },
  {
    id: 'suzuki',
    name: 'Suzuki-Miyaura Cross-Coupling',
    nameVi: 'Ghép mạch Suzuki-Miyaura (Pd-Catalyzed)',
    type: 'C-C Biaryl Coupling',
    retroPattern: 'Ar₁ - Ar₂  ===>  Ar₁-B(OH)₂ (Axit Boronic)  +  Ar₂-Br (Aryl Halide)',
    forwardEquation: 'Ar-B(OH)₂ + Ar\'-X + Pd(PPh₃)₄ + Base (K₂CO₃)  →  Ar-Ar\' + B(OH)₃ + KX',
    reagents: 'Xúc tác Paladi Pd(PPh₃)₄ hoặc Pd(dppf)Cl₂, bazơ K₂CO₃/Cs₂CO₃, hỗn hợp dung môi Toluene/EtOH/H₂O',
    mechanismSummaryVi:
      'Chu trình xúc tác gồm 3 giai đoạn: (1) Cộng oxy hóa (oxidative addition) của Pd vào liên kết Ar-X; (2) Chuyển vị kim loại (transmetalation) với axit boronic hoạt hóa bởi bazơ; (3) Tách hoàn nguyên (reductive elimination) tạo liên kết C-C biaryl và hoàn nguyên Pd(0).',
    disconnectionTipVi:
      'Khi tổng hợp khung biaryl (2 vòng thơm nối trực tiếp), luôn phân cắt liên kết Ar-Ar thành một nửa aryl halide và một nửa axit arylboronic.',
    historicalYear: 1979,
    discoverer: 'Akira Suzuki & Norio Miyaura (Giải Nobel Hóa học 2010)',
  },
];
