const express = require("express");
const dbConnect = require("./DB/dbConnect");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const feeedbackRoute = require("./routes/feeedbackRoute");
const projectRoutes = require("./routes/projectRouter"); 
const workflowRoute = require("./routes/workflowRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const CustomerRouter = require('./routes/documents.js');

dotenv.config();
const app = express();
dbConnect();

//sandith
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors({ origin: true, credentials: true}));
//senudi
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/feedback", feeedbackRoute);

//extra
const colors = require("colors");
const { chats } = require("./data/data");
const feedback = require("./models/feedback");
const project = require("./models/projectModel");


app.use(express.json()); //to accept json data

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workflow", workflowRoute);
app.use('/documents', CustomerRouter);


//error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`.yellow.bold);
});



const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});




