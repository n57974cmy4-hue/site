/* Awrabaya — catalogue du dressing.
   Exemples à remplacer par vos vrais articles. Pour chaque pièce :
     type     : abaya, papillon, kimono, robe, khimar, ensemble ou kaftan (le dessin)
     category : abayas, robes, khimars ou ensembles (les filtres du dressing)
     price    : prix en euros
     colors   : nom et teinte de chaque coloris proposé
     sizes    : tailles proposées */
window.AWRABAYA_CATALOGUE = [
    { id: 'nour', name: 'Abaya Nour', type: 'abaya', category: 'abayas', price: 39.90,
      description: 'Abaya fluide en crêpe, coupe évasée et manches amples, liseré doré sur le devant.',
      colors: [{ name: 'Noir', hex: '#1f1a17' }, { name: 'Taupe', hex: '#8b7262' }, { name: 'Sable', hex: '#d8c3a5' }],
      sizes: ['52', '54', '56', '58', '60'] },
    { id: 'layla', name: 'Abaya papillon Layla', type: 'papillon', category: 'abayas', price: 44.90,
      description: 'Coupe papillon qui tombe en vagues douces, d\'un poignet à l\'autre. Légère et couvrante.',
      colors: [{ name: 'Rose poudré', hex: '#d4a5a0' }, { name: 'Ivoire', hex: '#ece2d2' }, { name: 'Noir', hex: '#1f1a17' }],
      sizes: ['Taille unique'] },
    { id: 'sakina', name: 'Kimono Sakina', type: 'kimono', category: 'abayas', price: 34.90,
      description: 'Kimono ouvert à porter sur une robe ou un ensemble, manches larges et finitions surpiquées.',
      colors: [{ name: 'Camel', hex: '#b08453' }, { name: 'Kaki', hex: '#7d7f62' }, { name: 'Ivoire', hex: '#ece2d2' }],
      sizes: ['S/M', 'L/XL'] },
    { id: 'amira', name: 'Robe plissée Amira', type: 'robe', category: 'robes', price: 32.90,
      description: 'Robe longue à jupe plissée et ceinture assortie. Élégante du quotidien aux grandes occasions.',
      colors: [{ name: 'Sauge', hex: '#8a8f74' }, { name: 'Bleu nuit', hex: '#2c3446' }, { name: 'Bordeaux', hex: '#6e2f35' }],
      sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'safa', name: 'Khimar Safa', type: 'khimar', category: 'khimars', price: 19.90,
      description: 'Khimar long en voile mat, qui couvre la poitrine et le dos. Se porte sans épingle.',
      colors: [{ name: 'Taupe', hex: '#8b7262' }, { name: 'Noir', hex: '#1f1a17' }, { name: 'Beige', hex: '#cdb69a' }, { name: 'Rose poudré', hex: '#d4a5a0' }],
      sizes: ['Taille unique'] },
    { id: 'ines', name: 'Ensemble Inès', type: 'ensemble', category: 'ensembles', price: 49.90,
      description: 'Tunique longue fendue sur les côtés et pantalon large assorti. Confortable toute la journée.',
      colors: [{ name: 'Beige', hex: '#d8c3a5' }, { name: 'Kaki', hex: '#7d7f62' }, { name: 'Noir', hex: '#1f1a17' }],
      sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'yasmine', name: 'Caftan Yasmine', type: 'kaftan', category: 'robes', price: 54.90,
      description: 'Caftan droit et généreux, galon brodé or sur le devant et aux poignets. Pour les jours de fête.',
      colors: [{ name: 'Émeraude', hex: '#2f5b4c' }, { name: 'Bordeaux', hex: '#6e2f35' }, { name: 'Ivoire', hex: '#ece2d2' }],
      sizes: ['S/M', 'L/XL', 'XXL'] },
    { id: 'salma', name: 'Abaya Salma', type: 'abaya', category: 'abayas', price: 36.90,
      description: 'Abaya droite en nida, tombé impeccable, poignets resserrés et liseré contrasté.',
      colors: [{ name: 'Bleu nuit', hex: '#2c3446' }, { name: 'Camel', hex: '#b08453' }, { name: 'Kaki', hex: '#7d7f62' }],
      sizes: ['52', '54', '56', '58', '60'] },
    { id: 'maryam', name: 'Robe Maryam', type: 'robe', category: 'robes', price: 29.90,
      description: 'Robe longue légère, plis fluides et ceinture nouée. Idéale aux beaux jours.',
      colors: [{ name: 'Ivoire', hex: '#ece2d2' }, { name: 'Rose poudré', hex: '#d4a5a0' }, { name: 'Taupe', hex: '#8b7262' }],
      sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'hiba', name: 'Khimar Hiba', type: 'khimar', category: 'khimars', price: 22.90,
      description: 'Khimar extra-long jusqu\'aux genoux, double voile pour une opacité parfaite.',
      colors: [{ name: 'Noir', hex: '#1f1a17' }, { name: 'Bleu nuit', hex: '#2c3446' }, { name: 'Sable', hex: '#d8c3a5' }],
      sizes: ['Taille unique'] }
];
window.AWRABAYA_CATEGORIES = [
    { id: 'all', label: 'Tout' },
    { id: 'abayas', label: 'Abayas' },
    { id: 'robes', label: 'Robes & caftans' },
    { id: 'khimars', label: 'Khimars' },
    { id: 'ensembles', label: 'Ensembles' }
];
