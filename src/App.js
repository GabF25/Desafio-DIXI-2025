import logo from './logo.svg';
import './App.css';
import Botao from './components/Botao/Botao';
import { IoMdSearch } from "react-icons/io";

function App() {
  return (
    <div className='teste'>
      <Botao
        icone={<IoMdSearch />}
        aoClicar={() => alert('Botão clicado!')}
      >
        Pesquisar
      </Botao>
    </div>
  );
}

export default App;
