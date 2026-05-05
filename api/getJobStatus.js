// api/getJobStatus.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { token, accountId, jobId } = req.body;

    // Job 상태 조회를 위한 Endpoint
    const url = `https://api-d.docusign.com/v1/accounts/${accountId}/upload/jobs/${jobId}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Job Status", details: error.message });
    }
}
