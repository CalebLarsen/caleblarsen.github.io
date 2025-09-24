import React from 'react';
import './SenseBox.css';
import { Event, SenseType } from './types'

interface SenseBoxProps {
  name: SenseType;
  events: Event[];
}

const SenseBox: React.FC<SenseBoxProps> = ({ name, events }) => {
  return (
    <div className="sense-box">
      <h2 className="sense-name">{name}</h2>
      <div className="events-container">
        {events.map((event) => (
          <p key={event.id} className="event-text">
            {event.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default SenseBox;
