import { forestScene } from './forest';
import { cityScene } from './city';
import { clubScene } from './club';
import { Scene } from '../types';

export const scenes: Record<string, Scene> = {
  [forestScene.id]: forestScene,
  [cityScene.id]: cityScene,
  [clubScene.id]: clubScene,
};
