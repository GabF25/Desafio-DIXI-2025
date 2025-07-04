import logo from './logo.svg';
import './App.css';
import Botao from './components/Botao/Botao';
import { IoMdSearch } from "react-icons/io";
import Menu from './components/Menu/Menu';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Funcionarios from './components/Funcionarios/Funcionarios.js';
import EspelhoPonto from './components/EspelhoPonto/EspelhoPonto.js';
import ImportacaoAFD from './components/ImportacaoAFD/ImportacaoAFD.js';
import Tela from './components/Tela/Tela.js';
import AddFuncionarios from './components/AddFuncionarios/AddFuncionarios.js';


function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route 
          path="/" //<- home
          element={
            <Tela>
              <Funcionarios/>
            </Tela>
          } 
        />

        <Route 
          path="/funcionarios" 
          element={
            <Tela>
              <Funcionarios/>
            </Tela>
          } 
        />

         <Route
          path="/add-funcionarios" 
          element={
            <Tela>
              <AddFuncionarios/>
            </Tela>
          }
        />

        <Route
          path = "/espelho-ponto" 
          element={
            <Tela>
              <EspelhoPonto/>
            </Tela>
          } 
        />

        <Route 
          path ="/importacao-afd" 
          element = {
            <Tela>
              <ImportacaoAFD/>
            </Tela>
          } 
        />

        <Route 
          path ="*" 
          element = {
            <Tela>
              <div>404</div>
            </Tela>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
