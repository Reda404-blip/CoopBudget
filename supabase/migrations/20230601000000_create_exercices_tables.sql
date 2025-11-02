-- Création de la table des exercices
CREATE TABLE IF NOT EXISTS exercices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ecart', 'optimisation', 'budget')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('facile', 'moyen', 'difficile')),
  fields JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer les recherches par type
CREATE INDEX IF NOT EXISTS exercices_type_idx ON exercices (type);

-- Insertion de données d'exemple
INSERT INTO exercices (id, title, description, type, difficulty, fields)
VALUES 
  (
    'atlas-produit-a',
    'Analyse des écarts - Produit A',
    'Analysez les écarts entre le budget et les réalisations pour le produit A de la société Atlas.',
    'ecart',
    'moyen',
    '[
      {"name": "quantitePrevue", "label": "Quantité prévue"},
      {"name": "prixPrevu", "label": "Prix prévu"},
      {"name": "quantiteRealisee", "label": "Quantité réalisée"},
      {"name": "prixRealise", "label": "Prix réalisé"},
      {"name": "coutStandard", "label": "Coût standard"}
    ]'
  ),
  (
    'britools-prix',
    'Optimisation de prix - Britools',
    'Déterminez le prix optimal pour maximiser la rentabilité d''un produit de la gamme Britools.',
    'optimisation',
    'difficile',
    '[
      {"name": "prixActuel", "label": "Prix actuel"},
      {"name": "quantiteActuelle", "label": "Quantité actuelle"},
      {"name": "elasticite", "label": "Élasticité-prix"},
      {"name": "coutVariable", "label": "Coût variable unitaire"},
      {"name": "coutFixe", "label": "Coûts fixes totaux"}
    ]'
  ),
  (
    'ecopack-budget',
    'Budget prévisionnel - Ecopack',
    'Élaborez le budget prévisionnel des ventes pour la société Ecopack spécialisée dans les emballages écologiques.',
    'budget',
    'facile',
    '[
      {"name": "budgetVentes", "label": "Budget des ventes actuel"},
      {"name": "prixMoyen", "label": "Prix moyen unitaire"},
      {"name": "tauxCroissance", "label": "Taux de croissance prévu"},
      {"name": "margeBrute", "label": "Marge brute"}
    ]'
  );

-- Création de la table pour stocker les résultats des exercices
CREATE TABLE IF NOT EXISTS exercice_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercice_id TEXT NOT NULL REFERENCES exercices(id) ON DELETE CASCADE,
  user_id UUID,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer les recherches par exercice et utilisateur
CREATE INDEX IF NOT EXISTS exercice_results_exercice_id_idx ON exercice_results (exercice_id);
CREATE INDEX IF NOT EXISTS exercice_results_user_id_idx ON exercice_results (user_id);
