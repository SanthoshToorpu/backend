import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const petRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();


petRouter
    .get('/pets', async(c) => {
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())

        try {
            const pets = await prisma.pet.findMany();
            return c.json(pets)
        } catch (error) {
            c.status(500);
            console.error('Error fetching all pets:', error);
            return c.json({ error: 'An error occurred while fetching all pets' })
        }
    })
    .get('/pets/:id', async(c) => {
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
          const petId = parseInt(c.req.param('id'))
          try {
            const pet = await prisma.pet.findUnique({
                where: {
                    id: petId,
                },
                include: {
                    owner: true,
                    fines: true,
                },
            });
            if(!pet) {
                return c.json({ error: 'Pet not found' }) 
            }
            return c.json({ pet });
          } catch (error) {
            c.status(500);
            console.error('Error fetching pet by ID:', error);
            return c.json({ error: 'An error occurred while fetching pet by ID' })
          }
    })

export default petRouter