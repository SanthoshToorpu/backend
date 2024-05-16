import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRouter from './routes/userRoutes'
import adminRouter from './routes/adminRoutes'
import penaltyRouter from './routes/penaltyRoutes'
import sensorRouter from './routes/sensorRouter'
import petRouter from './routes/petRouter'

const app = new Hono()

app.use('/*', cors({
  origin: '*', // Allow requests from any origin
  allowHeaders: ['Content-Type', 'Authorization'], // Allow these request headers
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  exposeHeaders: ['X-Custom-Header'], // Expose these response headers
  maxAge: 600, // Maximum age for CORS preflight requests (in seconds)
  credentials: true, // Allow sending credentials (cookies, authorization headers, etc.) with cross-origin requests
}))

app.route('/api/v1/user', userRouter)
app.route('/api/v1/admin', adminRouter)
app.route('/api/v1/penalty', penaltyRouter)
app.route('/api/v1/sensor', sensorRouter)
app.route('/api/v1/pet', petRouter)

export default app

