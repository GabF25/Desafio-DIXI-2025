import React, { useState } from 'react';
import Campo from '../Campo/Campo';
import Botao from '../Botao/Botao';
import { IoMdSearch } from 'react-icons/io';
import { TiRefresh } from "react-icons/ti";
import TabelaEspelhoPonto from '../TabelaEspelhoPonto/TabelaEspelhoPonto';
import FiltroEspelhoPonto from '../FiltroEspelhoPonto/FiltroEspelhoPonto';
import { CalculoUtils } from '../../utils/CalculoUtils';
import './EspelhoPonto.css';

const horarios = {
  segunda: {
    entrada: "08:00",
    inicioIntervalo: "12:00",
    fimIntervalo: "13:00",
    fimExpediente: "17:00"
  },
  terca: {
    entrada: "08:00",
    inicioIntervalo: null,
    fimIntervalo: null,
    fimExpediente: "16:00"
  },
  quarta: {
    entrada: "13:00",
    inicioIntervalo: "17:00",
    fimIntervalo: "19:00",
    inicioIntervalo2: "21:00",
    fimIntervalo2: "23:30",
    fimExpediente: "02:00"
  },
  quinta: {
    entrada: null,
    inicioIntervalo: null,
    fimIntervalo: null,
    fimExpediente: null
  },
  sexta: {
    entrada: null,
    inicioIntervalo: null,
    fimIntervalo: null,
    fimExpediente: null
  },
  sabado: {
    entrada: null,
    inicioIntervalo: null,
    fimIntervalo: null,
    fimExpediente: null
  },
  domingo: {
    entrada: null,
    inicioIntervalo: null,
    fimIntervalo: null,
    fimExpediente: null
  }
};

function gerarDatasPeriodo(dataInicial, dataFinal) {
  const datas = [];
  let atual = new Date(`${dataInicial}T00:00:00`);
  const fim = new Date(`${dataFinal}T00:00:00`);
  while (atual <= fim) {
    const ano = atual.getFullYear();
    const mes = String(atual.getMonth() + 1).padStart(2, '0');
    const dia = String(atual.getDate()).padStart(2, '0');
    datas.push(`${ano}-${mes}-${dia}`);
    atual.setDate(atual.getDate() + 1);
  }
  return datas;
}

const calcular = (marcacoes, horarioPadrao) => CalculoUtils.calcularHorasTrabalhadas(marcacoes, horarioPadrao);

function getHorarioPorDia(data) {
  const diasDaSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return diasDaSemana[dataObj.getDay()];
}

function agruparMarcacoesPorData(marcacoes) {
  const agrupado = {};
  (marcacoes || []).forEach(m => {
    let dataRef = m.data;
    if (m.hora || m.horas) {
      const horaStr = m.hora || m.horas;
      const [h, min] = horaStr.split(":").map(Number);
      const dataObj = new Date(`${m.data}T00:00:00`);
      const diaSemana = dataObj.getDay(); 

      if (h < 4) {
        const dataAnterior = new Date(dataObj);
        dataAnterior.setDate(dataAnterior.getDate() - 1);
        const ano = dataAnterior.getFullYear();
        const mes = String(dataAnterior.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAnterior.getDate()).padStart(2, '0');
        dataRef = `${ano}-${mes}-${dia}`;
      }
    }
    if (!agrupado[dataRef]) agrupado[dataRef] = [];
    agrupado[dataRef].push(m.hora || m.horas);
  });
  return agrupado;
}

function filtrarPorPeriodo(marcacoes, dataInicial, dataFinal) {
  if (!dataInicial || !dataFinal) return marcacoes;
  return marcacoes.filter(m => m.data >= dataInicial && m.data <= dataFinal);
}

