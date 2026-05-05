// api/extractAiData.js
export default async function handler(req, res) {
    // 프론트엔드 -> Vercel 통신은 POST 유지
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { token, accountId, documentId } = req.body;

    const url = `https://api-d.docusign.com/v1/accounts/${accountId}/agreements/${documentId}/ai/extractions`;
    
    try {
        // [수정된 핵심 부분] DocuSign으로 찌를 때는 데이터를 조회하는 것이므로 'GET'을 사용합니다!
        const response = await fetch(url, {
            method: 'GET', 
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
