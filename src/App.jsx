import axios from 'axios';
import './App.css';
import { ComparadorClicks } from './ComparadorClicks';
import { useEffect, useState } from 'react';

function reportarComparativa(comparativa) {
  axios.post("http://localhost:9000/comparison", comparativa)
}

async function getComparativa() {
  const respuesta = await axios.get("http://localhost:9000/comparison")
  return respuesta.data
}

function App() {
  const [comparativa, setComparativa] = useState(null)

  useEffect(() => {
    getComparativa().then(setComparativa)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {
          comparativa ? (
            <ComparadorClicks
              izquierda={comparativa.izquierda}
              derecha={comparativa.derecha}
              onChange={reportarComparativa}
            />
          ) : <div>Cargando...</div>
        }
      </header>
    </div>
  );
}

export default App;
