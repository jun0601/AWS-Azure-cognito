import React, { useState, useEffect } from "react";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getCognitoTokensFromUrl } from "./utils/tokenUtils";
import { REGION, IDENTITY_POOL_ID, USER_POOL_ID, BUCKET } from "./awsConfig";
const S3Manager = () => {
  const [objects, setObjects] = useState([]);
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");
  const [url, setUrl] = useState("");
  const getS3Client = async () => {
    const { idToken } = getCognitoTokensFromUrl();
    return new S3Client({
      region: REGION,
      credentials: fromCognitoIdentityPool({
        identityPoolId: IDENTITY_POOL_ID,
        logins: {
          [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
        },
        region: REGION,
      }),
    });
  };
  const listObjects = async () => {
    try {
      const client = await getS3Client();
      const result = await client.send(new ListObjectsV2Command({ Bucket: BUCKET }));
      setObjects(result.Contents || []);
    } catch (err) {
      console.error("List 실패:", err);
    }
  };
  const uploadFile = async () => {
    if (!file) return;
    try {
      const client = await getS3Client();
      await client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: file.name,
          Body: await file.arrayBuffer(),
          ContentType: file.type,
        })
      );
      alert("✅ 업로드 성공");
      setKey(file.name);
      listObjects();
    } catch (err) {
      alert("❌ 업로드 실패: " + err.message);
    }
  };
  const generateDownloadUrl = async () => {
    if (!key) return;
    try {
      const client = await getS3Client();
      const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
      const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 });
      setUrl(signedUrl);
    } catch (err) {
      alert("❌ URL 생성 실패: " + err.message);
    }
  };
  useEffect(() => {
    listObjects();
  }, []);
  return (
    <div>
      <h3>🗂️ S3 파일 관리</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>업로드</button>
      <h4>📦 오브젝트 목록</h4>
      <ul>
        {objects.map((obj) => (
          <li key={obj.Key}>{obj.Key}</li>
        ))}
      </ul>
      <input placeholder="다운로드 Key" onChange={(e) => setKey(e.target.value)} />
      <button onClick={generateDownloadUrl}>다운로드 링크 생성</button>
      {url && (
        <p>
          🔗 <a href={url} target="_blank" rel="noreferrer">다운로드 링크</a>
        </p>
      )}
    </div>
  );
};
export default S3Manager;