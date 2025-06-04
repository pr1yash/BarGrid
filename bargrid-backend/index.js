import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('BarGrid API is up and running!');
});

// TEAM ROUTES

// Get all team members
app.get('/team', async (req, res) => {
    try {
        const team = await prisma.teamMember.findMany();
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a team member
app.post('/team', async (req, res) => {
    const { name, role, userId } = req.body;
    try {
        const newMember = await prisma.teamMember.create({
            data: { name, role, userId },
        });
        res.json(newMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a team member
app.patch('/team/:id', async (req, res) => {
    const { id } = req.params;
    const {
        name,
        role,
        userId,
        shiftPreference,
        mustHaveDays,
        numberOfDays
    } = req.body;

    try {
        const updatedMember = await prisma.teamMember.update({
            where: { id: Number(id) },
            data: {
                ...(name && { name }),
                ...(role && { role }),
                ...(userId && { userId }),
                ...(shiftPreference && { shiftPreference }),
                ...(mustHaveDays && { mustHaveDays }),
                ...(numberOfDays !== undefined && { numberOfDays }),
            },
        });
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete a team member
app.delete('/team/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.teamMember.delete({
            where: { id: Number(id) },
        });
        res.json({ message: `Team member ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SHIFTS ROUTES

// Get all shifts
app.get('/shifts', async (req, res) => {
    try {
        const shifts = await prisma.shift.findMany({
            include: { teamMembers: true },
        });
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a shift
app.post('/shifts', async (req, res) => {
    const { day, startTime, endTime, teamMemberIds } = req.body;
    try {
        const newShift = await prisma.shift.create({
            data: {
                day,
                startTime,
                endTime,
                teamMembers: {
                    connect: teamMemberIds.map(id => ({ id })),
                },
            },
        });
        res.json(newShift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a shift
app.patch('/shifts/:id', async (req, res) => {
    const { id } = req.params;
    const { day, startTime, endTime, teamMemberIds } = req.body;
    try {
        const updatedShift = await prisma.shift.update({
            where: { id: Number(id) },
            data: {
                day,
                startTime,
                endTime,
                teamMembers: {
                    set: teamMemberIds.map(id => ({ id })),
                },
            },
        });
        res.json(updatedShift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a shift
app.delete('/shifts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.shift.delete({
            where: { id: Number(id) },
        });
        res.json({ message: `Shift ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// USERS ROUTES

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { teamMembers: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a user
app.post('/users', async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, email, role },
        });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`BarGrid API listening on http://localhost:${PORT}`);
});
