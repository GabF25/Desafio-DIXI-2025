import React, { useState } from 'react';
import Campo from '../Campo/Campo';
import Botao from '../Botao/Botao';
import { IoMdSearch } from 'react-icons/io';
import { TiRefresh } from "react-icons/ti";
import TabelaEspelhoPonto from '../TabelaEspelhoPonto/TabelaEspelhoPonto';
import FiltroEspelhoPonto from '../FiltroEspelhoPonto/FiltroEspelhoPonto';


const horarios = {
  segunda: {
    entrada: "08:00",
    inicioIntervalo: "12:00",
    fimIntervalo: "13:00",
    fimExpediente: "17:00"
  },

  terca: {
    entrada: "08:00",
    inicioIntervalo: "null",
    fimIntervalo: "null",
    fimExpediente: "16:00",
  },
  quarta: {
    entrada: "13:00",
    intervalos: [
      { inicio: "17:00", fim: "19:00" },
      { inicio: "21:00", fim: "23:30" }
    ],
    fimExpediente: "02:00"
  },
  quinta: {
    entrada: "null",
    inicioIntervalo: "null",
    fimIntervalo: "null",
    fimExpediente: "null"
  },
  sexta: {
    entrada: "null",
    inicioIntervalo: "null",
    fimIntervalo: "null",
    fimExpediente: "null"
  },
  sabado: {
    entrada: "null",
    inicioIntervalo: "null",
    fimIntervalo: "null",
    fimExpediente: "null"
  },
  domingo: {
    entrada: "null",
    inicioIntervalo: "null",
    fimIntervalo: "null",
    fimExpediente: "null"
  }
}
//Aqui em cima tem os horários pra cada dia '-'

function getHorarioPorDia(data) {
  const diasDaSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return diasDaSemana[dataObj.getDay()];
}
//Aqui em cima vamos ter uma função para identificar os horários por dias

function calcularHorasTrabalhadas(marcacoes) {
  if (!marcacoes || marcacoes.length < 2) return "00:00";
  // Ordena os horários
  const ordenados = marcacoes.slice().sort();
  let totalMinutos = 0;
  // Faz pares de entrada/saída
  for (let i = 0; i < ordenados.length - 1; i += 2) {
    const [h1, m1] = ordenados[i].split(':').map(Number);
    const [h2, m2] = ordenados[i + 1].split(':').map(Number);
    const entrada = h1 * 60 + m1;
    const saida = h2 * 60 + m2;
    totalMinutos += Math.max(0, saida - entrada);
  }
  // Converte para HH:MM
  const horas = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
  const minutos = (totalMinutos % 60).toString().padStart(2, '0');
  return `${horas}:${minutos}`;
}

//Aqui em cima temos uma função para calcular as horas trabalhadas 

function agruparMarcacoesPorData(marcacoes) {
  const agrupado = {};
  (marcacoes || []).forEach(m => {
    if (!agrupado[m.data]) agrupado[m.data] = [];
    agrupado[m.data].push(m.hora || m.horas);
  });
  return agrupado;
}

function filtrarPorPeriodo(marcacoes, dataInicial, dataFinal) {
  if (!dataInicial || !dataFinal) return marcacoes;
  return marcacoes.filter(m => m.data >= dataInicial && m.data <= dataFinal);
}

const EspelhoPonto = () => {
  const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];
  const [filtro, setFiltro] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [erroPeriodo, setErroPeriodo] = useState("");
  const [mostrarEspelho, setMostrarEspelho] = useState(false);

  const hoje = new Date().toISOString().slice(0, 10);

  const funcionarioSelecionado = filtro
    ? funcionarios.find(f => f.pis === filtro || f.cpf === filtro)
    : null;

  // Validação de período
  React.useEffect(() => {
    setErroPeriodo("");
    setMostrarEspelho(false); // Oculta o espelho ao mudar filtro ou datas
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

  // Marcações filtradas por período
  let marcacoesFiltradas = funcionarioSelecionado?.marcacoes || [];
  if (dataInicial && dataFinal && !erroPeriodo) {
    marcacoesFiltradas = filtrarPorPeriodo(marcacoesFiltradas, dataInicial, dataFinal);
  }

  function handlePesquisar() {
    if (!erroPeriodo && funcionarioSelecionado && dataInicial && dataFinal) {
      setMostrarEspelho(true);
    }
  }

  return (
    <div>
      <h1>Espelho de Ponto</h1>

      <FiltroEspelhoPonto
        funcionarios={funcionarios}
        filtro={filtro}
        onChange={e => setFiltro(e.target.value)}
      />

      <Campo
        placeholder="Data Inicial"
        type="date"
        value={dataInicial}
        max={hoje}
        onChange={e => setDataInicial(e.target.value)}
      />
      <Campo
        placeholder="Data Final"
        type="date"
        value={dataFinal}
        max={hoje}
        onChange={e => setDataFinal(e.target.value)}
      />

      <Botao
        tipo="primario"
        icone={<IoMdSearch />}
        aoClicar={handlePesquisar}
        disabled={!filtro || !dataInicial || !dataFinal || !!erroPeriodo}
      >
        Pesquisar
      </Botao>

      <Botao
        tipo="secundario"
        icone={<TiRefresh />}
      >
        Calcular
      </Botao>

      <TabelaEspelhoPonto
        erroPeriodo={erroPeriodo}
        funcionarios={funcionarios}
        filtro={filtro}
        mostrarEspelho={mostrarEspelho}
        funcionarioSelecionado={funcionarioSelecionado}
        marcacoesFiltradas={marcacoesFiltradas}
        horarios={horarios}
        getHorarioPorDia={getHorarioPorDia}
        calcularHorasTrabalhadas={calcularHorasTrabalhadas}
      />

    </div>
  );
};

export default EspelhoPonto;