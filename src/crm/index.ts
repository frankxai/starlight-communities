/**
 * CRM module for Starlight Dream 100
 * Manages lead database interactions via AgentDB (SQLite).
 */
import Database from 'better-sqlite3';
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
const DB_FILE = path.join(__dirname, 'agents.db');

// Initialize DB connection
let db: Database.Database;
try {
    db = new Database(DB_FILE);
    // Ensure table exists if AgentDB schema isn't fully migrated yet
    db.exec(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            text TEXT,
            summary TEXT,
            note_type TEXT DEFAULT 'general',
            importance REAL DEFAULT 0.5,
            access_count INTEGER DEFAULT 0,
            last_accessed_at INTEGER,
            created_at INTEGER DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER DEFAULT (strftime('%s', 'now')),
            metadata JSON
        )
    `);
} catch (error) {
    console.error(`[${new Date().toISOString()}] [CRM] Failed to open AgentDB at ${DB_FILE}:`, error);
}

/**
 * Helper to convert a DB note row to a Dream100Lead
 */
function rowToLead(row: any): Dream100Lead {
    const meta = JSON.parse(row.metadata || '{}');
    return {
        id: meta.id || row.id.toString(),
        name: row.title,
        category: meta.category || 'Other',
        social_profiles: meta.social_profiles,
        engagement_status: meta.engagement_status || 'Identified',
        agentic_context: meta.agentic_context,
        outreach_draft: meta.outreach_draft,
    };
}

/**
 * Reads all leads from the AgentDB.
 * @returns An array of Dream100Lead objects.
 */
export function getAllLeads(): Dream100Lead[] {
    try {
        const stmt = db.prepare(`SELECT * FROM notes WHERE note_type = 'crm_lead'`);
        const rows = stmt.all();
        return rows.map(rowToLead);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [CRM] Error fetching leads:`, error);
        return [];
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
        console.info(`[${new Date().toISOString()}] [CRM] Adding new lead: ${lead.name}`);
        
        // Check if exists
        const checkStmt = db.prepare(`SELECT * FROM notes WHERE note_type = 'crm_lead' AND json_extract(metadata, '$.id') = ?`);
        const existing = checkStmt.get(lead.id);
        
        if (existing) {
            throw new Error(`Lead with id ${lead.id} already exists.`);
        }

        const stmt = db.prepare(`
            INSERT INTO notes (title, text, note_type, metadata)
            VALUES (?, ?, ?, ?)
        `);
        
        stmt.run(
            lead.name,
            `Lead: ${lead.name} (${lead.category})`,
            'crm_lead',
            JSON.stringify(lead)
        );
        
        emitTelemetry(`Added new lead to AgentDB: ${lead.name} (${lead.id})`, 'success');
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
        
        const selectStmt = db.prepare(`SELECT * FROM notes WHERE note_type = 'crm_lead' AND json_extract(metadata, '$.id') = ?`);
        const row = selectStmt.get(id);
        
        if (!row) {
            console.warn(`[${new Date().toISOString()}] [CRM] Lead ${id} not found for status update.`);
            return undefined;
        }

        const lead = rowToLead(row);
        lead.engagement_status = newStatus;

        const updateStmt = db.prepare(`
            UPDATE notes SET metadata = ?, updated_at = strftime('%s', 'now')
            WHERE id = ?
        `);
        updateStmt.run(JSON.stringify(lead), (row as any).id);
        
        emitTelemetry(`Updated status for ${id} to ${newStatus} in AgentDB`, 'info');
        return lead;
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
        const stmt = db.prepare(`SELECT * FROM notes WHERE note_type = 'crm_lead' AND json_extract(metadata, '$.id') = ?`);
        const row = stmt.get(id);
        
        if (!row) return undefined;
        return rowToLead(row);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [CRM] Failed to fetch lead ${id}:`, error);
        throw error;
    }
}
