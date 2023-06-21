import express from "express"
import * as dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import SocketController from "./SocketController.js"
import http from "http";
import { Server } from "socket.io";
// import { WebSocketServer } from "ws";

import authRoute from "./routes/auth.js"
import userRoute from "./routes/users.js"
import roleRoute from "./routes/roles.js"
import trackerRoute from "./routes/combatTrackers.js"
import dbUtilsRoute from "./routes/dbutils.js"
import dbRabilitiesRoute from "./routes/rabilities.js"
import dbHindrancesRoute from "./routes/hindrances.js"
import dbAttributesRoute from "./routes/attributes.js";
import dbSkillsRoute from "./routes/skills.js";
import testRoute from "./routes/test.js"

interface Response {
  id?: number;
  response?: string;
  status: number;
  data?: string;
}
const UNKNOWN = 0
const ERROR = 500
const SUCCESS = 200

// Start with Express
const app = express();
if (process.env.DEBUG !== 'true') {
  app.use(function (req, res, next) {	
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });
}
// Setup Dotenv
dotenv.config()
// Setup CORS
var corsOptions = process.env.DEBUG === 'true' ? {
  credentials : true,
  origin: 'http://10.0.0.154:3000', 
} : {
  credentials : true,
  origin: 'https://softwarewolf2.loca.lt',
} 
app.use(cors(corsOptions))


// socket.io (with CORS)
// const httpServer = http.createServer(app);
// const IO_SOCKET_HTTP_PORT = 8082;
// httpServer.listen(IO_SOCKET_HTTP_PORT, () => {
//   console.log(`Http Server listening on port ${IO_SOCKET_HTTP_PORT}`);
// });
// const io = process.env.DEBUG === 'true' ? 
//   new Server(httpServer, {
//     cors: {
//       origin: "http://10.0.0.154:3000",
//       methods: ["GET", "POST", "DELETE", "PUT"],
//       credentials: true
//     }
//   })
//  : 
//   new Server(httpServer, {
//     cors: {
//       origin: "http://10.0.0.154:3000",
//       methods: ["GET", "POST", "DELETE", "PUT"],
//       credentials: true
//     }
//   }
// );
// io.on("connection", (socket) => {
//   console.log("user is connected");

//   socket.on("disconnect", () => {
//     console.log("user is disconnected");
//   });
// })
const socketController = new SocketController(app);
socketController.wsInit();

// DEBUGGING 
console.debug(process.env.SECRET_DATA);
console.debug(process.env.ACCESS_KEY);
// end DEBUGGING

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/roles", roleRoute);
app.use("/trackers", trackerRoute);
app.use("/dbutils", dbUtilsRoute);
app.use("/rabilities", dbRabilitiesRoute);
app.use("/hindrances", dbHindrancesRoute);
app.use("/attributes", dbAttributesRoute);
app.use("/skills", dbSkillsRoute);
app.use("/test", testRoute);
app.use("/", testRoute);

// Error handler
app.use((err,req,res,next)=>{
  console.log(err.message)
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Error in backend"
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  })
});

app.listen(8800, ()=>{
  console.log("Connected to port 8800")
});
