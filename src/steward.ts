import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

export class CommunitySteward {
  constructor(private mcpClient: Client) {}

  async processIntros(channelId: string) {
    console.log(`[Steward] Reading intros from channel ${channelId}...`);
    
    // Call the read_channel tool on the MCP server
    const readResult = await this.mcpClient.callTool({
      name: "read_channel",
      arguments: {
        provider: "discord",
        channelId,
        limit: 10
      }
    });

    if (readResult.isError) {
      console.error("[Steward] Error reading channel:", readResult.content);
      return;
    }

    const messagesJson = readResult.content.find(c => c.type === 'text')?.text;
    if (!messagesJson) {
      console.log("[Steward] No messages found.");
      return;
    }

    const messages = JSON.parse(messagesJson);
    
    for (const msg of messages) {
      const content = msg.content.toLowerCase();
      if (content.includes("hello") || content.includes("joining")) {
        console.log(`[Steward] Found new intro from ${msg.authorId}. Preparing personalized welcome...`);
        
        const welcomeMessage = `Welcome <@${msg.authorId}>! We're thrilled to have you here in Starlight Communities. Let us know if you need help with your initial quests!`;
        
        console.log(`[Steward] Posting welcome message...`);
        const postResult = await this.mcpClient.callTool({
          name: "post_message",
          arguments: {
            provider: "discord",
            channelId,
            content: welcomeMessage
          }
        });

        if (postResult.isError) {
          console.error("[Steward] Error posting welcome:", postResult.content);
        } else {
          console.log("[Steward] Successfully welcomed user via MCP.");
        }
      }
    }
  }
}
