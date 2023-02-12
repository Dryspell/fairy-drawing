export {}
// import type { NextApiRequest, NextApiResponse } from "next";
// import type { Socket, Server as NextServer } from "net";
// import { Server as SocketIOServer } from "socket.io";
// import type { Server as HttpServer } from "http";

// type NextApiResponseWithSocket = NextApiResponse & {
//   socket: Socket & {
//     server: NextServer & {
//       io: SocketIOServer;
//     };
//   };
// };

// let ids: string[] = [];
// const listMouseId: { [key: string]: any } = {};
// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponseWithSocket
// ) {
//   if (!res.socket.server.io) {
//     console.log("creating new socket io server");
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
//     const httpServer: HttpServer = res.socket.server as any;
//     const io = new SocketIOServer(httpServer);
//     const mainSpace = io;

//     mainSpace.on("connection", (socket) => {
//       socket.broadcast.emit("total", ids);

//       socket.on("adduser", function () {
//         if (ids.length > 2) {
//           io.to(socket.id).emit("full", true);
//         } else {
//           if (ids.indexOf(socket.id) == -1) {
//             ids.push(socket.id);
//           }
//           io.to(socket.id).emit("full", false);
//         }
//       });

//       socket.on("disconnect", function () {
//         ids = ids.filter((id) => id !== socket.id);
//         delete listMouseId[socket.id];

//         if (ids.length < 2) {
//           socket.broadcast.emit("reload", true);
//         }
//       });

//       socket.on("mouseCollab", function (data) {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         listMouseId[socket.id] = { id: socket.id, ...data };
//         socket.broadcast.emit("userMouseCollab", Object.values(listMouseId));
//       });
//     });

//     res.socket.server.io = io;
//   }

//   res.end();
// }
