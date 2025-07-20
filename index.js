import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { mediaUpload } from './controllers/controller.js';
import { getEligibleTriggers } from './controllers/discount.js';

const app = express()
app.use(cors("*"))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/api/v1/upload', mediaUpload)
app.post("/v1/getEligibleTriggers", getEligibleTriggers)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});