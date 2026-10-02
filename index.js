// Created by Famous-Tech & Updated for MongoDB
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for any origin
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Trust the first proxy
app.set('trust proxy', 1);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 mins for development/browsing
    message: {
        error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.'
    }
});

// Appliquer le rate limiting aux routes /api
app.use('/api', limiter);

// Main route that serves the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to submit a new applicant
app.post('/api/applicants', async (req, res) => {
    try {
        const { name, email, whatsapp, github, expertise, experience, message } = req.body;
        
        // Required data validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required' });
        }

        // Vérifier si l'email existe déjà
        const emailExists = await db.checkExistingEmail(email);
        if (emailExists) {
            return res.status(409).json({ 
                error: 'Vous avez déjà postulé avec cette adresse email'
            });
        }
        
        const newApplicant = await db.addApplicant({
            name,
            email,
            whatsapp,
            github,
            expertise,
            experience,
            message
        });
        
        res.status(201).json({ success: true, applicant: newApplicant });
    } catch (error) {
        console.error('Error adding applicant:', error);
        res.status(500).json({ error: 'Server error while adding the applicant' });
    }
});

// Admin panel route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Update applicant status
app.put('/api/applicants/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate the status
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }

        const updatedApplicant = await db.updateApplicantStatus(id, status);
        
        if (!updatedApplicant) {
            return res.status(404).json({ error: 'Candidat non trouvé' });
        }

        res.json({ success: true, applicant: updatedApplicant });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du statut' });
    }
});

// Route to retrieve all applicants (with optional status filter)
app.get('/api/applicants', async (req, res) => {
    try {
        const { status } = req.query;
        const applicants = await db.getAllApplicants(status);
        res.json(applicants);
    } catch (error) {
        console.error('Error retrieving applicants:', error);
        res.status(500).json({ error: 'Server error while retrieving applicants' });
    }
});

// Route to retrieve a specific applicant by ID
app.get('/api/applicants/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const applicant = await db.getApplicantById(id);
        
        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }
        
        res.json(applicant);
    } catch (error) {
        console.error('Error retrieving applicant:', error);
        res.status(500).json({ error: 'Server error while retrieving the applicant' });
    }
});

// Route pour l'authentification admin
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation des données requises
        if (!username || !password) {
            return res.status(400).json({ error: 'Le nom d\'utilisateur et le mot de passe sont requis' });
        }
        
        // Vérifier les identifiants dans la base de données
        const admin = await db.authenticateAdmin(username, password);
        
        if (!admin) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        
        res.json({ 
            success: true, 
            message: 'Authentification réussie',
            admin: { id: admin.id, username: admin.username }
        });
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'authentification' });
    }
});

// Initialize database and start server
db.initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
            console.log(`Access the website at: http://localhost:${PORT}`);
            console.log(`Access Admin panel at: http://localhost:${PORT}/admin`);
        });
    })
    .catch(err => {
        console.error('Error initializing database:', err);
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT} (Database offline)`);
            console.log(`Access the website at: http://localhost:${PORT}`);
            console.log(`Access Admin panel at: http://localhost:${PORT}/admin`);
        });
    });