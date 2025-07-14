import React, { useState, useEffect, useMemo } from 'react';
import Menu from '../components/menu';
import Panel from '../components/Panel';
import Cookies from 'js-cookie';
import './App.css';

// Klucze do ciastek i TTL (czas życia ciasteczka)
const COOKIE_KEY = 'multi_counters';
const COOKIE_TTL_DAYS = 1;

function App() {
  const [counters, setCounters] = useState([]); // Lista liczników

  // Pobranie danych z ciasteczka przy pierwszym renderze komponentu
  useEffect(() => {
    const data = Cookies.get(COOKIE_KEY);
    if (data) {
      try {
        setCounters(JSON.parse(atob(data))); // Dekodowanie z base64
      } catch {}
    }
  }, []);

  // Zapis danych do ciasteczka po każdej zmianie liczników
  useEffect(() => {
    if (!counters.length) return;
    Cookies.set(COOKIE_KEY, btoa(JSON.stringify(counters)), { expires: COOKIE_TTL_DAYS });
  }, [counters]);

  // Dodanie nowego licznika
  const addCounter = ({ name, color }) => {
    const id = counters.length + 1;
    setCounters(prev => [...prev, { id, name, color, count: 0, firstClick: null }]);
  };

  // Reset wszystkich liczników
  const resetAll = () => setCounters([]);

  // Aktualizacja jednego licznika po kliknięciu
  const updateCounter = (id) => {
    const now = Date.now();
    setCounters(prev => prev.map(c =>
      c.id === id
        ? { ...c, count: c.count + 1, firstClick: c.firstClick || now }
        : c
    ));
  };

  // Oblicz sumę kliknięć we wszystkich licznikach
  const computeSum = useMemo(() =>
    counters.reduce((sum, { count = 0 }) => sum + count, 0)
  , [counters]);

  // Oblicz normę (kliknięcia na godzinę) dla jednego licznika
  const computeNorm = ({ firstClick, count }) => {
    if (!firstClick || count === 0) return 0;
    return count / ((Date.now() - firstClick) / 36e5); // 36e5 = 3600000 = ms w 1h
  };

  // Oblicz średnią normę ze wszystkich aktywnych liczników
  const globalNorm = useMemo(() => {
    if (counters.length <= 1) return null;
    const norms = counters.map(computeNorm).filter(n => n > 0);
    return norms.length ? norms.reduce((a, b) => a + b, 0) / norms.length : null;
  }, [counters]);

  // Generowanie struktury drzewa (layoutu) liczników
  const buildTree = () => {
    const count = counters.length;
    if (count === 0) return null;

    // Specjalny układ dla 3 liczników - były problemy dlatego został utworzony wyjatek w przyszłości postaram się to naprawić ale narazie musi tak zostać
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

    // Ogólny przypadek: rekurencyjne dzielenie na drzewo binarne
    let root = { leaf: true, counter: counters[0], style: { flex: 1 } };
    for (let i = 1; i < count; i++) {
      const leaves = [];

      // Zbierz wszystkie liście drzewa (do których można dodać nowe panele)
      const collect = (node, depth = 0) => {
        node.leaf
          ? leaves.push({ node, depth })
          : node.children.forEach(child => collect(child, depth + 1));
      };

      collect(root);
      const { node, depth } = i % 2 ? leaves[leaves.length - 1] : leaves[0];
      const orientation = depth % 2 ? 'horizontal' : 'vertical';

      // Zastąp liść nowym węzłem z dwoma dziećmi
      Object.assign(node, {
        leaf: false,
        orientation,
        style: { display: 'flex', flex: 1, flexDirection: orientation === 'vertical' ? 'row' : 'column' },
        children: [
          { leaf: true, counter: node.counter, style: { flex: 1 } },
          { leaf: true, counter: counters[i], style: { flex: 1 } }
        ]
      });

      delete node.counter; // usunięcie starego pola, bo teraz node nie jest liściem
    }
    return root;
  };

  const tree = useMemo(buildTree, [counters]); // Odświeżaj drzewo tylko przy zmianie liczników

  return (
    <div className="app">
      <Menu onAdd={addCounter} onReset={resetAll} />
      {tree && (
        <div className="global-norm">
          Suma: {computeSum} &nbsp; Norma: {globalNorm?.toFixed(2)} /h
        </div>
      )}
      <div className="panel-container">
        {tree && <Panel node={tree} onClick={updateCounter} />}
      </div>
    </div>
  );
}

export default App;