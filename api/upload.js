// api/upload.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { uploadUrl, fileName, fileType, fileBase64 } = req.body;

    try {
        const base64Data = fileBase64.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // [수정됨] 한글/특수문자 에러를 막기 위해 인코딩하되, 공백(%20)은 다시 스페이스로 되돌립니다.
        const encodedFileName = encodeURIComponent(fileName).replace(/%20/g, ' ');

        const putResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": fileType || "application/octet-stream",
                "x-ms-meta-filename": encodedFileName,
                "x-ms-blob-type": "BlockBlob"
            },
            body: buffer 
        });

        if (!putResponse.ok) {
            const errorText = await putResponse.text();
            throw new Error(`Azure 통신 에러 (HTTP ${putResponse.status}): ${errorText}`);
        }

        res.status(200).json({ success: true, message: "File uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: "서버 통신 중 에러 발생", details: error.message });
    }
}
