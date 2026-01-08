import { io } from "socket.io-client";
import { BASE_URL } from "../redux/constants";

const socket = io(BASE_URL, {
    transports: ["polling", "websocket"],
    withCredentials: true,
    autoConnect: import.meta.env.MODE !== "production", // Optional: Disable auto-connect in prod if not supported
});

export default socket;
