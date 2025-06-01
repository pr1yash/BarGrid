// index.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; // Add this
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Explicit JSON parser for ESM setup

// Test Route
app.get('/', (req, res) => {
    res.send('BarGrid API is up and running!');
});

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
    console.log('Received /team POST:', req.body); // Debug log

    try {
        const newMember = await prisma.teamMember.create({
            data: { name, role, userId },
        });
        res.json(newMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all shifts
app.get('/shifts', async (req, res) => {
    try {
        const shifts = await prisma.shift.findMany({
            include: { teamMember: true }, // Optional: include related team member info
        });
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a shift
app.post('/shifts', async (req, res) => {
    console.log('Received /shifts POST:', req.body); // Debug log

    const { teamMemberId, day, startTime, endTime } = req.body;
    try {
        const newShift = await prisma.shift.create({
            data: { teamMemberId, day, startTime, endTime },
        });
        res.json(newShift);
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

// Update a shift (Optional)
app.patch('/shifts/:id', async (req, res) => {
    const { id } = req.params;
    const { day, startTime, endTime, teamMemberId } = req.body;
    try {
        const updatedShift = await prisma.shift.update({
            where: { id: Number(id) },
            data: { day, startTime, endTime, teamMemberId },
        });
        res.json(updatedShift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { teamMembers: true }, // Optional
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


// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`BarGrid API listening on http://localhost:${PORT}`);
});
