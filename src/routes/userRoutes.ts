import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();


userRouter
    .post('/signin', async(c) => {
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        
        const res = await c.req.json();
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username: res.username
                }
            })
            if(!user) {
                c.status(400)
                return c.json({
                    'message': 'user not found',
                  })
            }

            const token = await sign({
                id : user.id
            }, c.env.JWT_SECRET)
            console.log("sign in successful")
            return c.json({
                'token': token
            })
        } catch (error) {
            console.log(error)
            c.status(500)
            return c.text('something went wrong')
        }
    })
    .get('/home/:id', async(c) => {
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const userId = parseInt(c.req.param('id'))
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id : userId,
                },
                include: { pets: true, fines: true },
            })
            
            if (!user) {
                c.status(404);
                return c.json({ error: 'User not found' })
            }
    
            return c.json(user)
        } catch (error) {
            c.status(500);
            console.error('Error fetching user details:', error);
            return c.json({ error: 'An error occurred while fetching user details' })
        }

    })

export default userRouter