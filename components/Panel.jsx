import React from 'react';
import './Panel.css';

export default function Panel({ node, onClick }) {
  if (node.leaf) {
    const c = node.counter;
    return (
      <div
        className="panel"
        style={{ backgroundColor: c.color, ...node.style }}
        onClick={() => onClick(c.id)}
      >
        <div className="panel-header">{c.name}</div>
        <div className="panel-body">{c.count}</div>
        {c.count===1 && <div className="panel-footer">Norma: {(c.count/1).toFixed(2)}</div>}
      </div>
    );
  }
  const baseStyle = {
    ...node.style,
    width: node.style?.width || '100%',
    height: node.style?.height || '100%'
  };
  return (
    <div style={baseStyle}>
      <Panel node={node.children[0]} onClick={onClick} />
      <Panel node={node.children[1]} onClick={onClick} />
    </div>
  );
}