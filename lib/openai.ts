const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

export const generateProfessionalMessage = async (rawText: string, studentName: string) => {
    if (!OPENAI_API_KEY) {
        console.error("Clé API manquante !");
        return "Erreur : Clé API OpenAI non configurée dans le fichier .env";
    }

    const systemPrompt = `
    Tu es un assistant pédagogique expert pour un professeur particulier.
    Ta mission : Reformuler un compte-rendu oral brut en un message SMS/WhatsApp professionnel destiné aux parents.
    
    Règles de rédaction :
    - Ton : Poli, rassurant, professionnel mais chaleureux.
    - Structure : 
      1. Ce qu'on a fait (Notions clés).
      2. Le feedback (Réussites ou points à revoir).
      3. Les devoirs pour la prochaine fois (si mentionnés).
    - Concision : Le message doit tenir dans un écran WhatsApp (pas de pavé).
    - Ne signe pas le message.
    - Corrige les fautes de français et les hésitations de l'oral.
  `;

    const userPrompt = `
    Élève : ${studentName}
    Compte-rendu oral brut : "${rawText}"
  `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Rapide et suffisant (ou "gpt-4" pour plus de finesse)
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7, // Un peu de créativité pour que ça ne fasse pas "robot"
            })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error("Erreur OpenAI:", error);
        return "Oups, l'IA n'a pas pu générer le message. Vérifiez votre clé ou votre connexion.";
    }
};
