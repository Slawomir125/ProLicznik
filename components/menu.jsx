import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="content"
            className="menu-content"
            onMouseLeave={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nazwa Licznika"
              />
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
              />
              <button type="submit">Dodaj</button>
              <button type="button" onClick={onReset}>Usuń dane</button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Menu
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
