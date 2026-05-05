// api/extractAiData.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { token, accountId, documentId } = req.body;

    // Step 4 API Endpoint: AI Extraction
    const url = `https://api-d.docusign.com/v1/accounts/${accountId}/agreements/${documentId}/ai/extractions`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : { success: true };

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Step 4 AI Extraction failed", details: error.message });
    }
}
