import React, { useState, useEffect } from 'react';
import Menu from '../components/menu';
import Panel from '../components/Panel';
import Cookies from 'js-cookie';
import './App.css';

const COOKIE_KEY = 'multi_counters';
const COOKIE_TTL_HOURS = 24;

function App() {
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    const data = Cookies.get(COOKIE_KEY);
    if (data) {
      try { setCounters(JSON.parse(atob(data))); } catch {}
    }
  }, []);

  useEffect(() => {
    if (counters.length) {
      const payload = btoa(JSON.stringify(counters));
      Cookies.set(COOKIE_KEY, payload, { expires: COOKIE_TTL_HOURS / 24 });
    }
  }, [counters]);

  const addCounter = ({ name, color }) => {
    const id = counters.length + 1;
    setCounters([...counters, { id, name, color, count: 0, firstClick: null }]);
  };

  const resetAll = () => setCounters([]);

  const updateCounter = (id) => {
    setCounters(counters.map(c => {
      if (c.id === id) {
        const now = Date.now();
        const first = c.firstClick || now;
        return { ...c, count: c.count + 1, firstClick: first };
      }
      return c;
    }));
  };

  const computeNorm = (c) => {
    if (!c.firstClick || c.count === 0) return 0;
    const hours = (Date.now() - c.firstClick) / 36e5;
    return c.count / hours;
  };

  const globalNorm = () => {
    if (counters.length <= 1) return null;
    const norms = counters.map(computeNorm).filter(n => n > 0);
    if (!norms.length) return null;
    return norms.reduce((a,b) => a + b, 0) / norms.length;
  };

  // Build panel layout, with guaranteed half-width for 3 counters
  const buildTree = () => {
    const count = counters.length;
    if (count === 0) return null;

    if (count === 3) {
      return {
        leaf: false,
        orientation: 'vertical',
        style: { display: 'flex', width: '100%', height: '100%' },
        children: [
          { leaf: true, counter: counters[0], style: { flex: '0 0 50%', height: '100%' } },
          {
            leaf: false,
            orientation: 'horizontal',
            style: { flex: '0 0 50%', height: '100%', display: 'flex', flexDirection: 'column' },
            children: [
              { leaf: true, counter: counters[1], style: { flex: '0 0 50%', width: '100%' } },
              { leaf: true, counter: counters[2], style: { flex: '0 0 50%', width: '100%' } }
            ]
          }
        ]
      };
    }

    // generic binary split for other counts
    let root = { leaf: true, counter: counters[0], style: { flex: 1 } };
    for (let i = 2; i <= count; i++) {
      const leaves = [];
      const collect = (node, depth) => {
        if (node.leaf) leaves.push({ node, depth });
        else {
          collect(node.children[0], depth+1);
          collect(node.children[1], depth+1);
        }
      };
      collect(root, 0);
      const sel = i % 2 === 1 ? leaves[leaves.length-1] : leaves[0];
      const { node, depth } = sel;
      const newLeaf = { leaf: true, counter: counters[i-1], style: { flex: 1 } };
      const orientation = depth % 2 === 0 ? 'vertical' : 'horizontal';
      node.leaf = false;
      node.orientation = orientation;
      node.style = { display: 'flex', flex: 1, flexDirection: orientation==='vertical'?'row':'column' };
      node.children = [ { leaf: true, counter: node.counter, style: { flex: 1 } }, newLeaf ];
      delete node.counter;
    }
    return root;
  };

  const tree = buildTree();

  return (
    <div className="app">
      <Menu onAdd={addCounter} onReset={resetAll} />
      {globalNorm()!=null && <div className="global-norm">Norma: {globalNorm().toFixed(2)} /h</div>}
      <div className="panel-container">
        {tree && <Panel node={tree} onClick={updateCounter} />}
      </div>
    </div>
  );
}

export default App;