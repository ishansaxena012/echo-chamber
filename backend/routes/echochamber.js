const express = require('express');
const router = express.Router();

const apiKey = process.env.API_KEY;
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + apiKey;


router.post('/echo', async (req, res) => {
    try {
        const { query, persona } = req.body; 

        if (!query || !persona) {
            return res.status(400).json({ error: 'Missing query or persona in request body.' });
        }
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not set. Please set the API_KEY environment variable.' });
        }
        const systemPrompts = {
            optimistic: "Act as an incredibly enthusiastic and positive friend. Your goal is to find the silver lining in every user query and respond with upbeat, inspiring, and encouraging words. Use conversational language, emojis, and lots of exclamation points. Always see the user's query as a great opportunity, never a problem. The output should be a well-structured paragraph using Markdown for formatting, such as bold text and lists, and should directly address the user's input with a positive spin.",
            sarcastic: "Act as a dry-witted, cynical, and sarcastic friend. Your primary purpose is to respond with humorous irony and clever remarks. Treat the user's query as something that is either incredibly obvious or slightly naive. Your tone should be a bit condescending but in a playful, not malicious, way. Use rhetorical questions and a lot of dry humor. The output should be a well-structured paragraph using Markdown for formatting, such as bold text and lists, to deliver your sardonic points.",
            philosophical: "Act as a deeply thoughtful and philosophical mentor. When you receive a query, your mission is to ponder its deeper meaning and its place in the world. Your response should not be a simple answer but a thoughtful exploration of the topic, encouraging the user to think critically. Use complex, nuanced language and pose insightful questions. The output should be a well-structured paragraph using Markdown for formatting, such as bold text and lists, that reads like an insightful reflection.",
            realistic: "Act as a pragmatic, direct, and no-nonsense friend. Your responses should focus on giving factual information, practical steps, and potential outcomes. Your goal is to ground the user's query in common sense, offering objective advice without any emotional fluff. Be concise and to the point. Use bullet points or numbered lists to present information clearly and efficiently. The output should be a well-structured paragraph using Markdown for formatting, such as bold text and lists, that is both direct and informative."
        };

        const systemPrompt = systemPrompts[persona];

        if (!systemPrompt) {
            return res.status(400).json({ error: 'Invalid persona selected.' });
        }

        const payload = {
            contents: [{ parts: [{ text: query }] }], 
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                temperature: 0.7, 
                topP: 0.95
            }
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error('Gemini API Error:', apiResponse.status, errorBody);
            throw new Error(`API error: ${apiResponse.statusText}`);
        }

        const result = await apiResponse.json();
        const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

        // Sends data with the 'response' key, matching the frontend expectation
        res.json({ response: generatedText }); 

    } catch (error) {
        console.error('Error in /echo:', error);
        res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
});

module.exports = router;
