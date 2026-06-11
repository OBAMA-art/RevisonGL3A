// Supabase Edge Function : correct-exam
// -------------------------------------------------------------------------
// Reçoit le texte OCR brut d'une épreuve scannée et le transforme, via Claude,
// en une épreuve structurée + corrigée, AVEC extraction de QCM pour le quiz.
//
// Déploiement :
//   1) supabase functions deploy correct-exam --no-verify-jwt
//   2) supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// La clé Anthropic reste un SECRET côté serveur : elle n'est jamais exposée
// au navigateur. Le client appelle cette fonction avec la clé anon Supabase.
// -------------------------------------------------------------------------

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-4-6";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

// Schéma de sortie imposé à Claude via un "tool" (force un JSON valide).
const TOOL = {
  name: "enregistrer_epreuve",
  description:
    "Enregistre l'épreuve structurée, corrigée, et le quiz extrait.",
  input_schema: {
    type: "object",
    properties: {
      titre: {
        type: "string",
        description:
          "Titre clair de l'épreuve (type d'examen, matière, session, niveau si connus).",
      },
      source: {
        type: "string",
        description:
          "Origine : établissement, durée, filière, année — ce qui est lisible.",
      },
      questions: {
        type: "array",
        description: "Toutes les questions de l'épreuve, corrigées.",
        items: {
          type: "object",
          properties: {
            numero: { type: "string" },
            enonce: {
              type: "string",
              description:
                "Énoncé fidèle de la question (avec ses options A/B/C/D si QCM).",
            },
            correction: {
              type: "string",
              description:
                "Correction détaillée et pédagogique : la bonne réponse PUIS l'explication.",
            },
            bareme: { type: "string" },
          },
          required: ["numero", "enonce", "correction"],
        },
      },
      quiz: {
        type: "array",
        description:
          "QCM extraits/dérivés de l'épreuve pour alimenter le quiz interactif. Vide si l'épreuve ne s'y prête pas.",
        items: {
          type: "object",
          properties: {
            q: { type: "string", description: "La question." },
            options: {
              type: "array",
              items: { type: "string" },
              description:
                "Les options, préfixées (ex: 'A. ...'). 2 à 6 options.",
            },
            reponse: {
              type: "string",
              description: "La lettre de la bonne option (A, B, C...).",
            },
            explication: {
              type: "string",
              description: "Brève justification de la bonne réponse.",
            },
          },
          required: ["q", "options", "reponse"],
        },
      },
    },
    required: ["titre", "questions", "quiz"],
  },
};

function systemPrompt(matiereLabel: string) {
  return [
    "Tu es un correcteur d'examens universitaires (IAI / Génie Logiciel, Cameroun).",
    `La matière concernée est : ${matiereLabel || "non précisée"}.`,
    "On te fournit le texte BRUT issu d'un OCR d'une photo d'épreuve : il peut",
    "contenir des fautes de reconnaissance, des sauts de ligne parasites, des",
    "caractères erronés. Ton travail :",
    "1) Reconstituer fidèlement chaque question (corrige les coquilles d'OCR",
    "   évidentes, ne réinvente pas le sens).",
    "2) Pour chaque question, donner une correction JUSTE et pédagogique :",
    "   d'abord la bonne réponse, puis une explication claire et concise.",
    "3) Extraire un quiz à choix multiples (champ quiz) à partir des questions",
    "   de type QCM : reformule en question autonome, propose les options, et",
    "   indique la bonne lettre. Si l'épreuve est purement rédactionnelle (pas",
    "   de QCM), renvoie quiz vide.",
    "Rends un contenu exact : ne fabrique pas de fausses corrections. En cas de",
    "doute sur une réponse, dis-le dans la correction plutôt que d'inventer.",
    "Réponds UNIQUEMENT via l'outil enregistrer_epreuve.",
  ].join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);
  if (!ANTHROPIC_API_KEY) {
    return json({ error: "ANTHROPIC_API_KEY non configurée côté serveur." }, 500);
  }

  let payload: { ocrText?: string; matiereLabel?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Corps JSON invalide." }, 400);
  }

  const ocrText = (payload.ocrText || "").trim();
  const matiereLabel = payload.matiereLabel || "";
  if (ocrText.replace(/\s/g, "").length < 20) {
    return json({ error: "Texte OCR trop court pour être corrigé." }, 400);
  }

  try {
    const aRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8000,
        system: systemPrompt(matiereLabel),
        tools: [TOOL],
        tool_choice: { type: "tool", name: "enregistrer_epreuve" },
        messages: [
          {
            role: "user",
            content:
              "Voici le texte OCR brut de l'épreuve à structurer et corriger :\n\n" +
              ocrText.slice(0, 24000),
          },
        ],
      }),
    });

    if (!aRes.ok) {
      const detail = await aRes.text();
      return json({ error: "Erreur API Claude", detail }, 502);
    }

    const data = await aRes.json();
    const toolUse = (data.content || []).find(
      (c: { type: string }) => c.type === "tool_use",
    );
    if (!toolUse) {
      return json({ error: "Réponse IA inattendue (pas de tool_use)." }, 502);
    }

    const result = toolUse.input;
    if (!Array.isArray(result.quiz)) result.quiz = [];
    if (!Array.isArray(result.questions)) result.questions = [];
    return json(result);
  } catch (e) {
    return json({ error: "Échec de la correction : " + (e?.message || e) }, 500);
  }
});
