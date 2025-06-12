import "./ContadorClicks.css";
import { useRef, useEffect } from "react";
import axios from "axios";

function reportarPosicion(x, y) {
  axios.post("http://localhost:9000/position", { x, y });
}

export function ContadorClicks({ clicks, setClicks, ganador }) {
  const canvasRef = useRef(null);
  const squareSize = 20; // Tamaño fijo para los cuadrados

  // Ajustar el tamaño del canvas al montar el componente y cuando cambia el tamaño
  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      // Obtener las dimensiones del contenedor
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Coordenadas relativas al canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClicks(clicks + 1);
    reportarPosicion(x, y);

    // Dibujar el cuadrado centrado en el punto de click
    const ctx = canvas.getContext("2d");
    const color = getColorAleatorio();
    ctx.fillStyle = color;
    // Calculamos la posición para que el cuadrado esté centrado en el click
    const squareX = x - squareSize / 2;
    const squareY = y - squareSize / 2;
    ctx.fillRect(squareX, squareY, squareSize, squareSize);
  };

  const getColorAleatorio = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className={`ContadorClicks ${ganador ? "ganador" : ""}`}>
      <div className="ContadorClicks-contador">Número de clicks: {clicks}</div>
      <canvas
        ref={canvasRef}
        className="ContadorClicks-lienzo"
        onClick={handleClick}
      />
    </div>
  );
}