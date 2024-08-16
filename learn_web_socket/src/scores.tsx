import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useParams } from "react-router-dom";

interface Scores {
  _id: string;
  email: string;
  name: string;
  score: number;
}

const AllScores = () => {
  const { id } = useParams();
  const url = import.meta.env.VITE_BACKEND_URL;
  const [scores, setScores] = useState<Scores[]>([]);
  const [score, setScore] = useState<Scores>();
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const newSocket = io(url);
    newSocket.on("connect", () => {
      console.log("Your socket id:", newSocket.id);
    });
    newSocket.on("scores", (data: Scores[]) => {
      const sortedData = data.sort((a, b) => b.score - a.score);
      setScores(sortedData);
    });
    setSocket(newSocket);

    return () => {
      if (id) {
        newSocket.emit("userDisconnecting", { id });
      }
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket?.on("updatedUser", (user) => {
        const updatedUserScore = scores.map((person) => {
          if (person._id === user._id) {
            person.score = user.score;
          }
          return person;
        });
        setScores(updatedUserScore.sort((a, b) => b.score - a.score));
      });
    }
  }, [socket, scores]);

  const HandleIncrease = () => {
    let score = scores.find((user) => user._id === id)?.score as number;
    score++;
    if (socket) {
      socket.emit("update", { userId: id, score: score });
    }
  };
  const HandleDecrease = () => {
    let score = scores.find((user) => user._id === id)?.score as number;
    score--;
    if (socket) {
      socket.emit("update", { userId: id, score: score });
    }
  };
  useEffect(() => {
    const userScore = scores.find((person) => person._id === id);
    if (userScore !== undefined) {
      setScore(userScore);
    }
  }, [scores, id]);
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen overflow-x-auto shadow-md sm:rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-8">
          {score && score.name} Your Score {score && score.score}
        </h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={HandleIncrease}
            className="bg-gray-400 p-2 px-4 rounded-md hover:bg-gray-500 font-bold"
          >
            Increase score
          </button>
          <button
            onClick={HandleDecrease}
            className="bg-gray-400 p-2 px-4 rounded-md hover:bg-gray-500 font-bold"
          >
            Decrease score
          </button>
        </div>

        <div className="w-full max-w-4xl">
          <h1 className="text-3xl text-center font-bold mb-6">Score Board</h1>

          {scores && scores.length > 0 ? (
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Id</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr
                    key={score._id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-3">{score._id}</td>
                    <td className="px-6 py-3">{score.email}</td>
                    <td className="px-6 py-3">{score.name}</td>
                    <td className="px-6 py-3">{score.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600">No scores available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AllScores;
