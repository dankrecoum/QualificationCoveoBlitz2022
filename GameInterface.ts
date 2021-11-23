export interface TickEvent {
  tick: number;
  payload: Question;
}

export interface Question {
  totems: TotemQuestion[];
}

export interface TotemQuestion {
  shape: Totem;
}

export type Totem = "I" | "O" | "J" | "L" | "S" | "Z" | "T";

export interface Answer {
  totems: TotemAnswer[];
}

export interface TotemAnswer {
  shape: Totem;
  coordinates: CoordinatePair[];
}

export type CoordinatePair = number[];

export class GameMessage implements TickEvent {
  public readonly tick: number;
  public readonly payload: Question;

  constructor(rawTick: TickEvent) {
    Object.assign(this, rawTick);
  }
}
