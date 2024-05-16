import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

const adminRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();


adminRouter
    // Route to sign up as an admin
    .post('/signup', async (c) => {
        // Implementation for admin signup
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const body =await c.req.json();
        try {
            const user = await prisma.user.create({
                data : {
                    username: body.username,
                    password: body.password,
                    email: body.email,
                    isAdmin : true
                }
            })
            const token = await sign({
                id : user.id
            }, c.env.JWT_SECRET)
            console.log("sign in successful", token)
            return c.json(user)
        } catch (error) {
            console.error('Error signing up admin:', error);
            return c.json({ error: 'An error occurred while signing up admin' })
        }
    })
    // Route to sign in as an admin
    .post('/signin', async (c) => {
        // Implementation for admin signin
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const res = await c.req.json()
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username: res.username
                }
            })
            if (!user) {
                c.status(400)
                return c.json({
                    'message': 'user not found',
                  })
            }
            if(user.password != res.password) {
                c.status(400)
                return c.json({
                    'message': 'incorrect password',
                  })
            }
            if (!user.isAdmin) {
                c.status(400)
                return c.json({
                    'message': 'user is not an admin',
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
            
        }
    })
    // Route to add a user
    .post('/users/add', async (c) => {
        // Implementation for adding a user
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const body = await c.req.json();
    try {
        const newUser = await prisma.user.create({
            data: { 
                username:body.username, 
                password: body.password, 
                email : body.email
            }
        });
        c.status(201);
        return c.json({ message: 'User added successfully', data: newUser })
    } catch (error) {
        c.status(500);
        console.error('Error adding user:', error);
        return c.json({ error: 'An error occurred while adding user' })
    }
    })
    // Route to delete a user
    .delete('/users/:id', async (c) => {
        // Implementation for deleting a user
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const userId = parseInt(c.req.param('id'));
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        c.status(200)
        return c.json({ message: 'User deleted successfully' })
    } catch (error) {
        c.status(500);
        console.error('Error deleting user:', error);
        return c.json({ error: 'An error occurred while deleting user' })
    }
    })
    // Route to get all users
    .get('/users', async (c) => {
        // Implementation for getting all users
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        try {
            const users = await prisma.user.findMany({
                where: { isAdmin: false }
            });
            c.status(200);
            return c.json({ data: users })
        } catch (error) {
            c.status(500);
            console.error('Error getting users:', error);
            return c.json({ error: 'An error occurred while getting users' })
        }
    })
    // Route to add a pet
    .post('/pets/add', async (c) => {
        // Implementation for adding a pet
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const body = await c.req.json();
    try {
        const newPet = await prisma.pet.create({
            data: { 
                name: body.name, 
                breed: body.breed,
                age: body.age,
                ownerId: body.ownerId,
            }
        });
        c.status(201);
        console.log('Pet added successfully', newPet)
        return c.json({ message: 'Pet added successfully', data: newPet })
    } catch (error) {
        c.status(500);
        console.error('Error adding pet:', error);
        return c.json({ error: 'An error occurred while adding pet' })
    }
    })
    // Route to delete a pet
    .delete('/pets/:id', async (c) => {
        // Implementation for deleting a pet
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const petId = parseInt(c.req.param('id'));
    try {
        await prisma.pet.delete({
            where: { id: petId }
        });
        c.status(200);
        return c.json({ message: 'Pet deleted successfully' })
    } catch (error) {
        console.error('Error deleting pet:', error);
        c.status(500);
        return c.json({ error: 'An error occurred while deleting pet' })
    }
    })
    // Route to get all pets
    .get('/pets', async (c) => {
        // Implementation for getting all pets
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        try {
            const pets = await prisma.pet.findMany();
            c.status(200);
            return c.json({ data: pets })
        } catch (error) {
            console.error('Error getting pets:', error);
            c.status(500);
            return c.json({ error: 'An error occurred while getting pets' })
        }
    })
    // Route to see all fines with pet name and owner name
    .get('/fines', async (c) => {
        // Implementation for getting all fines with pet name and owner name
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        try {
            const fines = await prisma.fine.findMany({
                include: { user: true, pet: true }
            });
            c.status(200);
            return c.json({ data: fines })
        } catch (error) {
            console.error('Error getting fines:', error);
            c.status(500);
            return c.json({ error: 'An error occurred while getting fines' })
        }
    })
    // Route to add a fine
    .post('/fines/add', async (c) => {
        // Implementation for adding a fine
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const { userId, petId, amount, reason } = await c.req.json();
    try {
        const newFine = await prisma.fine.create({
            data: { userId, petId, amount, reason }
        });
        c.status(201);
        return c.json({ message: 'Fine added successfully', data: newFine })
    } catch (error) {
        console.error('Error adding fine:', error);
        c.status(500);
        return c.json({ error: 'An error occurred while adding fine' })
    }
    })
    // Route to delete a fine
    .delete('/fines/:id', async (c) => {
        // Implementation for deleting a fine
        const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL,
          }).$extends(withAccelerate())
        const fineId = parseInt(c.req.param('id'));
    try {
        await prisma.fine.delete({
            where: { id: fineId }
        });
        c.status(200);
        return c.json({ message: 'Fine deleted successfully' })
    } catch (error) {
        console.error('Error deleting fine:', error);
        c.status(500);
        return c.json({ error: 'An error occurred while deleting fine' })
    }
    });


export default adminRouter;