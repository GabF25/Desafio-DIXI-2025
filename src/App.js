import logo from './logo.svg';
import './App.css';
import Botao from './components/Botao/Botao';
import { IoMdSearch } from "react-icons/io";
import Menu from './components/Menu/Menu';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Funcionarios from './components/Funcionarios/Funcionarios.js';
import EspelhoPonto from './components/EspelhoPonto/EspelhoPonto.js';
import ImportacaoAFD from './components/ImportacaoAFD/ImportacaoAFD.js';
import Tela from './components/Tela/Tela.js';



function App() {

  return (
  <BrowserRouter>
    <Menu/>
      <Routes>
        <Route path="/funcionarios" element={<Tela>
          <Funcionarios/>
        </Tela>} />

        <Route path = "/espelho-ponto" element={<Tela>
          <EspelhoPonto/>
          </Tela>} />

        <Route path ="/importacao-afd" element = {<Tela>
          <ImportacaoAFD/>
          </Tela>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
