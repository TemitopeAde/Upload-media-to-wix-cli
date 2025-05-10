import { generateWixUploadUrl, getWixAccessToken } from "../utils/utils.js";
import multer from "multer";
import fs from "fs";
import tus from "tus-js-client";
import httpClient from "axios";

const upload = multer({ dest: "uploads/" });

export const mediaUpload = async (req, res) => {
  try {
    upload.single("file")(req, res, async err => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "File upload error.",
          error: err.message
        });
      }

      const file = req.file;
      const mimeType = file.mimetype;
      const fileName = file.originalname;
      const sizeInBytes = file.size;

      if (!mimeType || !fileName || !sizeInBytes) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: mimeType, fileName, sizeInBytes"
        });
      }

      const accessToken = await getWixAccessToken();
      const uploadData = await generateWixUploadUrl(accessToken.access_token, {
        mimeType,
        fileName,
        sizeInBytes,
        isPrivate: false,
        uploadProtocol: "TUS"
      });
      const filePath = file.path;
      const fileStream = fs.createReadStream(filePath);
      const stats = fs.statSync(filePath);
      const tusUpload = new tus.Upload(fileStream, {
        endpoint: uploadData.uploadUrl,
        metadata: {
          filename: fileName,
          filetype: mimeType,
          token: uploadData.uploadToken
        },
        uploadSize: stats.size,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        onError: error => {
          console.error("Upload failed:", error);
          console.error("Error response:", error.originalResponse);
          fs.unlink(filePath, unlinkErr => {
            if (unlinkErr) {
              console.error(
                "Failed to delete temp file after error:",
                unlinkErr
              );
            } else {
              console.log("Temp file deleted after upload error.");
            }
          });
          return res.status(500).json({
            success: false,
            message: "File upload failed.",
            error: error.message
          });
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          console.log(
            `Progress: ${bytesUploaded} / ${bytesTotal} (${percentage}%)`
          );
        },
        onSuccess: async () => {
          console.log("Upload finished:", tusUpload.url);
          try {
            const result = await finalizeUpload(uploadData, fileName);
            fs.unlink(filePath, unlinkErr => {
              if (unlinkErr) {
                console.error(
                  "Failed to delete temp file after success:",
                  unlinkErr
                );
              } else {
                console.log("Temp file deleted after successful upload.");
              }
            });
            return res.status(200).json({
              success: true,
              message: "File uploaded successfully.",
              fileUrl: result
            });
          } catch (error) {
            return res.status(500).json({
              success: false,
              message: "Error finalizing upload.",
              error: error.message
            });
          }
        }
      });

      tusUpload.start();
    });
  } catch (error) {
    console.error("Media upload error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};

const finalizeUpload = async (resumableUploadUrlResponse, fileName) => {
  try {
    console.log("Finalizing upload...");
    const result = await httpClient.put(
      `${resumableUploadUrlResponse.uploadUrl}/${resumableUploadUrlResponse.uploadToken}`,
      {},
      { params: { filename: fileName } }
    );
    console.log({ result: result.data });
    return result.data;
  } catch (error) {
    console.error("Failed to finalize the upload:", error);
    throw error;
  }
};
