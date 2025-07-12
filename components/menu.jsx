import React, { useState } from 'react';
import './menu.css';

export default function Menu({ onAdd, onReset }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');

  const handleSubmit = e => {
    e.preventDefault();
    if (!name) return;
    onAdd({ name, color });
    setName('');
    setOpen(false);
  };

  return (
    <div className="menu-container">
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <div className="menu-content">
          <form onSubmit={handleSubmit}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nazwa Licznika" />
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
            <button type="submit">Dodaj</button>
            <button type="button" onClick={onReset}>Usuń dane</button>
          </form>
        </div>
      )}
    </div>
  );
}