const EspelhoPonto = () => {
  const funcionarios = (JSON.parse(localStorage.getItem("funcionario")) || []).filter(f => f.ativo);
  const [filtro, setFiltro] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [erroPeriodo, setErroPeriodo] = useState("");
  const [mostrarEspelho, setMostrarEspelho] = useState(false);
  const [mostrarCalculo, setMostrarCalculo] = useState(false);
  const [erros, setErros] = useState({ funcionario: false, dataInicial: false, dataFinal: false });

  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [diasCalculados, setDiasCalculados] = useState([]);

  const [resultadosSalvos, setResultadosSalvos] = useState({});

  const datasPeriodo = (dataInicial && dataFinal) ? gerarDatasPeriodo(dataInicial, dataFinal) : [];

  const hoje = new Date().toISOString().slice(0, 10);

  const funcionarioSelecionado = filtro
    ? funcionarios.find(f => f.pis === filtro || f.cpf === filtro)
    : null;

  const chaveEspelho = funcionarioSelecionado ? `espelhoResultados_${funcionarioSelecionado.cpf || funcionarioSelecionado.pis}` : null;

  React.useEffect(() => {
    if (!chaveEspelho) return;
    const salvos = JSON.parse(localStorage.getItem(chaveEspelho)) || {};
    setResultadosSalvos(salvos);
  }, [mostrarEspelho, chaveEspelho]);

  React.useEffect(() => {
    setErroPeriodo("");
    setMostrarEspelho(false);
    setMostrarCalculo(false);
    setDiasSelecionados([]);
    if (dataInicial && dataFinal) {
      if (dataInicial > dataFinal) {
        setErroPeriodo("A data inicial não pode ser maior que a data final.");
      } else if (dataInicial > hoje || dataFinal > hoje) {
        setErroPeriodo("A data inicial e a data final não podem ser maiores que hoje.");
      } else {
        const dtIni = new Date(dataInicial);
        const dtFim = new Date(dataFinal);
        const diff = (dtFim - dtIni) / (1000 * 60 * 60 * 24);
        if (diff > 90) {
          setErroPeriodo("O período não pode ser maior que 90 dias.");
        }
      }
    }
  }, [filtro, dataInicial, dataFinal]);

  let marcacoesFiltradas = funcionarioSelecionado?.marcacoes || [];
  if (dataInicial && dataFinal && !erroPeriodo) {
    marcacoesFiltradas = filtrarPorPeriodo(marcacoesFiltradas, dataInicial, dataFinal);
  }

  function handlePesquisar() {
    const novosErros = {
      funcionario: !filtro,
      dataInicial: !dataInicial,
      dataFinal: !dataFinal
    };
    setErros(novosErros);
    if (novosErros.funcionario || novosErros.dataInicial || novosErros.dataFinal || !!erroPeriodo) return;
    setMostrarEspelho(true);
  }

  function handleCalcular() {
    setMostrarCalculo(true);
    setDiasCalculados(diasSelecionados);

    if (!chaveEspelho) return;

    const antigos = JSON.parse(localStorage.getItem(chaveEspelho)) || {};

    const todasMarcacoes = funcionarioSelecionado?.marcacoes || [];
    const agrupado = agruparMarcacoesPorData(todasMarcacoes);

    diasSelecionados.forEach(data => {
      const horas = agrupado[data] || [];
      const diaSemana = getHorarioPorDia(data);
      const horarioPadrao = horarios[diaSemana];
      antigos[data] = {
        trabalhadas: calcular(horas, horarioPadrao),
        extras: CalculoUtils.calcularHorasExtrasSimples(horas, horarioPadrao),

        faltas: (horas.length === 0 || horas.length === 1) ? CalculoUtils.calcularHorasFaltas(horas, horarioPadrao) : "--:--",
        atrasos: CalculoUtils.calcularHorasAtrasos(horas, horarioPadrao),
        adicionalNoturno: CalculoUtils.calcularAdicionalNoturno(horas, horarioPadrao),
      };
    });
    localStorage.setItem(chaveEspelho, JSON.stringify(antigos));
    setResultadosSalvos(antigos);
    setDiasSelecionados([]);
  }

  function handleSelecionarDia(data, checked) {
    setDiasSelecionados(prev =>
      checked
        ? [...prev, data]
        : prev.filter(d => d !== data)
    );
  }

  function handleSelecionarTodos(checked) {
    if (checked) {
      setDiasSelecionados(datasPeriodo);
    } else {
      setDiasSelecionados([]);
    }
  }

  return (
    <div className='espelho-ponto-container'>
      <div className='espelho-ponto-cabecalho'>
        <h1>Espelho de Ponto</h1>
        <h4 className='subtitulo-espelho-ponto'>Selecione o período e um Funcionário para consulta</h4>
      </div>

      <div className='espelho-ponto-pesquisa'>
        <div className='filtro-espelho-container'>
          <FiltroEspelhoPonto
            className={`filtro-espelho-select${erros.funcionario ? ' campo-erro' : ''}`}
            funcionarios={funcionarios}
            filtro={filtro}
            onChange={e => { setFiltro(e.target.value); setErros(prev => ({ ...prev, funcionario: false })); }}
          />

          <div className='campo-data-espelho'>
            <Campo
              label={<span className='label-espelho-ponto'>Data Inicial</span>}
              type="date"
              value={dataInicial}
              max={hoje}
              onChange={e => { setDataInicial(e.target.value); setErros(prev => ({ ...prev, dataInicial: false })); }}
              className={erros.dataInicial ? 'campo-erro' : ''}
            />
            <Campo
              label={<span className='label-espelho-ponto'>Data Final</span>}
              type="date"
              value={dataFinal}
              max={hoje}
              onChange={e => { setDataFinal(e.target.value); setErros(prev => ({ ...prev, dataFinal: false })); }}
              className={erros.dataFinal ? 'campo-erro' : ''}
            />
          </div>
          <div className='botoes-espelho'>
            <Botao
              tipo="primario"
              icone={<IoMdSearch />}
              aoClicar={handlePesquisar}
              disabled={!!erroPeriodo}
            >
              Pesquisar
            </Botao>

            <Botao
              tipo="secundario"
              icone={<TiRefresh />}
              aoClicar={handleCalcular}
              disabled={!mostrarEspelho}
            >
              Calcular
            </Botao>
          </div>

        </div>
        <div className='tabela-espelho-container'>
          <TabelaEspelhoPonto
            erroPeriodo={erroPeriodo}
            funcionarios={funcionarios}
            filtro={filtro}
            datasPeriodo={datasPeriodo}
            mostrarEspelho={mostrarEspelho}
            funcionarioSelecionado={funcionarioSelecionado}
            marcacoesFiltradas={funcionarioSelecionado?.marcacoes || []}
            horarios={horarios}
            getHorarioPorDia={getHorarioPorDia}
            calcularHorasTrabalhadas={calcular}
            diasSelecionados={diasSelecionados}
            onSelecionarDia={handleSelecionarDia}
            onSelecionarTodos={handleSelecionarTodos}
            mostrarCalculo={mostrarCalculo}
            diasCalculados={diasCalculados}
            resultadosSalvos={resultadosSalvos}
          />
        </div>

      </div>
    </div>
  );
};

export default EspelhoPonto;