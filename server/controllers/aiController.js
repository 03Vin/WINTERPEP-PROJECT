const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");

exports.askAI = async (req, res) => {
    const { prompt } = req.body;
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
            throw new Error("No API Key");
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        res.json({ answer: result.response.text() });
    } catch (error) {
        // Simulated AI Fallback for demonstration
        const simulatedResponses = [
            "Based on your current attendance trends, you should focus on Mathematics this week.",
            "I've analyzed the curriculum; you're ahead of schedule by 5%. Great job!",
            "To resolve your timetable clash, I recommend moving Laboratory 1 to Friday afternoon.",
            "Your profile shows a 92% completion rate for the first semester topics."
        ];
        const randomAnswer = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
        res.json({ answer: `[SIMULATED AI] ${randomAnswer}` });
    }
};
