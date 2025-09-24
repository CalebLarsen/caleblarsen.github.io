
export enum SenseType {
  Sound = 'Sound',
  Sight = 'Sight',
  Emotion = 'Emotion',
  Touch = 'Touch',
  Taste = 'Taste',
  Smell = 'Smell',
}

export interface Event {
  id: number;
  text: string;
  duration: number;
}

export interface Sense {
  name: SenseType;
  events: Event[];
}

export interface Sensation {
  sense: SenseType;
  text: string;
  duration: number;
}

export interface RandomEvent {
  name: string;
  rarity: number;
  sensations: Sensation[];
}

export interface Scene {
  id: string;
  name: string;
  events: RandomEvent[];
}
