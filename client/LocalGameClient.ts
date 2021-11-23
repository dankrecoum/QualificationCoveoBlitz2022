import { GameMessage } from "../GameInterface";
import { Solver } from "../Solver";

export class LocalGameClient {
  constructor(solver: Solver) {
    console.log("[Running in local mode]");
    const sample = new GameMessage({
      tick: 1,
      payload: {
        totems: [{ shape: "I" }],
      },
    });
    solver.getAnswer(sample);
  }
}
