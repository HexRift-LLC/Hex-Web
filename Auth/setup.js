const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const configDir = './config';
const configPath = path.join(configDir, 'config.yml');

// Create config directory if it doesn't exist
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

// Install and setup dependencies
if (!fs.existsSync('node_modules/colors')) {
    console.log('\nInstalling colors package...\n');
    try {
        execSync('npm install colors', { stdio: 'inherit' });
    } catch (error) {
        console.error('Failed to install colors package');
        process.exit(1);
    }
}

// Now we can require and use colors
const colors = require('colors');

// Then install remaining dependencies
if (!fs.existsSync('node_modules')) {
    console.log('[Installer]:'.cyan, 'Installing required dependencies...\n');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('[Installer]:'.green, 'Dependencies installed successfully!\n');
    } catch (error) {
        console.log('[Installer]:'.red, 'Failed to install dependencies. Please run npm install manually.\n');
        process.exit(1);
    }
}

const inquirer = require('inquirer');
const yaml = require('js-yaml');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');
const { Auth } = require('./Auth');

async function displayWelcome() {
    console.clear();
    console.log('\n');
    console.log(chalk.cyan(figlet.textSync('Hex Web', {
        font: 'Big',
        horizontalLayout: 'full'
    })));
    console.log('\n');
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.white.bold('                Welcome to Hex Web Wizard'));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

