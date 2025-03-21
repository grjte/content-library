#!/usr/bin/env node

const { AtpAgent } = require('@atproto/api')
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function publishLexicon(agent, lexiconFilePath) {
    try {
        const content = await fs.readFile(lexiconFilePath, 'utf8');
        const lexicon = JSON.parse(content);

        // Wrap the lexicon by adding the $type field.
        lexicon['$type'] = 'com.atproto.lexicon.schema';

        console.log(`Publishing lexicon: ${lexicon.id} from file ${lexiconFilePath}`);
        const response = await agent.api.com.atproto.repo.putRecord({
            repo: agent.session.did,
            collection: 'com.atproto.lexicon.schema',
            record: lexicon,
            rkey: lexicon.id,
        });

        console.log(`Published ${lexicon.id} successfully!`);
        console.log(`URI: ${response.data.uri}`);
        console.log(`CID: ${response.data.cid}`);
        console.log(`Validation status: ${response.data.validationStatus}`);
    } catch (err) {
        console.error(`Error publishing lexicon from file ${lexiconFilePath}:`, err);
    }
}

async function main() {
    // Expect the lexicons directory as the first argument.
    const lexiconsDir = process.argv[2];
    if (!lexiconsDir) {
        console.error('Usage: node publishLexicons.js <path-to-lexicons-directory>');
        process.exit(1);
    }

    // Check environment variables.
    const service = process.env.PDS_URL;
    const handle = process.env.HANDLE;
    const password = process.env.PASSWORD;
    if (!service || !handle || !password) {
        console.error('Please set PDS_URL, HANDLE, and PASSWORD environment variables.');
        process.exit(1);
    }

    // Initialize the AT Protocol agent.
    const agent = new AtpAgent({ service });

    try {
        await agent.login({ identifier: handle, password });
        console.log(`Logged in as ${handle}`);
    } catch (err) {
        console.error('Login failed:', err);
        process.exit(1);
    }

    try {
        // Read all files in the provided lexicons directory.
        const files = await fs.readdir(lexiconsDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
            console.log(`No JSON files found in directory ${lexiconsDir}`);
            return;
        }

        // Publish each lexicon file.
        for (const file of jsonFiles) {
            const filePath = path.join(lexiconsDir, file);
            await publishLexicon(agent, filePath);
        }
    } catch (err) {
        console.error('Error reading lexicons directory:', err);
        process.exit(1);
    }
}

main();