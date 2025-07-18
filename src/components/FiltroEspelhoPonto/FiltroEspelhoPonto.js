import React from 'react';
import './FiltroEspelhoPonto.css';

const FiltroEspelhoPonto = ({
    funcionarios,
    filtro,
    onChange,
    className = ''

}) => {
    return (
        <div style={{ marginBottom: 20 }}>
            <select value={filtro} onChange={onChange} className={className}>
                <option value="">Selecione o Funcionário</option>
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