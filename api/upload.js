// api/upload.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // 1. 프론트엔드에서 보낸 파일 정보와 Azure URL을 받습니다.
    const { uploadUrl, fileName, fileType, fileBase64 } = req.body;

    try {
        // 2. Base64 문자열을 순수 바이너리(Buffer) 형태로 다시 변환합니다.
        // (프론트엔드에서 넘어온 'data:application/pdf;base64,' 접두사를 제거)
        const base64Data = fileBase64.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const encodedFileName = encodeURIComponent(fileName);

        // 3. Vercel 서버가 Azure 서버로 직접 슛을 날립니다. (CORS 무사통과!)
        const putResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": fileType || "application/octet-stream",
                "x-ms-meta-filename": encodedFileName,
                "x-ms-blob-type": "BlockBlob"
            },
            body: buffer // 바이너리 실물 전송
        });

        if (!putResponse.ok) {
            const errorText = await putResponse.text();
            throw new Error(`Azure 통신 에러 (HTTP ${putResponse.status}): ${errorText}`);
        }

        res.status(200).json({ success: true, message: "File uploaded to Azure successfully" });
    } catch (error) {
        res.status(500).json({ error: "서버 통신 중 에러 발생", details: error.message });
    }
}
