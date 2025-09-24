import { useState, useEffect } from 'react';
import SenseBox from './SenseBox';
import './App.css';
import { scenes } from './scenes';
import { Sense, SenseType, Event, RandomEvent, Scene } from './types'

const initialSenses: Sense[] = [
  { name: SenseType.Sound, events: [] },
  { name: SenseType.Sight, events: [] },
  { name: SenseType.Emotion, events: [] },
  { name: SenseType.Touch, events: [] },
  { name: SenseType.Taste, events: [] },
  { name: SenseType.Smell, events: [] },
];

function addRandomEvents(senses: Sense[], sceneEvents: RandomEvent[]): Sense[] {
  const newEvents: Partial<Record<SenseType, Event[]>> = {};

  for (const random of sceneEvents){
    if (Math.random() < 1 / random.rarity) {
      for (const output of random.sensations) {
        if (!newEvents[output.sense]) {
          newEvents[output.sense] = [];
        }
        const newEvent: Event = {
          id: Date.now() + Math.random(),
          text: output.text,
          duration: output.duration,
        };
        newEvents[output.sense]?.push(newEvent);
      }
    }
  }

  if (Object.keys(newEvents).length === 0){
    return senses;
  }

  return senses.map(sense => {
    const potentialNewEvents = newEvents[sense.name];
    if (!potentialNewEvents || potentialNewEvents.length === 0){
      return sense;
    }
    let updatedEvents = [...sense.events];
    for (const newEvent of potentialNewEvents){
      const existingEventIndex = updatedEvents.findIndex((e) => e.text === newEvent.text);
      if (existingEventIndex > -1) {
        updatedEvents.splice(existingEventIndex, 1);
      }
      updatedEvents.push(newEvent);
    }
    return {
      ...sense,
      events: updatedEvents,
    };
  });
}

function App() {
  const [senses, setSenses] = useState<Sense[]>(initialSenses);
  const [currentSceneId, setCurrentSceneId] = useState<string>('forest');

  useEffect(() => {
    setSenses(initialSenses);
  }, [currentSceneId]);

  useEffect(() => {
    const activeScene = scenes[currentSceneId];
    if (!activeScene) return;
    const intervalId = setInterval(() => {
      setSenses(currentSenses => {
        let updatedSenses = currentSenses.map(sense => ({
          ...sense,
          events: sense.events
            .map(event => ({
              ...event,
              duration: event.duration - 1,
            }))
            .filter(event => event.duration > 0),
        }));
        updatedSenses = addRandomEvents(updatedSenses, activeScene.events);
        return updatedSenses;
      }
      );
    }, 100);

    return () => clearInterval(intervalId);
  }, [currentSceneId]);

    return (
    <div className="app-container">
      <div className="header">
        <h1>Sensory Feed</h1>
        <div className="scene-selector">
          <select
            id="scene-select"
            value={currentSceneId}
            onChange={(e) => setCurrentSceneId(e.target.value)}
          >
            {Object.values(scenes).map((scene: Scene, index: number) => (
              <option key={scene.id} value={scene.id}>
                {`Scene ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="senses-grid">
        {senses.map((sense) => (
          <SenseBox
            key={sense.name}
            name={sense.name}
            events={sense.events}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
