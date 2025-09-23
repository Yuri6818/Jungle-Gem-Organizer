import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// Optional: endpoint to echo tasks if needed later
app.post('/api/echo', (req, res) => {
  res.json({ received: req.body })
})

const port = process.env.PORT ? Number(process.env.PORT) : 5174
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

