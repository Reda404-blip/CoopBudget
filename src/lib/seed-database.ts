import { supabaseAdmin } from "@/lib/supabase"

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Clear existing data
    await clearExistingData()

    // Seed products
    const products = await seedProducts()

    // Seed budgets
    await seedBudgets()

    // Seed costs
    await seedCosts(products)

    // Seed standard costs
    await seedStandardCosts(products)

    // Seed accounting entries
    await seedAccountingEntries()

    console.log("Database seeding completed successfully!")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}

async function clearExistingData() {
  console.log("Clearing existing data...")

  // Delete in reverse order of dependencies
  await supabaseAdmin.from("accounting_entries").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("standard_costs").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("costs").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("budgets").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000")
}

async function seedProducts() {
  console.log("Seeding products...")

  const products = [
    { name: "Produit A", description: "Description du produit A" },
    { name: "Produit B", description: "Description du produit B" },
    { name: "Produit C", description: "Description du produit C" },
  ]

  const { data, error } = await supabaseAdmin.from("products").insert(products).select()

  if (error) {
    throw error
  }

  return data
}

async function seedBudgets() {
  console.log("Seeding budgets...")

  const currentYear = new Date().getFullYear()

  const budgets = [
    {
      name: "Budget des ventes 2024",
      type: "sales",
      period: "annual",
      start_date: `${currentYear}-01-01`,
      end_date: `${currentYear}-12-31`,
      amount: 250000,
      progress: 15,
      status: "active",
      method: "incremental",
      description: "Budget annuel des ventes pour l'année 2024",
    },
    {
      name: "Budget de production T1 2024",
      type: "production",
      period: "quarterly",
      start_date: `${currentYear}-01-01`,
      end_date: `${currentYear}-03-31`,
      amount: 75000,
      progress: 40,
      status: "active",
      method: "zero",
      description: "Budget de production pour le premier trimestre 2024",
    },
    {
      name: "Budget des investissements 2024",
      type: "investment",
      period: "annual",
      start_date: `${currentYear}-01-01`,
      end_date: `${currentYear}-12-31`,
      amount: 120000,
      progress: 5,
      status: "active",
      method: "flexible",
      description: "Budget des investissements pour l'année 2024",
    },
  ]

  const { error } = await supabaseAdmin.from("budgets").insert(budgets)

  if (error) {
    throw error
  }
}

async function seedCosts(products: any[]) {
  console.log("Seeding costs...")

  if (!products || products.length === 0) {
    throw new Error("No products available for seeding costs")
  }

  const costs = [
    {
      product_id: products[0].id,
      cost_type: "direct",
      cost_category: "Matières premières",
      amount: 1250,
      date: new Date().toISOString().split("T")[0],
      description: "Achat de matières premières pour le Produit A",
    },
    {
      product_id: products[1].id,
      cost_type: "direct",
      cost_category: "Main d'œuvre",
      amount: 2300,
      date: new Date().toISOString().split("T")[0],
      description: "Coûts de main d'œuvre pour le Produit B",
    },
    {
      product_id: products[2].id,
      cost_type: "indirect",
      cost_category: "Frais généraux",
      amount: 850,
      date: new Date().toISOString().split("T")[0],
      description: "Frais généraux alloués au Produit C",
    },
  ]

  const { error } = await supabaseAdmin.from("costs").insert(costs)

  if (error) {
    throw error
  }
}

async function seedStandardCosts(products: any[]) {
  console.log("Seeding standard costs...")

  if (!products || products.length === 0) {
    throw new Error("No products available for seeding standard costs")
  }

  const standardCosts = [
    {
      product_id: products[0].id,
      category: "Matières premières",
      standard_cost: 12.5,
      unit: "kg",
      last_updated: new Date().toISOString().split("T")[0],
    },
    {
      product_id: products[1].id,
      category: "Main d'œuvre",
      standard_cost: 18.75,
      unit: "heure",
      last_updated: new Date().toISOString().split("T")[0],
    },
    {
      product_id: products[2].id,
      category: "Emballage",
      standard_cost: 3.25,
      unit: "unité",
      last_updated: new Date().toISOString().split("T")[0],
    },
  ]

  const { error } = await supabaseAdmin.from("standard_costs").insert(standardCosts)

  if (error) {
    throw error
  }
}

async function seedAccountingEntries() {
  console.log("Seeding accounting entries...")

  const entries = [
    {
      date: new Date().toISOString().split("T")[0],
      account_number: "607",
      account_name: "Achats de marchandises",
      description: "Achat de matières premières",
      debit: 1250,
      credit: 0,
      type: "charge",
      analytical_axis: "Produit A",
    },
    {
      date: new Date().toISOString().split("T")[0],
      account_number: "512",
      account_name: "Banque",
      description: "Paiement facture fournisseur",
      debit: 0,
      credit: 1250,
      type: "charge",
      analytical_axis: "Produit A",
    },
    {
      date: new Date().toISOString().split("T")[0],
      account_number: "701",
      account_name: "Ventes de produits finis",
      description: "Vente de produits",
      debit: 0,
      credit: 3500,
      type: "produit",
      analytical_axis: "Produit B",
    },
  ]

  const { error } = await supabaseAdmin.from("accounting_entries").insert(entries)

  if (error) {
    throw error
  }
}
