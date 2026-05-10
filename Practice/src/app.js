import express from 'express';

const app = express();
app.use(express.json());

app.post('/notes', (req, res) => {
    res = req.body;
})

export default app;