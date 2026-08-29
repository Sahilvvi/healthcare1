import ws from "ws";

export const WebSocketCtor: typeof WebSocket = ws as unknown as typeof WebSocket;
