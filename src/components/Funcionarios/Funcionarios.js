function Funcionarios() {
  return (
    <>
      <h1>Funcionário</h1>
      <div className="funcionarios-busca">

        <div className="opcoes-busca">
            <h3>Nome do funcionário</h3>
            <input type="text"></input>
        </div>

        <div>
            <h3>CPF</h3>
            <input type="text" maxLength={11}/>
        </div>

        <div>
            <h3>PIS</h3>
            <input type="text" maxLength={10}/>
        </div>

        <div>
            <h3>Matrícula</h3>
            <input type="text"/>
        </div>

        <div>
            <h3>Data de Admissão</h3>
            <input type="date"/>
        </div>
      </div>
    </>
  );
}

export default Funcionarios;