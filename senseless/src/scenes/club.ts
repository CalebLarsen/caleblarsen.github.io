import { Scene, SenseType } from '../types';

export const clubScene: Scene = {
  id: 'club',
  name: 'Crowded Nightclub',
  events: [
    {
      name: 'PulsingBass',
      rarity: 100,
      sensations: [
        { sense: SenseType.Sound, text: 'A deep, repetitive thud', duration: 180 },
        { sense: SenseType.Touch, text: 'A vibration in your chest', duration: 160 },
      ],
    },
    {
      name: 'StrobeLight',
      rarity: 200,
      sensations: [
        { sense: SenseType.Sight, text: 'A blinding flash of white light', duration: 20 },
        { sense: SenseType.Sight, text: 'Brief, frozen images of dancing figures', duration: 30 },
      ],
    },
    {
      name: 'SweatSmell',
      rarity: 60,
      sensations: [
        { sense: SenseType.Smell, text: 'The sharp, salty scent of sweat', duration: 90 },
      ],
    },
    {
      name: 'PersonBrushingPast',
      rarity: 100,
      sensations: [
        { sense: SenseType.Touch, text: 'The pressure of a body moving past you in the crowd', duration: 40 },
      ],
    },
    {
      name: 'ShoutedConversation',
      rarity: 100,
      sensations: [
        { sense: SenseType.Sound, text: 'A distorted, shouted voice, too close to your ear', duration: 60 },
      ],
    },
    {
      name: 'LaserBeam',
      rarity: 250,
      sensations: [
        { sense: SenseType.Sight, text: 'A thin, green line of light cuts through the darkness', duration: 30 },
      ],
    },
    {
      name: 'IceClinking',
      rarity: 300,
      sensations: [
        { sense: SenseType.Sound, text: 'The sharp clink of ice in a glass nearby', duration: 25 },
      ],
    },
    {
      name: 'FeedbackSqueal',
      rarity: 1500,
      sensations: [
        { sense: SenseType.Sound, text: 'A high-pitched, painful squeal from the speakers', duration: 35 },
        { sense: SenseType.Emotion, text: 'A collective, involuntary wince', duration: 40 },
      ],
    },
    {
      name: 'SuddenCheer',
      rarity: 700,
      sensations: [
        { sense: SenseType.Sound, text: 'A roar of approval from a corner of the room', duration: 50 },
      ],
    },
    {
      name: 'FabricSnag',
      rarity: 500,
      sensations: [
        { sense: SenseType.Touch, text: 'The brief, pulling sensation of your clothes catching on someone else', duration: 20 },
      ],
    },
    {
      name: 'PerfumeTrail',
      rarity: 450,
      sensations: [
        { sense: SenseType.Smell, text: 'A heavy, sweet cloud of perfume', duration: 60 },
      ],
    },
    {
      name: 'CameraFlash',
      rarity: 800,
      sensations: [
        { sense: SenseType.Sight, text: 'A sudden, brilliant flash, leaving a green spot in your vision', duration: 45 },
      ],
    },
    {
      name: 'SpilledDrink',
      rarity: 650,
      sensations: [
        { sense: SenseType.Touch, text: 'A sudden, cold wetness on your leg', duration: 80 },
        { sense: SenseType.Smell, text: 'A cloying, sugary smell', duration: 100 },
        { sense: SenseType.Emotion, text: 'Anger', duration: 120 },
      ],
    },
    {
      name: 'SynthMelody',
      rarity: 800,
      sensations: [
        { sense: SenseType.Sound, text: 'A high-pitched, electronic melody cuts through the bass', duration: 120 },
        { sense: SenseType.Emotion, text: 'A brief surge of euphoria', duration: 90 },
      ],
    },
    {
      name: 'FogMachine',
      rarity: 1000,
      sensations: [
        { sense: SenseType.Sight, text: 'The room fills with thick, swirling smoke', duration: 140 },
        { sense: SenseType.Smell, text: 'A sweet, chemical scent', duration: 110 },
        { sense: SenseType.Touch, text: 'A cool mist on your skin', duration: 80 },
      ],
    },
    {
      name: 'BriefEyeContact',
      rarity: 1300,
      sensations: [
        { sense: SenseType.Sight, text: 'Someone’s eyes meet yours for a split second across the room', duration: 40 },
        { sense: SenseType.Emotion, text: 'A jolt of self-awareness', duration: 60 },
      ],
    },
    {
      name: 'DJScratch',
      rarity: 2500,
      sensations: [
        { sense: SenseType.Sound, text: 'The music screeches and rewinds with a loud ZRRRIP', duration: 50 },
        { sense: SenseType.Emotion, text: 'A shared surge of adrenaline in the crowd', duration: 80 },
      ],
    },
    {
      name: 'BassDrop',
      rarity: 3200,
      sensations: [
        { sense: SenseType.Sound, text: 'The music builds to a crescendo, then cuts to near silence', duration: 90 },
        { sense: SenseType.Touch, text: 'A moment of weightlessness as the bass disappears', duration: 70 },
        { sense: SenseType.Emotion, text: 'A powerful feeling of anticipation', duration: 100 },
      ],
    },
    {
      name: 'LightsOn',
      rarity: 6000,
      sensations: [
        { sense: SenseType.Sight, text: 'The harsh, unfiltered house lights suddenly turn on', duration: 180 },
        { sense: SenseType.Sound, text: 'The music abruptly stops, replaced by a low hum', duration: 160 },
        { sense: SenseType.Emotion, text: 'A jarring sense of disorientation', duration: 140 },
      ],
    },
  ],
};
