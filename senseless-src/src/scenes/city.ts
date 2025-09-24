import { Scene, SenseType } from '../types';

export const cityScene: Scene = {
  id: 'city',
  name: 'Downtown Street Corner',
  events: [
    {
      name: 'PassingCar',
      rarity: 150,
      sensations: [
        { sense: SenseType.Sound, text: 'A low rumble that grows and then fades', duration: 60 },
        { sense: SenseType.Sight, text: 'A flash of reflected light sweeps past', duration: 30 },
      ],
    },
    {
      name: 'DistantTraffic',
      rarity: 200,
      sensations: [
        { sense: SenseType.Sound, text: 'A constant, low-frequency hum', duration: 150 },
      ],
    },
    {
      name: 'GarbageSmell',
      rarity: 350,
      sensations: [
        { sense: SenseType.Smell, text: 'A sour, pungent odor on the air', duration: 70 },
      ],
    },
    {
      name: 'StreetlightChange',
      rarity: 400,
      sensations: [
        { sense: SenseType.Sight, text: 'A green glow from across the street', duration: 100 },
        { sense: SenseType.Sound, text: 'A sudden, sharp beep', duration: 40 },
      ],
    },
    {
      name: 'FootstepsNearby',
      rarity: 450,
      sensations: [
        { sense: SenseType.Sound, text: 'The rhythmic slap of shoes on pavement', duration: 80 },
      ],
    },
    {
      name: 'DistantSiren',
      rarity: 600,
      sensations: [
        { sense: SenseType.Sound, text: 'A high-pitched wail, rising and falling', duration: 90 },
        { sense: SenseType.Emotion, text: 'A brief sense of urgency', duration: 50 },
      ],
    },
    {
      name: 'CafeAroma',
      rarity: 750,
      sensations: [
        { sense: SenseType.Smell, text: 'The rich, warm scent of roasted coffee', duration: 110 },
        { sense: SenseType.Sound, text: 'A low murmur of voices from an open doorway', duration: 80 },
      ],
    },
    {
      name: 'PigeonFlock',
      rarity: 900,
      sensations: [
        { sense: SenseType.Sight, text: 'A sudden explosion of grey feathers and movement', duration: 50 },
        { sense: SenseType.Sound, text: 'The frantic, leathery flap of many wings', duration: 40 },
      ],
    },
    {
      name: 'SubwayRumble',
      rarity: 1200,
      sensations: [
        { sense: SenseType.Sound, text: 'A deep, guttural rumble from below', duration: 100 },
        { sense: SenseType.Touch, text: 'A slight vibration in the soles of your feet', duration: 80 },
      ],
    },
    {
      name: 'HelicopterOverhead',
      rarity: 2200,
      sensations: [
        { sense: SenseType.Sound, text: 'A rhythmic, chopping sound that seems to come from everywhere at once', duration: 140 },
        { sense: SenseType.Sight, text: 'A dark shape moving slowly against the clouds', duration: 100 },
        { sense: SenseType.Emotion, text: 'A feeling of being watched from above', duration: 90 },
      ],
    },
    {
      name: 'SuddenDownpour',
      rarity: 3000,
      sensations: [
        { sense: SenseType.Sound, text: 'A roar that drowns out all other sounds', duration: 120 },
        { sense: SenseType.Sight, text: 'The world dissolves behind a shimmering curtain of water', duration: 150 },
        { sense: SenseType.Smell, text: 'The clean, sharp scent of rain on hot asphalt', duration: 130 },
        { sense: SenseType.Touch, text: 'A sudden, soaking cold', duration: 100 },
      ],
    },
    {
      name: 'PowerOutage',
      rarity: 5000,
      sensations: [
        { sense: SenseType.Sound, text: 'An abrupt, profound silence', duration: 160 },
        { sense: SenseType.Sight, text: 'All the lights blink out at once, revealing the faint glow of the night sky', duration: 180 },
        { sense: SenseType.Emotion, text: 'A shared, breathless moment of confusion', duration: 140 },
      ],
    },
  ],
};
