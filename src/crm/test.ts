import { addLead, getLead, updateStatus, Dream100Lead } from './index';

async function runTest() {
    console.log('Testing CRM module...');
    const testLead: Dream100Lead = {
        id: "lead-001",
        name: "Test User",
        category: "AI_Lab_Exec",
        engagement_status: "Identified"
    };

    try {
        console.log('Adding lead...');
        addLead(testLead);
    } catch (e) {
        console.log('Lead might already exist:', e.message);
    }

    console.log('Getting lead...');
    const fetched = getLead('lead-001');
    console.log('Fetched lead:', fetched);

    console.log('Updating status...');
    const updated = updateStatus('lead-001', 'Draft_Approved');
    console.log('Updated lead:', updated);

    console.log('Done testing CRM module.');
}

runTest().catch(console.error);
