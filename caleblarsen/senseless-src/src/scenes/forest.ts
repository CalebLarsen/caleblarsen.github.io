import { Scene, SenseType } from '../types';

export const forestScene: Scene = {
  id: 'forest',
  name: 'Forest Clearing',
  events: [
    // --- Common Events ---
    {
      name: 'DistantBirdsong',
      rarity: 220,
      sensations: [
        { sense: SenseType.Sound, text: 'A high-pitched call, far away', duration: 120 },
      ],
    },
    {
      name: 'PassingBreeze',
      rarity: 240,
      sensations: [
        { sense: SenseType.Sound, text: 'A sudden, dry rustling', duration: 60 },
        { sense: SenseType.Touch, text: 'Coolness on your cheek', duration: 50 },
      ],
    },
    {
      name: 'Sunbeam',
      rarity: 280,
      sensations: [
        { sense: SenseType.Sight, text: 'Glowing motes of dust in the air', duration: 100 },
        { sense: SenseType.Touch, text: 'Sudden warmth on your skin', duration: 80 },
      ],
    },
    {
      name: 'FallingLeaf',
      rarity: 320,
      sensations: [
        { sense: SenseType.Sight, text: 'A flicker of yellow in your peripheral vision', duration: 60 },
        { sense: SenseType.Sound, text: 'A faint, papery whisper', duration: 20 },
      ],
    },
    {
      name: 'UndergrowthRustle',
      rarity: 350,
      sensations: [
        { sense: SenseType.Sound, text: 'A crackle of twigs nearby', duration: 40 },
        { sense: SenseType.Emotion, text: 'A spike of alertness', duration: 30 },
      ],
    },
    {
      name: 'CloudCover',
      rarity: 380,
      sensations: [
        { sense: SenseType.Sight, text: 'The light suddenly dims', duration: 90 },
        { sense: SenseType.Touch, text: 'A momentary chill', duration: 70 },
      ],
    },
    {
      name: 'DampEarthSmell',
      rarity: 420,
      sensations: [
        { sense: SenseType.Smell, text: 'A heavy, loamy scent', duration: 120 },
      ],
    },
    {
      name: 'InsectBuzzing',
      rarity: 450,
      sensations: [
        { sense: SenseType.Sound, text: 'A high-pitched hum', duration: 90 },
      ],
    },
    // --- Uncommon Events ---
    {
      name: 'SquirrelActivity',
      rarity: 550,
      sensations: [
        { sense: SenseType.Sound, text: 'A frantic scratching sound', duration: 70 },
        { sense: SenseType.Sight, text: 'A fleeting, furry shape bolts up a tree trunk', duration: 50 },
      ],
    },
    {
      name: 'BirdSighting',
      rarity: 650,
      sensations: [
        { sense: SenseType.Sight, text: 'A flash of blue', duration: 80 },
        { sense: SenseType.Sound, text: 'A melodic chirp', duration: 30 },
      ],
    },
    {
      name: 'FirstRaindrop',
      rarity: 1300,
      sensations: [
        { sense: SenseType.Touch, text: 'A single, cold pinprick on your arm', duration: 30 },
        { sense: SenseType.Smell, text: 'The scent of dust and water', duration: 90 },
      ],
    },
    {
      name: 'HawksCry',
      rarity: 1450,
      sensations: [
        { sense: SenseType.Sound, text: 'A piercing shriek, high above', duration: 60 },
        { sense: SenseType.Emotion, text: 'An involuntary urge to look up', duration: 80 },
      ],
    },
    // --- Rare Events ---
    {
      name: 'DistantOwl',
      rarity: 1800,
      sensations: [
        { sense: SenseType.Sound, text: 'A low, two-note call in the distance', duration: 70 },
        { sense: SenseType.Emotion, text: 'A feeling of being far from civilization', duration: 100 },
      ],
    },
    {
      name: 'DeerSighting',
      rarity: 2500,
      sensations: [
        { sense: SenseType.Sight, text: 'Large, dark eyes watching from the treeline', duration: 150 },
        { sense: SenseType.Sound, text: 'The soft snap of a twig', duration: 40 },
        { sense: SenseType.Emotion, text: 'The feeling of holding your breath', duration: 120 },
      ],
    },
    {
      name: 'WolfHowl',
      rarity: 4000,
      sensations: [
        { sense: SenseType.Sound, text: 'A long, rising cry from far away', duration: 100 },
        { sense: SenseType.Emotion, text: 'The hair on your arms stands up', duration: 120 },
      ],
    },
  ],
};
