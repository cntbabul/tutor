import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
export declare const onlineUsers: Map<string, string>;
export declare const initializeSocket: (httpServer: HttpServer) => SocketServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
//# sourceMappingURL=socket.d.ts.map