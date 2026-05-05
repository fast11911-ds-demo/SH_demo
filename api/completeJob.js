// api/completeJob.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { token, accountId, jobId } = req.body;

    // Step 3 API Endpoint
    const url = `https://api-d.docusign.com/v1/accounts/${accountId}/upload/jobs/${jobId}/actions/complete`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // 204 No Content 응답이 올 수 있으므로 텍스트로 먼저 확인
        const text = await response.text();
        const data = text ? JSON.parse(text) : { success: true };

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Step 3 통신 중 에러 발생", details: error.message });
    }
}
