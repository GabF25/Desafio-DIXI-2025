import React from 'react';
import Campo from '../Campo/Campo'; 

const EspelhoPonto = () => {
  return (
    <div>
      <h1>Espelho de Ponto</h1>
      <Campo placeholder="Espelho de Ponto" />
      <Campo placeholder="Data Inicial" type="date" />
    </div>
  );
};

export default EspelhoPonto;
