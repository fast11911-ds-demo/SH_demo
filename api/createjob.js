// api/createJob.js
export default async function handler(req, res) {
    // 프론트엔드에서 보낸 데이터 받기
    const { token, accountId, bodyData } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const url = `https://api-d.docusign.com/v1/accounts/${accountId}/upload/jobs`;
    
    try {
        const docusignResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const data = await docusignResponse.json();
        
        // DocuSign의 응답을 프론트엔드로 그대로 전달
        res.status(docusignResponse.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "서버 통신 중 에러 발생", details: error.message });
    }
}
