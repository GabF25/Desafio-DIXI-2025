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
    const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];
    setListaFuncionarios(funcionarios);
  }, []);

  return (
    <>
      <h1>Funcionários</h1>

      <CampoBusca>
      </CampoBusca>

      <Botao
        tipo="primario"
        icone={<IoMdSearch />}
        aoClicar={() => { }}
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

      <div className="lista-funcionarios" style={{ marginTop: 20 }}>
        {listaFuncionarios.length === 0 ? (
          <div>Nenhum funcionário encontrado.</div>
        ) : (
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>PIS</th>
                <th>Matrícula</th>
              </tr>
            </thead>
            <tbody>
              {listaFuncionarios.map((f, i) => (
                <tr key={i}>
                  <td>{f.nome || '-'}</td>
                  <td>{f.cpf || '-'}</td>
                  <td>{f.pis || '-'}</td>
                  <td>{f.matricula || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Funcionarios;
