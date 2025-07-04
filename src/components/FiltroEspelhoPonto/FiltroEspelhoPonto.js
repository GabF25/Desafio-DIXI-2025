const FiltroEspelhoPonto = ({
    funcionarios,
    filtro,
    onChange

}) => {
    return (
        <div style={{ marginBottom: 20 }}>
            <label>Filtrar por funcionário:&nbsp;</label>
            <select value={filtro} onChange={onChange}>
                <option value="">Selecione um Funcionário</option>
                {funcionarios.map((f, i) => (
                    <option key={i} value={f.pis || f.cpf}>
                        {f.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default FiltroEspelhoPonto;