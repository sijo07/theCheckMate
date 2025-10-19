import { Server } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Listen for new incidents and broadcast
    socket.on("newIncident", (incident) => {
      console.log("📌 New Incident Received:", incident);
      io.emit("updateIncidents", incident); 
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`⚠️ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initializeSocket;
