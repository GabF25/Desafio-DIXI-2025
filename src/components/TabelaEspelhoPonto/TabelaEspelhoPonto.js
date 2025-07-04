const TabelaEspelhoPonto = ({
  erroPeriodo,
  funcionarios,
  filtro,
  mostrarEspelho,
  funcionarioSelecionado,
  marcacoesFiltradas,
  horarios,
  getHorarioPorDia,
  calcularHorasTrabalhadas
}) => {
  function agruparMarcacoesPorData(marcacoes) {
    const agrupado = {};
    (marcacoes || []).forEach(m => {
      if (!agrupado[m.data]) agrupado[m.data] = [];
      agrupado[m.data].push(m.hora || m.horas);
    });
    return agrupado;
  }

  // Função para formatar a data como "Ter 01/07"
  function formatarData(dataISO) {
    if (!dataISO) return '';
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const [ano, mes, dia] = dataISO.split('-');
    const dataObj = new Date(`${ano}-${mes}-${dia}T00:00:00`);
    const diaSemana = dias[dataObj.getDay()];
    return `${diaSemana} ${dia}/${mes}`;
  }

  function formatarHorarioPadrao(data) {
    if (!horarios || !getHorarioPorDia) return '-';
    const diaSemana = getHorarioPorDia(data); // ex: "segunda"
    const horario = horarios[diaSemana];
    if (!horario || horario.entrada === "null") return "Folga";
    let texto = `Entrada: ${horario.entrada}`;
    if (horario.inicioIntervalo && horario.inicioIntervalo !== "null") {
      texto += `, Intervalo: ${horario.inicioIntervalo} - ${horario.fimIntervalo}`;
    }
    if (horario.fimExpediente && horario.fimExpediente !== "null") {
      texto += `, Saída: ${horario.fimExpediente}`;
    }
    if (horario.intervalos) {
      texto += horario.intervalos.map(
        (i, idx) => `, Intervalo${idx + 1}: ${i.inicio} - ${i.fim}`
      ).join('');
    }
    return texto;
  }

  return (
    <div style={{ marginTop: 30 }}>
      {erroPeriodo && (
        <div style={{ color: 'red', marginBottom: 16 }}>{erroPeriodo}</div>
      )}
      {funcionarios.length === 0 ? (
        <div>Nenhum funcionário encontrado.</div>
      ) : !filtro ? (
        <div style={{ color: '#888', fontStyle: 'italic' }}>
          Selecione um funcionário para visualizar o espelho de ponto.
        </div>
      ) : mostrarEspelho && funcionarioSelecionado ? (
        <div>
          <h3>{funcionarioSelecionado.nome} ({funcionarioSelecionado.cpf || funcionarioSelecionado.pis})</h3>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Marcações</th>
                <th>Horas Trabalhadas</th>
                <th>Horas Extras</th>
                <th>Faltas</th>
                <th>Atrasos</th>
                <th>Adicional Noturno</th>
                <th>Horário Padrão</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(agruparMarcacoesPorData(marcacoesFiltradas)).map(([data, horas]) => (
                <tr key={data}>
                  <td>{formatarData(data)}</td>
                  <td>{horas.sort().join(' | ')}</td>
                  <td>{calcularHorasTrabalhadas(horas)}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>{formatarHorarioPadrao(data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default TabelaEspelhoPonto;