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
    client_id: "5608e46e-7302-4d54-85f6-688d8c1973e5",
    client_secret: "bb4f2ea9-5eec-48f4-8013-6980220acf7b",
    instance_id: "e5c9cee9-10c2-4274-afbb-6237e6e32ad6"
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