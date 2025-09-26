const express = require('express');
const router = express.Router();

// The API key is a placeholder. In a real application, this should be an environment variable.
const apiKey = process.env.API_KEY;
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + apiKey;

/**
 * Handles the POST request to generate an "echo" response.
 * Expects a JSON body with 'query' and 'persona' from the frontend.
 */
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
            optimistic: "You are an AI with an extremely optimistic persona. Your responses should be positive, encouraging, and highlight the best possible outcomes. Use cheerful and uplifting language.",
            sarcastic: "You are an AI with a sarcastic and cynical persona. Your responses should be witty, humorous, and filled with dry irony. Respond to the user's statements as if they are incredibly obvious or foolish.",
            philosophical: "You are an AI with a philosophical and introspective persona. Your responses should ponder the deeper meaning of the user's statements, exploring themes of existence, truth, and human nature. Use thought-provoking language.",
            realistic: "You are an AI with a practical and realistic persona. Your responses should be grounded in common sense, focusing on logical steps, tangible outcomes, and potential obstacles. Be direct and concise."
        };

        const systemPrompt = systemPrompts[persona];

        if (!systemPrompt) {
            return res.status(400).json({ error: 'Invalid persona selected.' });
        }

        // CORRECT PAYLOAD: Uses top-level systemInstruction field for the API
        const payload = {
            contents: [{ parts: [{ text: query }] }], 
            systemInstruction: { parts: [{ text: systemPrompt }] }
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