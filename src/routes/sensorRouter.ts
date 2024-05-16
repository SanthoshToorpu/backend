import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
const sensorRouter = new Hono<{
  Bindings: {
      DATABASE_URL: string,
      JWT_SECRET: string
  }
}>();


sensorRouter
  .post('/data', async(c) => {
      const prisma = new PrismaClient({
          datasourceUrl : c.env?.DATABASE_URL,
        }).$extends(withAccelerate())
      
      const res = await c.req.json();
      try {
        console.log(res)
        return c.json("response is recieved")
      } catch (error) {
        c.status(500);
            console.error('Error fetching pet by ID:', error);
            return c.json({ error: 'An error occurred while fetching pet by ID' })
      }
  })
export default sensorRouter