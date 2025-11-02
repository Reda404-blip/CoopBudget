import { NextResponse } from "next/server"
import type { AIAnalysisRequest } from "@/lib/ai-service"

// Configuration de l'API OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AIAnalysisRequest

    if (!body.exerciceType || !body.data) {
      return NextResponse.json({ error: "Les données de l'exercice sont requises" }, { status: 400 })
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "La clé API OpenAI n'est pas configurée. Veuillez contacter l'administrateur." },
        { status: 500 },
      )
    }

    const prompt = generatePrompt(body)

    // Appel à l'API OpenAI
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error("Erreur OpenAI:", errorData)
      return NextResponse.json(
        { error: "Erreur lors de la communication avec OpenAI", details: errorData },
        { status: 500 },
      )
    }

    const openaiData = await openaiResponse.json()
    const text = openaiData.choices[0].message.content

    // Analyser la réponse pour extraire les informations structurées
    const parsedResponse = parseAIResponse(text)

    return NextResponse.json({
      solution: parsedResponse,
      rawResponse: text,
    })
  } catch (error: any) {
    console.error("Erreur lors de l'analyse par l'IA:", error)

    return NextResponse.json({ error: "Erreur lors de l'analyse par l'IA", details: error.message }, { status: 500 })
  }
}

function generatePrompt(request: AIAnalysisRequest): string {
  const { exerciceType, exerciceTitle, exerciceDescription, data } = request

  // Convertir les données en format texte
  const dataText = Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")

  return `
Tu es un expert en gestion budgétaire et analyse financière. Tu dois résoudre l'exercice suivant:

TITRE DE L'EXERCICE: ${exerciceTitle}
TYPE D'EXERCICE: ${exerciceType}
DESCRIPTION: ${exerciceDescription}

DONNÉES:
${dataText}

INSTRUCTIONS:
1. Analyse les données fournies pour cet exercice de ${exerciceType}.
2. Résous l'exercice étape par étape en expliquant clairement ton raisonnement.
3. Pour chaque calcul, indique la formule utilisée et le résultat obtenu.
4. Fournis une conclusion qui résume les résultats principaux.
5. Propose des recommandations basées sur ton analyse.

FORMAT DE RÉPONSE:
Présente ta réponse sous forme structurée avec les sections suivantes:
- RÉSUMÉ: Un bref résumé de l'exercice et de l'approche utilisée.
- ÉTAPES DE RÉSOLUTION: Liste numérotée des étapes avec formules et calculs.
- CONCLUSION: Synthèse des résultats et leur signification.
- RECOMMANDATIONS: Liste de recommandations pratiques basées sur l'analyse.

Assure-toi que tes calculs sont précis et que tes explications sont claires et pédagogiques.
`
}

function parseAIResponse(text: string): any {
  // Extraction du résumé
  const summaryMatch = text.match(/RÉSUMÉ:(.+?)(?=ÉTAPES DE RÉSOLUTION:|$)/s)
  const summary = summaryMatch ? summaryMatch[1].trim() : "Analyse complétée"

  // Extraction des étapes
  const stepsMatch = text.match(/ÉTAPES DE RÉSOLUTION:(.+?)(?=CONCLUSION:|$)/s)
  const stepsText = stepsMatch ? stepsMatch[1].trim() : ""

  // Extraction de la conclusion
  const conclusionMatch = text.match(/CONCLUSION:(.+?)(?=RECOMMANDATIONS:|$)/s)
  const conclusion = conclusionMatch ? conclusionMatch[1].trim() : ""

  // Extraction des recommandations
  const recommendationsMatch = text.match(/RECOMMANDATIONS:(.+?)$/s)
  const recommendationsText = recommendationsMatch ? recommendationsMatch[1].trim() : ""

  // Traitement des étapes
  const stepRegex = /(\d+\.\s.+?)(?=\d+\.\s|$)/gs
  const stepsMatches = stepsText.matchAll(stepRegex)
  const steps = Array.from(stepsMatches).map((match) => {
    const stepText = match[1].trim()
    const titleMatch = stepText.match(/^(\d+\.\s.+?)(?=:|\n|$)/)
    const title = titleMatch ? titleMatch[1].trim() : "Étape"

    // Extraire la description (tout ce qui n'est pas le titre, un calcul ou un résultat)
    let description = stepText.replace(title, "").trim()

    // Extraire les calculs s'ils existent
    const calculationMatch = description.match(/([A-Za-z0-9\s+\-*/$$=]+=[A-Za-z0-9\s+\-*/$$]+)/)
    const calculation = calculationMatch ? calculationMatch[1].trim() : undefined

    // Extraire le résultat s'il existe
    const resultMatch = description.match(/Résultat:?\s*([0-9\s.,]+)/)
    const result = resultMatch ? resultMatch[1].trim() : undefined

    // Nettoyer la description
    if (calculation) {
      description = description.replace(calculation, "").trim()
    }
    if (resultMatch) {
      description = description.replace(resultMatch[0], "").trim()
    }

    return {
      title,
      description,
      calculation,
      result,
    }
  })

  // Traitement des recommandations
  const recommendations = recommendationsText
    .split(/\n-|\n\d+\./)
    .map((rec) => rec.trim())
    .filter((rec) => rec.length > 0)

  return {
    summary,
    steps,
    conclusion,
    recommendations,
  }
}
