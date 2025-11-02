// Données d'exemple pour l'analyse des écarts
export const ecartsSampleData = {
  company: "ATLAS",
  products: [
    {
      nom: "Produit P1",
      quantitePrevu: 15000,
      prixPrevu: 180,
      quantiteRealise: 12000,
      prixRealise: 195,
      coutStandard: 60,
    },
    {
      nom: "Produit P2",
      quantitePrevu: 45000,
      prixPrevu: 330,
      quantiteRealise: 51000,
      prixRealise: 294,
      coutStandard: 105,
    },
    {
      nom: "Produit P3",
      quantitePrevu: 27500,
      prixPrevu: 330,
      quantiteRealise: 22000,
      prixRealise: 357,
      coutStandard: 220,
    },
    {
      nom: "Produit P4",
      quantitePrevu: 82500,
      prixPrevu: 605,
      quantiteRealise: 93500,
      prixRealise: 539,
      coutStandard: 385,
    },
  ],
}

// Données d'exemple pour l'optimisation des prix
export const optimisationPrixSampleData = {
  company: "BRITOOLS",
  prixVente: 135,
  coutVariable: 75,
  chargesFixes: 300000,
  quantite: 30000,
  elasticite: -1.5,
}

// Données d'exemple pour l'analyse de l'impact des variations de prix
export const variationPrixSampleData = {
  company: "TEXTLUXE",
  prixVente: 1800,
  coutVariable: 1200,
  chargesFixes: 300000,
  quantiteNormale: 1500,
  quantiteMaximale: 1875,
  elasticite: -2,
}

// Données d'exemple pour le budget des ventes
export const budgetVentesSampleData = {
  company: "Aliments DHM",
  maroc: {
    produit1: {
      trimestre1: 1050,
      trimestre2: 1200,
      trimestre3: 1500,
      trimestre4: 1350,
    },
    produit2: {
      trimestre1: 1800,
      trimestre2: 2250,
      trimestre3: 2400,
      trimestre4: 2100,
    },
    produit3: {
      trimestre1: 5700,
      trimestre2: 6750,
      trimestre3: 8100,
      trimestre4: 6900,
    },
  },
  etranger: {
    produit1: {
      trimestre1: 600,
      trimestre2: 750,
      trimestre3: 1050,
      trimestre4: 900,
    },
    produit2: {
      trimestre1: 1050,
      trimestre2: 1350,
      trimestre3: 1500,
      trimestre4: 1200,
    },
    produit3: {
      trimestre1: 3000,
      trimestre2: 3900,
      trimestre3: 4950,
      trimestre4: 3900,
    },
  },
}
