import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const penaltyRouter = new Hono<{
        Bindings: {
            DATABASE_URL: string,
            JWT_SECRET: string
        }
    }
>();

penaltyRouter
    .get('/query', async(c) => {
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())

        const {latitude, longitude, timestamp} = await c.req.json();
        try {
            const pettrackerdata = await prisma.petTracker.findMany({
                where:{
                    latitude: parseFloat(latitude), // Convert latitude to float
                    longitude: parseFloat(longitude), // Convert longitude to float
                    timestamp: new Date(timestamp)
                }
            })
    
            return c.json(pettrackerdata)
        } catch (error) {
            console.error('Error querying PetTracker table:', error);
            c.status(500)
            return c.json({ error: 'Internal Server Error' });
        }
    })
    .post('/penalize', async(c) => {
        try {
            const prisma = new PrismaClient({
                datasourceUrl : c.env?.DATABASE_URL,
              }).$extends(withAccelerate())

            // Extract pet tracker data from the request body
            // const { petId, latitude, longitude, timestamp } = await c.req.json();
            const { petId } = await c.req.json();
    
            // Query the PetTracker table to find the pet tracker data
            const petTracker = await prisma.petTracker.findFirst({
                where: {
                    petId: petId,
                    // latitude: latitude,
                    // longitude: longitude,
                    // timestamp: timestamp
                }
            });
    
            if (!petTracker) {
                return c.json({ error: 'Pet tracker data not found' }, 404);
            }
            
            const pet = await prisma.pet.findUnique({
                where: {
                    id: petTracker.petId
                },
                include: {
                    owner: true
                }
            });

            if (!pet) {
                return c.json({ error: 'Pet not found' }, 404);
            }
            
            const penaltyAmount = 50;
    
            // Create a new fine record in the database
        const newFine = await prisma.fine.create({
            data: {
                userId: pet.owner.id,
                amount: penaltyAmount,
                reason: 'Anomaly detected',
                petId: petId
            }
        });
    
            return c.json({ message: 'Penalty applied successfully', fine: newFine });
        } catch (error) {
            console.error('Error applying penalty:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    })

export default penaltyRouter