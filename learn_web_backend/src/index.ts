import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import ConnectDB from "./db";
import Score from "./modal";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log(`A user is connected: ${socket.id}`);

  Score.find({}).then((res) => io.emit("scores", res));

  socket.on("update", async (person) => {
    const user = await Score.findByIdAndUpdate(
      person.userId,
      {
        score: person.score,
      },
      { new: true }
    );
    io.emit("updatedUser", user);
  });

  socket.on("userDisconnecting", (id) => {
    Score.findByIdAndDelete(id.id).then(() => {
      Score.find({}).then((res) => io.emit("scores", res));
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.post("/register", async (req, res) => {
  try {
    const user = await Score.create(req.body);
    res.status(201).json({ user });
  } catch (error: any) {
    if (error.code === 11000) {
      const user = await Score.findOne({ email: req.body.email });
      res.status(200).json({ user });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
});
const start = async () => {
  await ConnectDB(process.env.MONG_URI!);
  server.listen(process.env.PORT!, () => {
    console.log(`listening on ${process.env.PORT!}`);
  });
};

start();
