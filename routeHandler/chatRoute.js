const dotenv = require('dotenv');
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Course } = require("../Models/Students");

// Initialize Google Generative AI
// Using the key provided by the user directly to ensure it works
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//console.log("API_KEY", process.env.GEMINI_API_KEY);

const chatRoute = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const courses = await Course.find({});
        const coursesContext = courses.map(c =>
            `- ${c.courseName} (Duration: ${c.courseDuration}, Fee: ${c.courseFee}, Description: ${c.description})`
        ).join("\n");

        // Using gemini-flash-latest as 1.5-flash is unavailable
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `You are a helpful and friendly AI assistant for "Gen-Z IT", an educational institution providing training in modern tech skills.
        
        Using the following course information, answer the user's questions. 
        If the answer is not in the course information, use your general knowledge but mention that "Gen-Z IT" primarily focuses on the listed courses.
        Be concise and encouraging. Do not need to provide bold or italic or any other type text. Just plain text. You may use emojies if need.
        
        Available Courses:
        ${coursesContext}
        
        User: ${message}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Chat Error Detailed:", error);

        let errorMessage = "Something went wrong. Please try again later.";

        if (error.message && error.message.includes("404")) {
            errorMessage = "API Error: The 'Generative Language API' is not enabled or model not found. please enable it in Google Cloud Console.";
        } else if (error.message && error.message.includes("429")) {
            errorMessage = "API Error: Rate Limit Exceeded.";
        } else if (error.message && error.message.includes("API key not valid")) {
            errorMessage = "API Error: Invalid API Key.";
        }

        res.status(500).json({ reply: errorMessage });
    }
};

module.exports = chatRoute;