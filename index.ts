import { LocalGameClient } from "./client/LocalGameClient";
import { WebSocketGameClient } from "./client/WebSocketGameClient";
import { Solver } from "./Solver";

const solver = new Solver();
process.env.TOKEN
  ? new WebSocketGameClient(solver)
  : new LocalGameClient(solver);
