import React, { useEffect, useState } from 'react';
import Campo from '../Campo/Campo';
import CampoBusca from '../CampoBusca/CampoBusca';
import Botao from '../Botao/Botao';
import { IoMdSearch } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';


function Funcionarios() {
  const navigate = useNavigate();

  const [listaFuncionarios, setListaFuncionarios] = useState([]);

  useEffect(() => {
    const dadosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setListaFuncionarios(dadosSalvos);
  }, []);

  return (
    <>
      <h1>Funcionários</h1>

      <CampoBusca>
        <div className="opcoes-busca">
          <h3>Nome do Funcionário</h3>
          <Campo 
          placeholder="Nome"/>
        </div>

        <div className="opcoes-busca">
          <h3>CPF</h3>
          <Campo 
            tamanhoMaximo={11} 
            placeholder="000.000.000-00"
          />
        </div>

        <div className="opcoes-busca">
          <h3>PIS</h3>
          <Campo tamanhoMaximo={11}
          placeholder="000.00000.00-0"
          />
        </div>

        <div className="opcoes-busca">
          <h3>Matrícula</h3>
          <Campo tamanhoMaximo={8} placeholder="Matrícula" />
        </div>

        <div className="opcoes-busca">
          <h3>Data de Admissão</h3>
          <Campo type="date">00/00/0000</Campo>
        </div>
      </CampoBusca>

      <Botao
        tipo="primario"
        icone={<IoMdSearch />}
        aoClicar={() => {}}
      >
        Pesquisar
      </Botao>

      <Botao
        tipo="secundario"
        icone={<IoIosAdd />}
        aoClicar={() => navigate('/add-funcionarios')}
      >
        Adicionar
      </Botao>

      <div className="lista-funcionarios">
        {listaFuncionarios.length === 0 ? (
          <p>Nenhum funcionário cadastrado.</p>
        ) : (
          <ul>
            {listaFuncionarios.map((f, i) => (
              <li key={i}>
                <strong>{f.nome}</strong> CPF: {f.cpf}, PIS: {f.pis}, Matrícula: {f.matricula}, Admissão: {f.dataAdmissao}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Funcionarios;
