// Main chat service export - now uses enhanced version with MCP support
export { ChatService } from './chat-enhanced';
export type { ChatMessage, AIResponse } from './chat-enhanced';

// Keep original for backward compatibility if needed
export { ChatService as OriginalChatService } from './chat-original';
