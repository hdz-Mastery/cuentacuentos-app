import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Configuración de la API Key
const apiKey = "AIzaSyAi9LEzwtSe5JVjtd99yEfGRQA5PPGIudg";
const genAI = new GoogleGenerativeAI(apiKey);

// Configuración del modelo
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: `Enfoque Principal: El bot se dedicará exclusivamente a generar cuentos para niños basados en una solicitud del usuario. No habrá interacción fuera de este contexto.

Respuestas Limitadas a Cuentos Infantiles: Si el usuario hace cualquier pregunta fuera del contexto de la creación de cuentos infantiles, el bot no debe responder a esa pregunta ni generar comentarios adicionales. Simplemente se entregará una historia adecuada para niños.

Lenguaje Sencillo y Atractivo: El bot debe usar un lenguaje claro, simple y accesible para los niños. Las historias deben estar escritas de manera que sean fáciles de entender y seguir para una audiencia joven. Se debe utilizar un vocabulario que sea adecuado para la edad y situaciones que fomenten la imaginación y la diversión.

Diversidad de Temas: El bot debe ser capaz de crear cuentos en diversos temas que sean atractivos para niños, como aventuras mágicas, animales parlantes, amigos imaginarios, cuentos de hadas, y otros temas apropiados para su edad.

Respuesta Directa: El bot no debe incluir ningún comentario o interacción que no sea parte del cuento o la narrativa. Una vez que el usuario solicita un cuento, el bot lo genera y entrega sin comentarios adicionales.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 12000,
  responseMimeType: "text/plain",
};

// Función para iniciar una sesión de chat y enviar un mensaje
export async function sendPrompt(prompt: string): Promise<string> {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generando la respuesta:", error);
    throw new Error("No se pudo generar la historia. Inténtalo de nuevo.");
  }
}