async function setupWizard() {
    try {
        await displayWelcome();
        console.log("[Wizard]:".cyan, `Auth Configuration\n`); 
        const authConfig = await inquirer.prompt([
            {
                type: 'input',
                name: 'license',
                message: console.log("[System]:".cyan, `License Key:`),
                default: 'XXX-XXX-XXX-XXX'
            }
        ]);

        // Create temporary config file for auth check
        const tempConfig = {
            Auth: authConfig
        };
        fs.writeFileSync('./config/config.yml', yaml.dump(tempConfig));

        // Verify authentication
        console.log("[Auth]:".yellow, `Verifying license...`); 
        const isAuthenticated = await Auth();
        
        if (!isAuthenticated) {
            console.log("[Auth]:".red, `Authentication failed. Please check your license key.`); 
            process.exit(1);
        }
        console.log("[Auth]:".green, `License verified successfully!`); 
        

        // System Configuration
        console.log("[Wizard]:".cyan, `System Configuration\n`);
        const systemConfig = await inquirer.prompt([
            {
                type: 'number',
                name: 'Port',
                message: 'Port number:',
                default: 3000
            },
            {
                type: 'input',
                name: 'api_key',
                message: 'SendGrid API Key:',
                default: 'YOUR_SENDGRID_API_KEY'
            },
            {
                type: 'input',
                name: 'from_email',
                message: 'From Email:',
                default: 'your-verified@email.com'
            },
            {
                type: 'input',
                name: 'to_email',
                message: 'To Email:',
                default: 'recipient@email.com'
            }
        ]);

        // Colors Configuration
        console.log("[Wizard]:".cyan, `Theme Colors Configuration\n`);
        const colorsConfig = await inquirer.prompt([
            {
                type: 'input',
                name: 'primary-red',
                message: 'Primary Red:',
                default: '#ff1744'
            },
            {
                type: 'input',
                name: 'dark-red',
                message: 'Dark Red:',
                default: '#d50000'
            },
            {
                type: 'input',
                name: 'black',
                message: 'Black:',
                default: '#121212'
            },
            {
                type: 'input',
                name: 'dark-gray',
                message: 'Dark Gray:',
                default: '#1e1e1e'
            },
            {
                type: 'input',
                name: 'card-bg',
                message: 'Card Background:',
                default: '#1a1a1a'
            },
            {
                type: 'input',
                name: 'text-primary',
                message: 'Text Primary:',
                default: '#ffffff'
            },
            {
                type: 'input',
                name: 'text-secondary',
                message: 'Text Secondary:',
                default: '#b3b3b3'
            }
        ]);

        // Site Configuration
        console.log("[Wizard]:".cyan, `Site Configuration\n`);
        const siteConfig = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Site Name:',
                default: 'Hex-Web'
            },
            {
                type: 'input',
                name: 'tagline',
                message: 'Site Tagline:',
                default: 'Crafting Digital Excellence'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Site Description:',
                default: 'Crafting Digital Excellence'
            },
            {
                type: 'input',
                name: 'url',
                message: 'Site URL:',
                default: 'https://hex-web.hexmodz.com/'
            }
        ]);

        // Contact Configuration
        console.log("[Wizard]:".cyan, `Contact Configuration\n`);
        const contactConfig = await inquirer.prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Contact Email:',
                default: 'info@hexweb.com'
            },
            {
                type: 'input',
                name: 'phone',
                message: 'Contact Phone:',
                default: '+1 (555) 123-4567'
            },
            {
                type: 'input',
                name: 'address',
                message: 'Address:',
                default: '123 Tech Street, Digital City'
            }
        ]);

        // Store Configuration
        console.log("[Wizard]:".cyan, `Store Configuration\n`);
        const storeConfig = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Store Title:',
                default: 'Our Products'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Store Description:',
                default: 'Explore our premium digital solutions'
            }
        ]);

        const config = {
            Auth: authConfig,
            System: {
                ...systemConfig,
                subject: 'New Contact Form Submission',
                version: '4.0.0'
            },
            colors: colorsConfig,
            site: siteConfig,
            hero: {
                title: 'Welcome to Hex-Web',
                description: 'Crafting Digital Excellence',
                buttons: [
                    { text: 'Get Started', class: 'primary' },
                    { text: 'Our Work', class: 'secondary' }
                ]
            },
            about: {
                title: 'About Us',
                cards: [
                    {
                        icon: 'fa-rocket',
                        title: 'Innovation',
                        text: 'Pushing boundaries with cutting-edge technology and creative solutions for the digital age.'
                    },
                    {
                        icon: 'fa-lightbulb',
                        title: 'Creativity',
                        text: 'Transforming ideas into stunning digital experiences that captivate and engage.'
                    },
                    {
                        icon: 'fa-chart-line',
                        title: 'Growth',
                        text: 'Driving business success through strategic digital solutions and measurable results.'
                    }
                ]
            },
            services: {
                title: 'Our Services',
                cards: [
                    {
                        icon: 'fa-code',
                        title: 'Web Development',
                        text: 'Custom websites and web applications built with modern technologies and best practices.'
                    },
                    {
                        icon: 'fa-palette',
                        title: 'UI/UX Design',
                        text: 'User-centered design solutions that create seamless and engaging digital experiences.'
                    },
                    {
                        icon: 'fa-mobile-alt',
                        title: 'Mobile Development',
                        text: 'Native and cross-platform mobile applications that deliver exceptional performance.'
                    }
                ]
            },
            contact: {
                title: 'Get In Touch',
                description: "Ready to start your next project? We're here to help bring your vision to life.",
                info: contactConfig,
                form: {
                    fields: [
                        { type: 'text', placeholder: 'Your Name' },
                        { type: 'email', placeholder: 'Your Email' },
                        {
                            type: 'select',
                            placeholder: 'Select Service',
                            options: ['Web Development', 'UI/UX Design', 'Mobile Development']
                        },
                        { type: 'textarea', placeholder: 'Your Message' }
                    ],
                    button: 'Send Message'
                }
            },
            store: {
                ...storeConfig,
                products: [
                    {
                        name: "Web Development Package",
                        description: "Custom website development with modern technologies",
                        price: "$9.99",
                        image: "/images/Hex-Status.png",
                        features: ["Responsive Design", "SEO Optimization", "Content Management System"],
                        store_url: "https://your-store.com/web-dev-package"
                    },
                    {
                        name: "Mobile App Package",
                        description: "Native mobile application development",
                        price: "$14.99",
                        image: "/images/Hex-Web.png",
                        features: ["iOS & Android", "Push Notifications", "Analytics Integration"],
                        store_url: "https://your-store.com/mobile-app-package"
                    }
                ]
            },
            footer: {
                company_info: {
                    title: 'Hex-Web',
                    description: 'Creating amazing digital experiences'
                },
                social: [
                    { icon: 'fa-twitter', link: '#' },
                    { icon: 'fa-linkedin', link: '#' },
                    { icon: 'fa-github', link: '#' }
                ],
                copyright: '© 2024 - 2025 Hex Modz.'
            }
        };

        console.log("[System]:".yellow, `Saving configuration...`);
        fs.writeFileSync(configPath, yaml.dump(config));
        console.log("[System]:".green, `Configuration saved successfully!`);
        console.log("[System]:".green, `Setup complete! Hex Web is ready to go.`);
        console.log("[System]:".cyan, `Start Hex Web with: npm start\n`);

    } catch (error) {
        console.log("[System]:".red, `Error during setup:`, error);
        process.exit(1);
    }
}

if (!fs.existsSync(configPath)) {
    setupWizard();
} else {
    console.log("[System]:".red, `Configuration file already exists at ${configPath}. Delete it to run setup again.`);
}