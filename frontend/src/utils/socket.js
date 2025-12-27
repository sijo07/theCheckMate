import { io } from "socket.io-client";
import { BASE_URL } from "../redux/constants";

const socket = io(BASE_URL);

export default socket;
