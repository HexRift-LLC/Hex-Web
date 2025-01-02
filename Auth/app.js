const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
const sgMail = require('@sendgrid/mail');
const colors = require("colors");
const { Auth } = require("./Auth");

// Enhanced authentication with retry logic
async function authenticate(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await Auth();
            console.log("[AUTH]".green, "Hex Web: Authentication successful!");
            return true;
        } catch (error) {
            console.log("[AUTH]".yellow, `Attempt ${i + 1}/${retries} failed:`, error.message);
            if (i === retries - 1) {
                console.log("[AUTH]".brightRed, "Authentication failed after all attempts");
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// Start the server after authentication is successful
async function startServer() {
    const authenticated = await authenticate();
    if (authenticated) {
        const app = express();
        const PORT = config.Server.Port || 3100;

        // Set your SendGrid API Key
        sgMail.setApiKey(config.Email.SendGridToken);

        // Add compression for better performance
        app.use(compression());

        // Middleware to parse form data
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // Set EJS as the template engine
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, 'views'));

        // Middleware to serve static files
        app.use(express.static(path.join(__dirname, 'public')));

        // Routes
        app.get('/', (req, res) => {
            res.render('index', { title: config.Server.Name });
        });

        // Handle form submission
        app.post('/submit-form', async (req, res) => {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const msg = {
                to: config.Email.ToEmail, // Replace with your email address
                from: config.Email.fromEmail, // Replace with your verified SendGrid sender email
                subject: `New Contact Form Submission from ${name}`,
                text: `You have received a new message from ${name} (${email}):\n\n${message}`,
            };

            try {
                await sgMail.send(msg);
                res.status(200).json({ message: 'Email sent successfully!' });
            } catch (error) {
                console.error('Error sending email:', error.response ? error.response.body : error);
                res.status(500).json({ error: 'Failed to send email. Please try again later.' });
            }
        });

        app.get('/store', (req, res) => {
            // Pass the title and products to the EJS template
            res.render('store', {
                title: config.Server.Name,
                products: config.Store.Products // Pass the products from the YAML file
            });
            res.on('finish', () => {
                res.write('<script>window.scrollTo({top: 0, behavior: "smooth"});</script>');
            });
        });
        // Handle form submission
        app.post('/submit-form', async (req, res) => {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const msg = {
                to: config.Email.ToEmail, // Replace with your email address
                from: config.Email.fromEmail, // Replace with your verified SendGrid sender email
                subject: `New Contact Form Submission from ${name}`,
                text: `You have received a new message from ${name} (${email}):\n\n${message}`,
            };

            try {
                await sgMail.send(msg);
                res.status(200).json({ message: 'Email sent successfully!' });
            } catch (error) {
                console.error('Error sending email:', error.response ? error.response.body : error);
                res.status(500).json({ error: 'Failed to send email. Please try again later.' });
            }
        });

        // 404 handler
        app.use((req, res) => {
            res.status(404).render('error-404', { title: config.Server.Name });
        });

        // Error handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).render('error-500', { title: config.Server.Name });
        });

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
}

startServer();
