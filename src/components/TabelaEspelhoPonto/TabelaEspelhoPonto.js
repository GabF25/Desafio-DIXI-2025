import './TabelaEspelhoPonto.css';

const TabelaEspelhoPonto = ({
  erroPeriodo,
  funcionarios,
  datasPeriodo,
  mostrarEspelho,
  funcionarioSelecionado,
  marcacoesFiltradas,
  horarios,
  getHorarioPorDia,
  diasSelecionados = [],
  onSelecionarDia = () => {},
  onSelecionarTodos = () => {},
  resultadosSalvos = {}
}) => {
  function agruparMarcacoesPorData(marcacoes) {
    const agrupado = {};
    (marcacoes || []).forEach(m => {
      let dataRef = m.data;
      if (m.hora || m.horas) {
        const horaStr = m.hora || m.horas;
        const [h, min] = horaStr.split(":").map(Number);
        const dataObj = new Date(`${m.data}T00:00:00`);
        const diaSemana = dataObj.getDay(); 
        
        if (diaSemana === 4 && h < 4) {
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

    Object.keys(agrupado).forEach(data => {
      const dataObj = new Date(`${data}T00:00:00`);
      const diaSemana = dataObj.getDay();
      agrupado[data] = agrupado[data].sort((a, b) => {
        const toMinutes = hstr => {
          const [h, m] = hstr.split(":").map(Number);

          if (diaSemana === 4 && h < 4) {
            return (h + 24) * 60 + m;
          }
          return h * 60 + m;
        };
        return toMinutes(a) - toMinutes(b);
      });
    });
    return agrupado;
  }

  function formatarData(dataISO) {
    if (!dataISO) return '';
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const [ano, mes, dia] = dataISO.split('-');
    const dataObj = new Date(`${ano}-${mes}-${dia}T00:00:00`);
    const diaSemana = dias[dataObj.getDay()];
    return `${diaSemana} ${dia}/${mes}/${ano}`;
  }

  const marcacoesPorData = agruparMarcacoesPorData(marcacoesFiltradas);
  return (
    <div className="tabela-espelho-container">
      {erroPeriodo && (
        <div className="erro-periodo">{erroPeriodo}</div>
      )}
      {funcionarios.length === 0 ? (
        <div className="nenhum-funcionario">Nenhum funcionário encontrado.</div>
      ) : mostrarEspelho && funcionarioSelecionado ? (
        <div>
          <table className="tabela-espelho">
            <thead className='cabecalho-espelho'>
              <tr>
                <th className='ocorrencia coluna-selecao'>
                  <input
                    type="checkbox"
                    className="caixa-selecao"
                    checked={diasSelecionados.length === datasPeriodo.length && datasPeriodo.length > 0}
                    onChange={e => onSelecionarTodos(e.target.checked)}
                  />
                </th>
                <th className='data'>Data</th>
                <th className='marcacoes'>Marcações</th>
                <th className='ocorrencia'>Horas Trabalhadas</th>
                <th className='ocorrencia'>Horas Extras</th>
                <th className='ocorrencia'>Faltas</th>
                <th className='ocorrencia'>Atrasos</th>
                <th className='ocorrencia'>Adicional Noturno</th>
              </tr>
            </thead>
            <tbody>
              {datasPeriodo.map(data => {
                let horas = marcacoesPorData[data] || [];
                horas = horas.slice().sort((a, b) => {
                  const toMinutes = hstr => {
                    const [h, m] = hstr.split(":").map(Number);
                    return h < 4 ? (h + 24) * 60 + m : h * 60 + m;
                  };
                  return toMinutes(a) - toMinutes(b);
                });
                const diaSemana = getHorarioPorDia(data);
                const horarioPadrao = horarios[diaSemana];

                let faltaCalculada = resultadosSalvos[data]?.faltas === undefined || resultadosSalvos[data]?.faltas === null
                  ? (() => {
                      if (!horarioPadrao || horarioPadrao.entrada == null || horarioPadrao.fimExpediente == null) return "";
                      const [hEntrada, mEntrada] = horarioPadrao.entrada.split(":").map(Number);
                      const [hSaida, mSaida] = horarioPadrao.fimExpediente.split(":").map(Number);
                      let entradaMin = hEntrada * 60 + mEntrada;
                      let saidaMin = hSaida * 60 + mSaida;
                      if (saidaMin <= entradaMin) saidaMin += 24 * 60;
                      let minutosJornada = saidaMin - entradaMin;
                      if (horarioPadrao.inicioIntervalo && horarioPadrao.fimIntervalo) {
                        let ini = horarioPadrao.inicioIntervalo.split(":").map(Number);
                        let fim = horarioPadrao.fimIntervalo.split(":").map(Number);
                        let iniMin = ini[0] * 60 + ini[1];
                        let fimMin = fim[0] * 60 + fim[1];
                        if (fimMin <= iniMin) fimMin += 24 * 60;
                        minutosJornada -= (fimMin - iniMin);
                      }
                      if (horarioPadrao.inicioIntervalo2 && horarioPadrao.fimIntervalo2) {
                        let ini2 = horarioPadrao.inicioIntervalo2.split(":").map(Number);
                        let fim2 = horarioPadrao.fimIntervalo2.split(":").map(Number);
                        let iniMin2 = ini2[0] * 60 + ini2[1];
                        let fimMin2 = fim2[0] * 60 + fim2[1];
                        if (fimMin2 <= iniMin2) fimMin2 += 24 * 60;
                        minutosJornada -= (fimMin2 - iniMin2);
                      }
                      if (minutosJornada > 0) {
                        const horasFaltas = Math.floor(minutosJornada / 60).toString().padStart(2, '0');
                        const minutosFaltas = (minutosJornada % 60).toString().padStart(2, '0');
                        const faltaStr = `${horasFaltas}:${minutosFaltas}`;
                        return faltaStr === "00:00" ? "" : faltaStr;
                      }
                      return "";
                    })()
                  : resultadosSalvos[data]?.faltas === "--:--" || resultadosSalvos[data]?.faltas === "00:00" ? "" : resultadosSalvos[data]?.faltas;

                let extras = "";
                let atrasos = "";
                let adicionalNoturno = "";

                const isFolgaSemMarcacao = (!horarioPadrao || horarioPadrao.entrada == null || horarioPadrao.fimExpediente == null) && horas.length < 2;
                if (!faltaCalculada && !isFolgaSemMarcacao) {

                  extras = resultadosSalvos[data]?.extras || "";
                  if ((horarioPadrao?.entrada == null || horarioPadrao?.fimExpediente == null) && horas.length >= 2) {
                    let totalMinutos = 0;
                    for (let i = 0; i < horas.length - 1; i += 2) {
                      const [h1, m1] = horas[i].split(":").map(Number);
                      const [h2, m2] = horas[i + 1].split(":").map(Number);
                      let entrada = h1 * 60 + m1;
                      let saida = h2 * 60 + m2;
                      if (saida <= entrada) saida += 24 * 60;
                      totalMinutos += Math.max(0, saida - entrada);
                    }
                    const horasExtrasFormatadas = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
                    const minutosExtrasFormatados = (totalMinutos % 60).toString().padStart(2, '0');
                    const extrasStr = `${horasExtrasFormatadas}:${minutosExtrasFormatados}`;
                    extras = (totalMinutos > 0 && extrasStr !== "00:00") ? extrasStr : "";
                  }
                  if (extras === "00:00") extras = "";

                  atrasos = resultadosSalvos[data]?.atrasos || "";
                  if (
                    (horarioPadrao?.entrada != null && horarioPadrao?.fimExpediente != null)
                    && horas.length >= 2
                  ) {
                    let totalMinutos = 0;
                    for (let i = 0; i < horas.length - 1; i += 2) {
                      const [h1, m1] = horas[i].split(":").map(Number);
                      const [h2, m2] = horas[i + 1].split(":").map(Number);
                      let entrada = h1 * 60 + m1;
                      let saida = h2 * 60 + m2;
                      if (saida <= entrada) saida += 24 * 60;
                      totalMinutos += Math.max(0, saida - entrada);
                    }
                    const [hEntrada, mEntrada] = horarioPadrao.entrada.split(":").map(Number);
                    const [hSaida, mSaida] = horarioPadrao.fimExpediente.split(":").map(Number);
                    let entradaMin = hEntrada * 60 + mEntrada;
                    let saidaMin = hSaida * 60 + mSaida;
                    if (saidaMin <= entradaMin) saidaMin += 24 * 60;
                    let minutosJornada = saidaMin - entradaMin;
                    if (horarioPadrao.inicioIntervalo && horarioPadrao.fimIntervalo) {
                      let ini = horarioPadrao.inicioIntervalo.split(":").map(Number);
                      let fim = horarioPadrao.fimIntervalo.split(":").map(Number);
                      let iniMin = ini[0] * 60 + ini[1];
                      let fimMin = fim[0] * 60 + fim[1];
                      if (fimMin <= iniMin) fimMin += 24 * 60;
                      minutosJornada -= (fimMin - iniMin);
                    }
                    if (horarioPadrao.inicioIntervalo2 && horarioPadrao.fimIntervalo2) {
                      let ini2 = horarioPadrao.inicioIntervalo2.split(":").map(Number);
                      let fim2 = horarioPadrao.fimIntervalo2.split(":").map(Number);
                      let iniMin2 = ini2[0] * 60 + ini2[1];
                      let fimMin2 = fim2[0] * 60 + fim2[1];
                      if (fimMin2 <= iniMin2) fimMin2 += 24 * 60;
                      minutosJornada -= (fimMin2 - iniMin2);
                    }
                    const minutosAtraso = Math.max(0, minutosJornada - totalMinutos);
                    if (minutosAtraso > 0) {
                      const horasAtrasoFormatadas = Math.floor(minutosAtraso / 60).toString().padStart(2, '0');
                      const minutosAtrasoFormatados = (minutosAtraso % 60).toString().padStart(2, '0');
                      atrasos = `${horasAtrasoFormatadas}:${minutosAtrasoFormatados}`;
                      if (atrasos === "00:00") atrasos = "";
                    } else {
                      atrasos = "";
                    }
                  }

                  adicionalNoturno = "";
                  if (horas.length >= 2) {
                    let totalMinutosNoturnos = 0;
                    for (let i = 0; i < horas.length - 1; i += 2) {
                      const [h1, m1] = horas[i].split(":").map(Number);
                      const [h2, m2] = horas[i + 1].split(":").map(Number);
                      let entrada = h1 * 60 + m1;
                      let saida = h2 * 60 + m2;
                      if (saida <= entrada) saida += 24 * 60;
                      for (let min = entrada; min < saida; min++) {
                        let horaAbsoluta = min % (24 * 60);
                        if ((horaAbsoluta >= 1320 && horaAbsoluta < 1440) || (horaAbsoluta >= 0 && horaAbsoluta < 120)) {
                          totalMinutosNoturnos++;
                        }
                      }
                    }
                    if (totalMinutosNoturnos > 0) {
                      const horasNoturnas = Math.floor(totalMinutosNoturnos / 60).toString().padStart(2, '0');
                      const minutosNoturnos = (totalMinutosNoturnos % 60).toString().padStart(2, '0');
                      adicionalNoturno = `${horasNoturnas}:${minutosNoturnos}`;
                      if (adicionalNoturno === "00:00") adicionalNoturno = "";
                    } else {
                      adicionalNoturno = "";
                    }
                  } else {
                    adicionalNoturno = "";
                  }
                }

                const mostrarResultados = !!resultadosSalvos[data];
                return (
                  <tr key={data}>
                    <td className='coluna-selecao'>
                      <input className="caixa-selecao"
                        type="checkbox"
                        checked={diasSelecionados.includes(data)}
                        onChange={e => onSelecionarDia(data, e.target.checked)}
                      />
                    </td>
                    <td>{formatarData(data)}</td>
                    <td className='registros'>{horas.join(' ')}</td>
                    <td className='ocorrencia-resultados'>{mostrarResultados ? ((!faltaCalculada && !(isFolgaSemMarcacao)) ? (resultadosSalvos[data]?.trabalhadas || "") : "") : ""}</td>
                    <td className='ocorrencia-resultados'>{mostrarResultados ? extras : ""}</td>
                    <td className='ocorrencia-resultados'>{mostrarResultados ? faltaCalculada : ""}</td>
                    <td className='ocorrencia-resultados'>
                      {mostrarResultados
                        ? (
                            (horarioPadrao?.entrada == null || horarioPadrao?.fimExpediente == null)
                              ? (horas.length >= 2 ? "" : atrasos)
                              : (atrasos === "00:00" ? "" : atrasos)
                          )
                        : ""
                      }
                    </td>
                    <td className='ocorrencia-resultados'>{mostrarResultados ? adicionalNoturno : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export function limparFormatacaoCpfPis(valor) {
  if (!valor) return '';
  return valor.replace(/[^0-9]/g, '');
}

export function parseAFDPersonalizado(linhas) {
  return linhas.slice(1).map(linha => {
    const dataStr = linha.substr(9, 8);
    const dataFormatada = `20${dataStr.substr(4, 2)}-${dataStr.substr(2, 2)}-${dataStr.substr(0, 2)}`;
    const hora = linha.substr(17, 4);
    const horaFormatada = `${hora.substr(0, 2)}:${hora.substr(2, 2)}`;
    const pisOuCpf = linha.substr(21, 11);
    if (pisOuCpf.startsWith('9')) {
      return {
        data: dataFormatada,
        hora: horaFormatada,
        cpf: limparFormatacaoCpfPis(pisOuCpf.substr(1, 11))
      };
    } else {
      return {
        data: dataFormatada,
        hora: horaFormatada,
        pis: limparFormatacaoCpfPis(pisOuCpf)
      };
    }
  });
}

export default TabelaEspelhoPonto;