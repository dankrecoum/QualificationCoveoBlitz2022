import WebSocket from "ws";
import { GameMessage } from "../GameInterface";
import { Solver } from "../Solver";

export class WebSocketGameClient {
  constructor(solver: Solver) {
    const webSocket = new WebSocket("ws://0.0.0.0:8765");
    webSocket.onopen = (event: WebSocket.Event) => {
      webSocket.send(
        JSON.stringify({ type: "REGISTER", token: process.env.TOKEN })
      );
    };
    webSocket.onmessage = (message: WebSocket.MessageEvent) => {
      const rawGameMessage = JSON.parse(message.data.toString());

      if (rawGameMessage.type === "ERROR") {
        console.error(rawGameMessage);
        return;
      }

      const gameMessage = new GameMessage(rawGameMessage);

      webSocket.send(
        JSON.stringify({
          type: "COMMAND",
          tick: gameMessage.tick,
          actions: solver.getAnswer(gameMessage),
        })
      );
    };
  }
}
