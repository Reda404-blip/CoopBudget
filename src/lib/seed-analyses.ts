import { supabaseAdmin } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export async function seedAnalyses() {
  // First, get some users to associate with the analyses
  const { data: users, error: usersError } = await supabaseAdmin.from("users").select("id").limit(4)

  if (usersError) {
    console.error("Error fetching users:", usersError)
    return
  }

  if (!users || users.length === 0) {
    console.error("No users found to associate with analyses")
    return
  }

  // Sample analyses data
  const analyses = [
    {
      id: uuidv4(),
      title: "Analyse des écarts budgétaires T1 2023",
      description: "Comparaison des valeurs budgétées et réalisées pour le premier trimestre 2023",
      type: "ecarts",
      user_id: users[0].id,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      data: {
        summary: {
          totalBudget: 120000,
          totalActual: 115000,
          variance: -5000,
          variancePercent: -4.17,
        },
        details: [
          { category: "Ventes", budget: 50000, actual: 48000, variance: -2000, variancePercent: -4 },
          { category: "Marketing", budget: 20000, actual: 22000, variance: 2000, variancePercent: 10 },
          { category: "Opérations", budget: 35000, actual: 32000, variance: -3000, variancePercent: -8.57 },
          { category: "Administration", budget: 15000, actual: 13000, variance: -2000, variancePercent: -13.33 },
        ],
      },
      status: "completed",
      is_public: true,
    },
    {
      id: uuidv4(),
      title: "Optimisation des prix produits A et B",
      description: "Simulation d'optimisation des prix pour maximiser la marge",
      type: "optimisation",
      user_id: users[1].id,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      data: {
        products: [
          {
            name: "Produit A",
            currentPrice: 120,
            optimalPrice: 135,
            elasticity: -1.2,
            currentDemand: 1000,
            projectedDemand: 880,
            currentRevenue: 120000,
            projectedRevenue: 118800,
            revenueChange: -1.0,
          },
          {
            name: "Produit B",
            currentPrice: 85,
            optimalPrice: 75,
            elasticity: -1.8,
            currentDemand: 1500,
            projectedDemand: 1770,
            currentRevenue: 127500,
            projectedRevenue: 132750,
            revenueChange: 4.1,
          },
        ],
        summary: {
          totalCurrentRevenue: 247500,
          totalProjectedRevenue: 251550,
          totalRevenueChange: 4050,
          totalRevenueChangePercent: 1.64,
        },
      },
      status: "completed",
      is_public: true,
    },
    {
      id: uuidv4(),
      title: "Tendances des coûts 2022-2023",
      description: "Analyse de l'évolution des coûts sur les 12 derniers mois",
      type: "tendances",
      user_id: users[2].id,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      data: {
        timeSeries: [
          { month: "Jan 2022", matériaux: 12000, maindOeuvre: 18000, fraisGénéraux: 8000 },
          { month: "Fév 2022", matériaux: 12500, maindOeuvre: 18200, fraisGénéraux: 8100 },
          { month: "Mar 2022", matériaux: 13000, maindOeuvre: 18500, fraisGénéraux: 8200 },
          { month: "Avr 2022", matériaux: 13200, maindOeuvre: 18800, fraisGénéraux: 8300 },
          { month: "Mai 2022", matériaux: 13500, maindOeuvre: 19000, fraisGénéraux: 8400 },
          { month: "Juin 2022", matériaux: 14000, maindOeuvre: 19200, fraisGénéraux: 8500 },
          { month: "Juil 2022", matériaux: 14500, maindOeuvre: 19500, fraisGénéraux: 8600 },
          { month: "Août 2022", matériaux: 15000, maindOeuvre: 19800, fraisGénéraux: 8700 },
          { month: "Sep 2022", matériaux: 15500, maindOeuvre: 20000, fraisGénéraux: 8800 },
          { month: "Oct 2022", matériaux: 16000, maindOeuvre: 20200, fraisGénéraux: 8900 },
          { month: "Nov 2022", matériaux: 16500, maindOeuvre: 20500, fraisGénéraux: 9000 },
          { month: "Déc 2022", matériaux: 17000, maindOeuvre: 21000, fraisGénéraux: 9100 },
        ],
        trends: {
          matériaux: {
            growthRate: 41.67,
            averageMonthlyGrowth: 3.47,
            trend: "increasing",
          },
          maindOeuvre: {
            growthRate: 16.67,
            averageMonthlyGrowth: 1.39,
            trend: "increasing",
          },
          fraisGénéraux: {
            growthRate: 13.75,
            averageMonthlyGrowth: 1.15,
            trend: "increasing",
          },
        },
      },
      status: "completed",
      is_public: true,
    },
    {
      id: uuidv4(),
      title: "Distribution des ventes par région",
      description: "Répartition des ventes par région et par catégorie de produits",
      type: "distribution",
      user_id: users[3].id,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      data: {
        regions: [
          { name: "Nord", value: 125000, percent: 25 },
          { name: "Sud", value: 150000, percent: 30 },
          { name: "Est", value: 100000, percent: 20 },
          { name: "Ouest", value: 125000, percent: 25 },
        ],
        categories: [
          { name: "Électronique", value: 200000, percent: 40 },
          { name: "Mobilier", value: 150000, percent: 30 },
          { name: "Vêtements", value: 100000, percent: 20 },
          { name: "Alimentation", value: 50000, percent: 10 },
        ],
        crossAnalysis: [
          { region: "Nord", électronique: 50000, mobilier: 37500, vêtements: 25000, alimentation: 12500 },
          { region: "Sud", électronique: 60000, mobilier: 45000, vêtements: 30000, alimentation: 15000 },
          { region: "Est", électronique: 40000, mobilier: 30000, vêtements: 20000, alimentation: 10000 },
          { region: "Ouest", électronique: 50000, mobilier: 37500, vêtements: 25000, alimentation: 12500 },
        ],
      },
      status: "completed",
      is_public: true,
    },
  ]

  // Insert analyses
  const { error: analysesError } = await supabaseAdmin.from("analyses").upsert(analyses)

  if (analysesError) {
    console.error("Error seeding analyses:", analysesError)
    return
  }

  // Add tags to analyses
  const analysesTags = [
    { analysis_id: analyses[0].id, tag: "budget" },
    { analysis_id: analyses[0].id, tag: "écarts" },
    { analysis_id: analyses[0].id, tag: "trimestre" },
    { analysis_id: analyses[1].id, tag: "prix" },
    { analysis_id: analyses[1].id, tag: "optimisation" },
    { analysis_id: analyses[1].id, tag: "produits" },
    { analysis_id: analyses[2].id, tag: "coûts" },
    { analysis_id: analyses[2].id, tag: "tendances" },
    { analysis_id: analyses[2].id, tag: "évolution" },
    { analysis_id: analyses[3].id, tag: "ventes" },
    { analysis_id: analyses[3].id, tag: "régions" },
    { analysis_id: analyses[3].id, tag: "distribution" },
  ]

  const { error: tagsError } = await supabaseAdmin.from("analyses_tags").upsert(analysesTags)

  if (tagsError) {
    console.error("Error seeding analyses tags:", tagsError)
    return
  }

  console.log("Successfully seeded analyses data")
}
