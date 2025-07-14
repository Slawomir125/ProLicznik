import React from 'react';
import './Panel.css';

// Komponent rekurencyjny odpowiedzialny za wyświetlanie paneli (liczników lub drzew)
export default function Panel({ node, onClick }) {
  // Jeśli node to liść (czyli konkretny licznik)
  if (node.leaf) {
    // Destrukturyzacja danych z licznika
    const { id, color, name, count } = node.counter;

    return (
      <div
        className="panel"
        style={{ backgroundColor: color, ...node.style }} // ustawienie koloru tła i stylu
        onClick={() => onClick(id)} // obsługa kliknięcia, przekazuje ID licznika
      >
        <div className="panel-header">{name}</div>
        <div className="panel-body">{count}</div>
      </div>
    );
  }

  // Jeśli node to węzeł (czyli podział na dzieci)
  return (
    <div style={{ width: '100%', height: '100%', ...node.style }}> {/* wrapper dla dzieci */}
      {node.children.map((child, i) => (
        // Rekurencyjne renderowanie dzieci
        <Panel key={i} node={child} onClick={onClick} />
      ))}
    </div>
  );
}