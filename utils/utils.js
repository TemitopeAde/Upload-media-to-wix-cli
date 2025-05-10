import axios from "axios";
import fs from 'fs';
import tus from 'tus-js-client';


export const uploadToWixMedia = (filePath, uploadUrl) => {
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);

    const upload = new tus.Upload(file, {
      endpoint: uploadUrl,
      uploadUrl,
      metadata: {
        filename: filePath,
        filetype: "image/jpeg"
      },
      uploadSize: stats.size,
      onError: (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      onSuccess: () => {
        console.log("Upload finished:", upload.url);
        resolve(upload.url);
      }
    });

    upload.start();
  });
};


export async function generateWixUploadUrl(accessToken, {
  mimeType,
  fileName,
  sizeInBytes,
  isPrivate = false,
  uploadProtocol = 'TUS'
}) {
  const url = 'https://www.wixapis.com/site-media/v1/files/generate-resumable-upload-url';

  const data = {
    mimeType,
    fileName,
    sizeInBytes: String(sizeInBytes),
    private: isPrivate,
    uploadProtocol
  };
  

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    // console.log({accessToken});
    

    console.log('Upload URL Response:', response.data);
    return response.data;
  } catch (error) {
   
    console.error('Error generating upload URL:', error.response?.data.details.validationError.fieldViolations || error.message);
    return error?.message
  }
}

export async function getWixAccessToken() {
  const url = 'https://www.wixapis.com/oauth2/token';

  const data = {
    grant_type: 'client_credentials',
    client_id: 'beb320c4-03d1-44c1-9e2a-3982b7ea8bde',
    client_secret: 'a3b036b4-8ff4-4b9a-a906-82504f45681f',
    instance_id: '2a44f71f-0dbb-411a-9826-501e4359108c'
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Wix token:', error.response?.data || error.message);
  }
}