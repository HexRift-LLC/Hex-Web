const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const colors = require('colors');

class ConfigManager {
    static #instance;
    #config;

    constructor() {
        try {
            this.#config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
        } catch (error) {
            console.error('[CONFIG]'.brightRed, 'Failed to load configuration:', error);
            process.exit(1);
        }
    }

    static getInstance() {
        if (!ConfigManager.#instance) {
            ConfigManager.#instance = new ConfigManager();
        }
        return ConfigManager.#instance;
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.#config);
    }
}

async function Auth() {
    const config = ConfigManager.getInstance();
    
    try {
        const url = 'https://api.hexmodz.com/api/client';
        const licensekey = config.get('License.key');
        const product = 'Hex-Web';
        const api_key = '^h&L0d&2aq0d41#uRTMpHmX&FK2HU!gt95oF7jpez$gbP%!&1!BrqBg3qp#k*1@2';
        const hwid = 'PC_IDENTIFIER'; // Using Discord ID as HWID

        const response = await axios.post(
            url,
            {
                licensekey,
                product,
                hwid
            },
            { headers: { Authorization: api_key }}
        );

        if (!response.data.status_code || !response.data.status_id) {
            console.log("――――――――――――――――――――――――――――――――――――");
            console.log('\x1b[31m%s\x1b[0m', 'Your license key is invalid!');
            console.log('\x1b[31m%s\x1b[0m', 'Create a ticket in our discord server to get one.');
            console.log("――――――――――――――――――――――――――――――――――――");
            return process.exit(1);
        }

        if (response.data.status_overview !== "success") {
            console.log("――――――――――――――――――――――――――――――――――――");
            console.log('\x1b[31m%s\x1b[0m', 'Your license key is invalid!');
            console.log('\x1b[31m%s\x1b[0m', 'Create a ticket in our discord server to get one.');
            console.log("――――――――――――――――――――――――――――――――――――");
            return process.exit(1);
        }

        console.log("――――――――――――――――――――――――――――――――――――");
        console.log('\x1b[32m%s\x1b[0m', 'Your license key is valid!');
        console.log('\x1b[36m%s\x1b[0m', "Discord ID: " + response.data.discord_id);
        console.log("――――――――――――――――――――――――――――――――――――");

    } catch (error) {
        console.log("――――――――――――――――――――――――――――――――――――");
        console.log('\x1b[31m%s\x1b[0m', 'License Authentication failed');
        console.log("――――――――――――――――――――――――――――――――――――");
        console.log(error);
        process.exit(1);
    }
}

module.exports = { Auth };
