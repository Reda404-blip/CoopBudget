"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Database, PenLine, Brain } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileImport } from "@/components/exercices/file-import"
import { ExampleDataImport } from "@/components/exercices/example-data-import"
import { ManualDataEntry } from "@/components/exercices/manual-data-entry"
import { AIAnalysis } from "@/components/exercices/ai-analysis"
import { getExerciceById } from "@/lib/services/exercice-service"
import type { Exercice, ExerciceData, AnalyseResult } from "@/types/exercices"

// Composants d'analyse spécifiques à chaque type d'exercice
const AnalyseEcarts = ({ data, exercice }: { data: ExerciceData; exercice: Exercice }) => {
  // Calcul des écarts pour l'exercice Atlas Produit A
  if (exercice.id === "atlas-produit-a") {
    const quantitePrevue = (data.quantitePrevue as number) || 0
    const prixPrevu = (data.prixPrevu as number) || 0
    const quantiteRealisee = (data.quantiteRealisee as number) || 0
    const prixRealise = (data.prixRealise as number) || 0
    const coutStandard = (data.coutStandard as number) || 0

    // Calculs des écarts
    const chiffreAffairesPrevu = quantitePrevue * prixPrevu
    const chiffreAffairesRealise = quantiteRealisee * prixRealise
    const ecartGlobal = chiffreAffairesRealise - chiffreAffairesPrevu

    const ecartSurQuantite = (quantiteRealisee - quantitePrevue) * prixPrevu
    const ecartSurPrix = quantiteRealisee * (prixRealise - prixPrevu)

    const margeStandard = prixPrevu - coutStandard
    const ecartRendement = (quantiteRealisee - quantitePrevue) * margeStandard

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'analyse des écarts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Données budgétées</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Quantité prévue:</span>
                      <span className="font-medium">{quantitePrevue.toLocaleString()} unités</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Prix prévu:</span>
                      <span className="font-medium">{prixPrevu.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Chiffre d'affaires prévu:</span>
                      <span className="font-medium">{chiffreAffairesPrevu.toLocaleString()} €</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Données réalisées</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Quantité réalisée:</span>
                      <span className="font-medium">{quantiteRealisee.toLocaleString()} unités</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Prix réalisé:</span>
                      <span className="font-medium">{prixRealise.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Chiffre d'affaires réalisé:</span>
                      <span className="font-medium">{chiffreAffairesRealise.toLocaleString()} €</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">Analyse des écarts</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type d'écart
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interprétation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Écart global</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${ecartGlobal >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {ecartGlobal.toLocaleString()} €
                        </td>
                        <td className="px-6 py-4">
                          {ecartGlobal >= 0
                            ? "Favorable: Le chiffre d'affaires réalisé est supérieur au budget."
                            : "Défavorable: Le chiffre d'affaires réalisé est inférieur au budget."}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Écart sur quantité</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${ecartSurQuantite >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {ecartSurQuantite.toLocaleString()} €
                        </td>
                        <td className="px-6 py-4">
                          {ecartSurQuantite >= 0
                            ? "Favorable: Les quantités vendues sont supérieures aux prévisions."
                            : "Défavorable: Les quantités vendues sont inférieures aux prévisions."}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Écart sur prix</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${ecartSurPrix >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {ecartSurPrix.toLocaleString()} €
                        </td>
                        <td className="px-6 py-4">
                          {ecartSurPrix >= 0
                            ? "Favorable: Les prix pratiqués sont supérieurs aux prévisions."
                            : "Défavorable: Les prix pratiqués sont inférieurs aux prévisions."}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Écart de rendement</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${ecartRendement >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {ecartRendement.toLocaleString()} €
                        </td>
                        <td className="px-6 py-4">
                          {ecartRendement >= 0
                            ? "Favorable: L'augmentation des quantités a généré une marge supplémentaire."
                            : "Défavorable: La diminution des quantités a réduit la marge."}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conclusion et recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                {ecartGlobal >= 0
                  ? `L'analyse montre un résultat global favorable de ${ecartGlobal.toLocaleString()} €, soit ${((ecartGlobal / chiffreAffairesPrevu) * 100).toFixed(2)}% par rapport au budget.`
                  : `L'analyse montre un résultat global défavorable de ${Math.abs(ecartGlobal).toLocaleString()} €, soit ${((Math.abs(ecartGlobal) / chiffreAffairesPrevu) * 100).toFixed(2)}% par rapport au budget.`}
              </p>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Recommandations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {ecartSurQuantite < 0 && (
                    <li>
                      Analyser les causes de la baisse des volumes et mettre en place des actions commerciales pour
                      stimuler les ventes.
                    </li>
                  )}
                  {ecartSurPrix < 0 && (
                    <li>Revoir la politique tarifaire et évaluer le positionnement par rapport à la concurrence.</li>
                  )}
                  {ecartSurQuantite >= 0 && ecartSurPrix < 0 && (
                    <li>
                      La hausse des volumes pourrait être liée à la baisse des prix. Évaluer l'élasticité-prix pour
                      optimiser la tarification.
                    </li>
                  )}
                  {ecartSurQuantite < 0 && ecartSurPrix >= 0 && (
                    <li>
                      La hausse des prix pourrait avoir impacté négativement les volumes. Rechercher le point
                      d'équilibre optimal.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Autres cas d'exercices d'écarts
  return (
    <div className="p-4 bg-yellow-50 rounded-lg">
      <p>Analyse des écarts pour cet exercice spécifique.</p>
    </div>
  )
}

const AnalyseOptimisation = ({ data, exercice }: { data: ExerciceData; exercice: Exercice }) => {
  // Calcul d'optimisation pour l'exercice Britools Prix
  if (exercice.id === "britools-prix") {
    const prixActuel = (data.prixActuel as number) || 0
    const quantiteActuelle = (data.quantiteActuelle as number) || 0
    const elasticite = (data.elasticite as number) || 0
    const coutVariable = (data.coutVariable as number) || 0
    const coutFixe = (data.coutFixe as number) || 0

    // Calculs d'optimisation
    const margeBrute = prixActuel - coutVariable
    const seuilRentabilite = coutFixe / margeBrute

    // Calcul du prix optimal
    const prixOptimal = (elasticite * coutVariable + coutVariable) / (2 * elasticite)
    const quantiteOptimale = quantiteActuelle * Math.pow(prixActuel / prixOptimal, elasticite)

    // Résultats actuels vs optimaux
    const caActuel = prixActuel * quantiteActuelle
    const coutTotalActuel = coutFixe + coutVariable * quantiteActuelle
    const resultatActuel = caActuel - coutTotalActuel

    const caOptimal = prixOptimal * quantiteOptimale
    const coutTotalOptimal = coutFixe + coutVariable * quantiteOptimale
    const resultatOptimal = caOptimal - coutTotalOptimal

    const gainPotentiel = resultatOptimal - resultatActuel

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'optimisation de prix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Situation actuelle</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Prix actuel:</span>
                      <span className="font-medium">{prixActuel.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quantité vendue:</span>
                      <span className="font-medium">{quantiteActuelle.toLocaleString()} unités</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Chiffre d'affaires:</span>
                      <span className="font-medium">{caActuel.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Coût total:</span>
                      <span className="font-medium">{coutTotalActuel.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Résultat:</span>
                      <span className={`font-medium ${resultatActuel >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {resultatActuel.toLocaleString()} €
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Situation optimale</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Prix optimal:</span>
                      <span className="font-medium">{prixOptimal.toFixed(2)} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quantité estimée:</span>
                      <span className="font-medium">{Math.round(quantiteOptimale).toLocaleString()} unités</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Chiffre d'affaires:</span>
                      <span className="font-medium">{caOptimal.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Coût total:</span>
                      <span className="font-medium">{coutTotalOptimal.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Résultat:</span>
                      <span className={`font-medium ${resultatOptimal >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {resultatOptimal.toLocaleString()} €
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">Analyse comparative</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Indicateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actuel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Optimal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Prix</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prixActuel.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prixOptimal.toFixed(2)} €</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${prixOptimal > prixActuel ? "text-green-600" : "text-red-600"}`}
                        >
                          {((prixOptimal / prixActuel - 1) * 100).toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Quantité</td>
                        <td className="px-6 py-4 whitespace-nowrap">{quantiteActuelle.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{Math.round(quantiteOptimale).toLocaleString()}</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${quantiteOptimale > quantiteActuelle ? "text-green-600" : "text-red-600"}`}
                        >
                          {((quantiteOptimale / quantiteActuelle - 1) * 100).toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Chiffre d'affaires</td>
                        <td className="px-6 py-4 whitespace-nowrap">{caActuel.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{caOptimal.toLocaleString()} €</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${caOptimal > caActuel ? "text-green-600" : "text-red-600"}`}
                        >
                          {((caOptimal / caActuel - 1) * 100).toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Résultat</td>
                        <td className="px-6 py-4 whitespace-nowrap">{resultatActuel.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{resultatOptimal.toLocaleString()} €</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${resultatOptimal > resultatActuel ? "text-green-600" : "text-red-600"}`}
                        >
                          {resultatActuel !== 0
                            ? ((resultatOptimal / resultatActuel - 1) * 100).toFixed(2) + "%"
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conclusion et recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                {gainPotentiel > 0
                  ? `L'optimisation du prix permettrait d'augmenter le résultat de ${gainPotentiel.toLocaleString()} €, soit une amélioration de ${((gainPotentiel / resultatActuel) * 100).toFixed(2)}%.`
                  : `Le prix actuel semble déjà proche de l'optimal. Aucun gain significatif n'est attendu d'un changement de prix.`}
              </p>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Recommandations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {prixOptimal > prixActuel && (
                    <li>
                      Augmenter progressivement le prix vers {prixOptimal.toFixed(2)} € pour maximiser la rentabilité.
                    </li>
                  )}
                  {prixOptimal < prixActuel && (
                    <li>
                      Réduire le prix à {prixOptimal.toFixed(2)} € pour stimuler les ventes et améliorer la rentabilité
                      globale.
                    </li>
                  )}
                  <li>
                    Surveiller attentivement l'évolution des ventes suite au changement de prix pour valider
                    l'élasticité-prix utilisée dans le modèle.
                  </li>
                  <li>
                    Envisager des stratégies de segmentation de prix pour différents segments de clientèle afin
                    d'optimiser davantage la rentabilité.
                  </li>
                  <li>Analyser les possibilités de réduction des coûts variables pour améliorer la marge unitaire.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Autres cas d'exercices d'optimisation
  return (
    <div className="p-4 bg-yellow-50 rounded-lg">
      <p>Analyse d'optimisation pour cet exercice spécifique.</p>
    </div>
  )
}

const AnalyseBudget = ({ data, exercice }: { data: ExerciceData; exercice: Exercice }) => {
  // Calcul budgétaire pour l'exercice Ecopack Budget
  if (exercice.id === "ecopack-budget") {
    const budgetVentes = (data.budgetVentes as number) || 0
    const prixMoyen = (data.prixMoyen as number) || 0
    const tauxCroissance = (data.tauxCroissance as number) || 0
    const margeBrute = (data.margeBrute as number) || 0

    // Calculs budgétaires
    const quantiteActuelle = budgetVentes / prixMoyen
    const budgetVentesN1 = budgetVentes * (1 + tauxCroissance)
    const quantiteN1 = quantiteActuelle * (1 + tauxCroissance)

    const coutActuel = budgetVentes * (1 - margeBrute)
    const coutN1 = budgetVentesN1 * (1 - margeBrute)

    const margeValeurActuelle = budgetVentes * margeBrute
    const margeValeurN1 = budgetVentesN1 * margeBrute

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget prévisionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Année en cours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Budget des ventes:</span>
                      <span className="font-medium">{budgetVentes.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Prix moyen unitaire:</span>
                      <span className="font-medium">{prixMoyen.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quantité estimée:</span>
                      <span className="font-medium">{Math.round(quantiteActuelle).toLocaleString()} unités</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Coût des ventes:</span>
                      <span className="font-medium">{coutActuel.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Marge brute:</span>
                      <span className="font-medium">
                        {margeValeurActuelle.toLocaleString()} € ({(margeBrute * 100).toFixed(1)}%)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Année N+1 (prévisions)</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Budget des ventes:</span>
                      <span className="font-medium">{budgetVentesN1.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Prix moyen unitaire:</span>
                      <span className="font-medium">{prixMoyen.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quantité estimée:</span>
                      <span className="font-medium">{Math.round(quantiteN1).toLocaleString()} unités</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Coût des ventes:</span>
                      <span className="font-medium">{coutN1.toLocaleString()} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Marge brute:</span>
                      <span className="font-medium">
                        {margeValeurN1.toLocaleString()} € ({(margeBrute * 100).toFixed(1)}%)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">Analyse comparative</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Indicateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Année en cours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Année N+1
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Budget des ventes</td>
                        <td className="px-6 py-4 whitespace-nowrap">{budgetVentes.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{budgetVentesN1.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                          +{(tauxCroissance * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Quantité</td>
                        <td className="px-6 py-4 whitespace-nowrap">{Math.round(quantiteActuelle).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{Math.round(quantiteN1).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                          +{(tauxCroissance * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Coût des ventes</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coutActuel.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coutN1.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-red-600">
                          +{(tauxCroissance * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Marge brute</td>
                        <td className="px-6 py-4 whitespace-nowrap">{margeValeurActuelle.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{margeValeurN1.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                          +{(tauxCroissance * 100).toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conclusion et recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Le budget prévisionnel pour l'année N+1 prévoit une croissance de {(tauxCroissance * 100).toFixed(1)}%
                du chiffre d'affaires, passant de {budgetVentes.toLocaleString()} € à {budgetVentesN1.toLocaleString()}{" "}
                €.
              </p>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Recommandations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Élaborer un plan d'action commercial pour atteindre l'objectif de croissance de{" "}
                    {(tauxCroissance * 100).toFixed(1)}%.
                  </li>
                  <li>
                    Prévoir les capacités de production nécessaires pour répondre à l'augmentation prévue des volumes.
                  </li>
                  <li>
                    Sécuriser les approvisionnements pour maintenir le niveau de marge brute à{" "}
                    {(margeBrute * 100).toFixed(1)}%.
                  </li>
                  <li>Envisager des investissements pour améliorer la productivité et réduire les coûts variables.</li>
                  <li>
                    Mettre en place des indicateurs de suivi mensuels pour détecter rapidement les écarts par rapport au
                    budget.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Autres cas d'exercices budgétaires
  return (
    <div className="p-4 bg-yellow-50 rounded-lg">
      <p>Analyse budgétaire pour cet exercice spécifique.</p>
    </div>
  )
}

export default function ExerciceDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [exercice, setExercice] = useState<Exercice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("file")
  const [importedData, setImportedData] = useState<ExerciceData | null>(null)
  const [analyseResult, setAnalyseResult] = useState<AnalyseResult | null>(null)

  useEffect(() => {
    const fetchExercice = async () => {
      try {
        const data = await getExerciceById(params.id)
        setExercice(data)
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement de l'exercice")
        console.error("Erreur de chargement:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExercice()
  }, [params.id])

  const handleDataImported = (data: ExerciceData) => {
    setImportedData(data)
    // Passer automatiquement à l'onglet d'analyse
    setActiveTab("analyse")
  }

  const renderAnalyseComponent = () => {
    if (!exercice || !importedData) return null

    switch (exercice.type) {
      case "ecart":
        return <AnalyseEcarts data={importedData} exercice={exercice} />
      case "optimisation":
        return <AnalyseOptimisation data={importedData} exercice={exercice} />
      case "budget":
        return <AnalyseBudget data={importedData} exercice={exercice} />
      default:
        return <p>Type d'analyse non pris en charge.</p>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !exercice) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/exercices-externes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            {error || "Exercice non trouvé. Veuillez vérifier l'identifiant ou retourner à la liste des exercices."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/exercices-externes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{exercice.title}</h1>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-4">{exercice.description}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                exercice.difficulty === "facile"
                  ? "bg-green-100 text-green-800"
                  : exercice.difficulty === "moyen"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {exercice.difficulty.charAt(0).toUpperCase() + exercice.difficulty.slice(1)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {exercice.type === "ecart"
                ? "Analyse d'écarts"
                : exercice.type === "optimisation"
                  ? "Optimisation de prix"
                  : "Budget prévisionnel"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="file" disabled={importedData !== null}>
            <FileText className="h-4 w-4 mr-2" />
            Importer des données
          </TabsTrigger>
          <TabsTrigger value="analyse" disabled={importedData === null}>
            <Database className="h-4 w-4 mr-2" />
            Analyse
          </TabsTrigger>
          <TabsTrigger value="ai-solution" disabled={importedData === null}>
            <Brain className="h-4 w-4 mr-2" />
            Solution IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choisissez une méthode d'importation</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual">
                <TabsList className="mb-4">
                  <TabsTrigger value="manual">
                    <PenLine className="h-4 w-4 mr-2" />
                    Saisie manuelle
                  </TabsTrigger>
                  <TabsTrigger value="example">
                    <Database className="h-4 w-4 mr-2" />
                    Données exemple
                  </TabsTrigger>
                  <TabsTrigger value="file">
                    <FileText className="h-4 w-4 mr-2" />
                    Importer un fichier
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="mt-0">
                  <ManualDataEntry exerciceId={exercice.id} onDataImported={handleDataImported} />
                </TabsContent>

                <TabsContent value="example" className="mt-0">
                  <ExampleDataImport exerciceId={exercice.id} onDataImported={handleDataImported} />
                </TabsContent>

                <TabsContent value="file" className="mt-0">
                  <FileImport exerciceId={exercice.id} onDataImported={handleDataImported} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyse" className="mt-0">
          <div className="space-y-4">
            {renderAnalyseComponent()}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setImportedData(null)
                  setActiveTab("file")
                }}
              >
                Retour à l'importation
              </Button>

              <Button onClick={() => setActiveTab("ai-solution")} className="bg-blue-600 hover:bg-blue-700">
                <Brain className="h-4 w-4 mr-2" />
                Voir la solution IA
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-solution" className="mt-0">
          {importedData && exercice && (
            <div className="space-y-4">
              <AIAnalysis exercice={exercice} data={importedData} />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("analyse")}>
                  Retour à l'analyse
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
