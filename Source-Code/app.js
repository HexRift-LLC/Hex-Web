const express = require('express');
const app = express();
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const colors = require("colors");
const config = yaml.load(fs.readFileSync('./config/config.yml', 'utf8'));

// Server initialization function
async function startServer() {
    // Configure express app
    app.locals.config = config;
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.get('/', (req, res) => {
        res.render('index', { path: '/' });
    });
    
    app.get('/store', (req, res) => {
        res.render('store', { path: '/store' });
    });
    

    // SendGrid configuration
    sgMail.setApiKey(config.System.api_key);

    // Contact form handler
    app.post('/contact', async (req, res) => {
        const { name, email, service, message } = req.body;
        
        const msg = {
            to: config.System.to_email,
            from: config.System.from_email,
            subject: config.System.subject,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        try {
            await sgMail.send(msg);
            res.json({ success: true });
        } catch (error) {
            console.error("[System]".red, "Failed to send email:", error);
            res.status(500).json({ error: 'Failed to send email' });
        }
    });

    // Start server
    const PORT = config.System.Port || 3000;
    app.listen(PORT, () => {
        console.log("[System]".green, "Hex Web:", 'is loading');
        console.log("[System]".cyan, "Version:", `${config.System.version}`);
        console.log("[System]".yellow, "Hex Web:", `running on port ${PORT}`);
    });
}
// Start server
startServer();
