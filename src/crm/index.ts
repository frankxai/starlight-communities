/**
 * CRM module for Starlight Dream 100
 * Manages lead database interactions.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Telemetry helper
function emitTelemetry(message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') {
    fetch('http://localhost:4000/emit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, tag: 'CRM', type })
    }).catch(err => console.error('[CRM] Telemetry error:', err));
}

export type Category = "AI_Lab_Exec" | "Billionaire" | "Top_Tier_Creator" | "Venture_Capital" | "Other";
export type EngagementStatus = "Identified" | "Scraped_Context" | "Draft_Approved" | "Invited" | "Joined_Tier_3" | "Passed";

export interface SocialProfiles {
    x_handle?: string;
    linkedin_url?: string;
}

export interface AgenticContext {
    recent_wins?: string[];
    shared_interests?: string[];
    recommended_angle?: string;
}

export interface Dream100Lead {
    id: string;
    name: string;
    category: Category;
    social_profiles?: SocialProfiles;
    engagement_status: EngagementStatus;
    agentic_context?: AgenticContext;
    outreach_draft?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'leads.json');

/**
 * Reads the entire database of leads.
 * @returns An array of Dream100Lead objects.
 */
function readDB(): Dream100Lead[] {
    try {
        if (!fs.existsSync(DB_FILE)) {
            console.info(`[${new Date().toISOString()}] [CRM] Database file not found at ${DB_FILE}. Returning empty array.`);
            return [];
        }
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [CRM] Error reading database from ${DB_FILE}:`, error);
        throw error;
    }
}

/**
 * Writes the provided leads data back to the database.
 * @param data - The array of leads to write.
 */
function writeDB(data: Dream100Lead[]): void {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        console.info(`[${new Date().toISOString()}] [CRM] Successfully wrote database to ${DB_FILE}.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [CRM] Error writing database to ${DB_FILE}:`, error);
        throw error;
    }
}

/**
 * Adds a new lead to the CRM.
 * @param lead - The lead to add.
 * @returns The successfully added lead.
 * @throws Error if a lead with the same ID already exists.
 */
export function addLead(lead: Dream100Lead): Dream100Lead {
    try {
        console.info(`[${new Date().toISOString()}] [CRM] Adding new lead with ID: ${lead.id}`);
        const db = readDB();
        if (db.find(l => l.id === lead.id)) {
            throw new Error(`Lead with id ${lead.id} already exists.`);
        }
        db.push(lead);
        writeDB(db);
        emitTelemetry(`Added new lead: ${lead.name} (${lead.id})`, 'success');
        return lead;
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [CRM] Failed to add lead ${lead.id}:`, error);
        throw error;
    }
}

/**
 * Updates the engagement status of a specific lead.
 * @param id - The ID of the lead to update.
 * @param newStatus - The new engagement status.
 * @returns The updated lead, or undefined if the lead was not found.
 */
export function updateStatus(id: string, newStatus: EngagementStatus): Dream100Lead | undefined {
    try {
        console.info(`[${new Date().toISOString()}] [CRM] Updating status for lead ${id} to ${newStatus}`);
        const db = readDB();
        const leadIndex = db.findIndex(l => l.id === id);
        if (leadIndex === -1) {
            console.warn(`[${new Date().toISOString()}] [CRM] Lead ${id} not found for status update.`);
            return undefined;
        }
        db[leadIndex].engagement_status = newStatus;
        writeDB(db);
        emitTelemetry(`Updated status for ${id} to ${newStatus}`, 'info');
        return db[leadIndex];
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [CRM] Failed to update status for lead ${id}:`, error);
        throw error;
    }
}

/**
 * Retrieves a lead by its ID.
 * @param id - The ID of the lead to retrieve.
 * @returns The lead if found, otherwise undefined.
 */
export function getLead(id: string): Dream100Lead | undefined {
    try {
        console.info(`[${new Date().toISOString()}] [CRM] Fetching lead by ID: ${id}`);
        const db = readDB();
        return db.find(l => l.id === id);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [CRM] Failed to fetch lead ${id}:`, error);
        throw error;
    }
}
