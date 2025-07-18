import React, { useEffect, useState } from 'react';
import CampoBusca from '../CampoBusca/CampoBusca';
import Botao from '../Botao/Botao';
import { IoMdSearch } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { TbEdit } from "react-icons/tb";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import './Funcionarios.css';



function Funcionarios() {
  const navigate = useNavigate();
  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [filtroSelecionado, setFiltroSelecionado] = useState('ativos');
  const [busca, setBusca] = useState({ nome: '', cpf: '', pis: '', matricula: '', data: '' });
  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const funcionariosPorPagina = 8;

  useEffect(() => {
    const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];
    setListaFuncionarios(funcionarios);
    setResultados(funcionarios.filter(f => f.ativo));
  }, []);

  function pesquisar() {
    setPaginaAtual(1); 
    let filtrados = listaFuncionarios.filter(f => {
      if (filtroSelecionado === 'ativos' && !f.ativo) return false;
      if (filtroSelecionado === 'inativos' && f.ativo) return false;
      if (busca.nome && f.nome) {
        if (!f.nome.toLowerCase().includes(busca.nome.toLowerCase())) return false;
      }
      if (busca.cpf) {
        if (!f.cpf || !f.cpf.includes(busca.cpf)) return false;
      }
      if (busca.pis && f.pis) {
        if (!f.pis.includes(busca.pis)) return false;
      }
      if (busca.matricula && f.matricula) {
        if (!f.matricula.includes(busca.matricula)) return false;
      }
      if (busca.data && f.data) {
        if (!f.data.includes(busca.data)) return false;
      }
      return true;
    });
    setResultados(filtrados);
  }

  const totalPaginas = Math.ceil(resultados.length / funcionariosPorPagina);
  const indiceInicial = (paginaAtual - 1) * funcionariosPorPagina;
  const indiceFinal = indiceInicial + funcionariosPorPagina;
  const funcionariosPagina = resultados.slice(indiceInicial, indiceFinal);

  return (
    <div className="tela-centralizada-funcionarios">
      <h1 className="titulo-funcionarios">Funcionário</h1>

      <div className="conteudo-funcionarios">
        <CampoBusca
          value={busca}
          onChange={novo => setBusca(novo)}
        />
        <div className="botoes-funcionarios" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Botao
            tipo="primario"
            icone={<IoMdSearch />}
            aoClicar={pesquisar}
          >
            Pesquisar
          </Botao>
          <Botao
            tipo="secundario"
            icone={<IoIosAdd />}
            aoClicar={() => {
              localStorage.removeItem('funcionarioEditando');
              navigate('/add-funcionarios');
            }}
          >
            Adicionar
          </Botao>
          <select
            className='selecao-filtro'
            value={filtroSelecionado}
            onChange={e => setFiltroSelecionado(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>
        <div className="lista-funcionarios">
          {resultados.length === 0 ? (
            <div>Nenhum funcionário encontrado.</div>
          ) : (
            <>
              <table className="tabela-funcionarios" border="1" cellPadding="6">
                <thead className='cabecalho-funcionarios'>
                  <tr>
                    <th>Editar</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>PIS</th>
                    <th>Matrícula</th>
                    <th>Data de Admissão</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionariosPagina.map((f, i) => (
                    <tr key={i + indiceInicial}>
                      <td className='editar'>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Botao
                            tipo="botao-editar-funcionario"
                            icone={<TbEdit size={35} />}
                            aoClicar={() => {
                              localStorage.setItem('funcionarioEditando', JSON.stringify(f));
                              navigate('/add-funcionarios');
                            }}
                          />
                        </div>
                      </td>
                      <td>{f.nome || ''}</td>
                      <td>{f.cpf || ''}</td>
                      <td>{f.pis || ''}</td>
                      <td>{f.matricula || ''}</td>
                      <td>{
                        f.data
                          ? (() => {
                              const partes = f.data.split('-');
                              if (partes.length === 3) {
                                return `${partes[2]}/${partes[1]}/${partes[0]}`;
                              }
                              return f.data;
                            })()
                          : ''
                      }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPaginas > 1 && (
                <div className="funcionarios-navegacao">
                  <button onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1}><GrFormPrevious /></button>
                  <span>{paginaAtual}</span>
                  <button onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas}><GrFormNext /></button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Funcionarios;
