import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { mediaUpload } from './controllers/controller.js';
import { createClient, AppStrategy } from '@wix/sdk';
import { customTriggers } from '@wix/ecom/service-plugins';

const app = express()
app.use(cors("*"))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})


const wixClient = createClient({
  auth: AppStrategy({
    appId: "0a3fffa5-066c-4fc3-b7af-7138928b62c1",
    publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiCmHJHomL1g7SWvgd9tu
CKy/WXMAmemd2RfzR+6M4VD76OPswZwofQZPQ8ShMMLJ86MfpWQMIwNZu07F3Waw
+3bWbuZBXspHcAaFMuZq8xTegDS8CSExOgTCjYV/uAJV1YQYfVQTLKFJ4bdlg7lu
oLreUy/lq5zzHols8jZF64PVVEhsi1IPoqBgp3VPqMr+Zn2DODSJpslRcne7Q0FD
mlRS3dGyEGPf7J0Jn/VD6GvSohwWCZcivxfnAIgoCEZUicqLGMrqG29hz/5TWWAj
XhDDwZS8EgYkKQ+3coG87DVLOXRP1CI8t+8x80xYn+fM1VVyG/u/SiyLLYV4qJiQ
7QIDAQAB
-----END PUBLIC KEY-----`
  }),
  modules: {
    customTriggers
  }
});

wixClient.customTriggers.publicProvideHandlers({
  getEligibleTriggers: async (payload) => {
    try {
      const { request, metadata } = payload

      console.log("get", metadata, request);
    } catch (error) {
      console.log(error);

    }

  },

  listTriggers: async (payload) => {
    try {
      const { request, metadata } = payload

      console.log("list", metadata, request);
    } catch (error) {
      console.log(error);

    }

  },
})

app.post('/api/v1/upload', mediaUpload)

app.post("v1/getEligibleTriggers", (req, res) => {
  try {
    const body = req.body
    console.log(body);

    res.status(200).json({
      message: true,
      data: body
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error
    })
  }
})
app.post("v1/getEligibleTriggers", (req, res) => {
  try {
    const body = req.body
    console.log(body);

    res.status(200).json({
      message: true,
      data: body
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error
    })
  }
})


app.post("v1/list-triggers", (req, res) => {
  try {
    const body = req.body
    console.log(body);

    res.status(200).json({
      message: true,
      data: body
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error
    })
  }
})
app.post("v1/get-eligible-triggers", (req, res) => {
  try {
    const body = req.body
    console.log(body);

    res.status(200).json({
      message: true,
      data: body
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error
    })
  }
})


app.post("/v1/list-triggers", (req, res) => {
  try {
    const body = req.body
    console.log(body);

    res.status(200).json({
      message: true,
      data: body
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error
    })
  }
})
app.post("/v1/get-eligible-triggers", (req, res) => {
  try {
    const body = req.body
    console.log(body);

    res.status(200).json({
      message: true,
      data: body
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error
    })
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});