import React, { useState } from 'react';
import Campo from '../Campo/Campo';
import './AddFuncionarios.css';
import Botao from '../Botao/Botao';
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const AddFuncionarios = () => {

const [funcionario, setFuncionario] = useState({
    nome: "",
    cpf: "",
    pis: "",
    matricula: "",
    data: ""
})

function teste(){
    console.log(funcionario.nome, funcionario.cpf, funcionario.pis, funcionario.matricula, funcionario.data)
}
    



    // HANDLE ou ON

    return (
        <>
            <h3>Adicionar Funcionários</h3>
            <div className="formulario-funcionario">
                <div className='campoGrupo'>
                    <h3>Nome do Funcionário</h3>
                    <Campo
                        placeholder={"Nome"}
                        value={funcionario.nome}
                        onChange={e => setFuncionario({...funcionario, nome: e.target.value})}                       
                    />
                </div>

                <div className='campoGrupo'>
                    <h3>CPF</h3>
                    <Campo
                        placeholder={"000.000.000-00"}
                        value={funcionario.cpf}
                        onChange={e => setFuncionario({...funcionario, cpf: e.target.value})}
                    />
                </div>

                <div className='campoOu'>
                    <h4>OU</h4>
                </div>

                <div className='campoGrupo'>
                    <h3>PIS</h3>
                    <Campo
                        placeholder={"000.00000.00-0"}
                        value={funcionario.pis}
                        onChange={e => setFuncionario({...funcionario, pis: e.target.value})}
                    />
                </div>

                <div className='campoGrupo'>
                    <h3>Matrícula</h3>
                    <Campo
                    value={funcionario.matricula}
                    onChange={e => setFuncionario({...funcionario, matricula: e.target.value})}
                    />
                </div>

                <div className='campoGrupo'>
                    <h3>Data de Admissão</h3>
                    <Campo type="date"
                    value={funcionario.data}
                    onChange={e => setFuncionario({...funcionario, data: e.target.value})}
                    />
                </div>

                <div className='botoesCadastro'>
                    <Botao
                        tipo='primario'
                        icone={<FaCheck />}
                        aoClicar={teste}
                    >

                        Salvar
                    </Botao>

                    <Botao
                        tipo='secundario'
                        icone={<IoMdClose />}
                    >
                        Cancelar
                    </Botao>
                </div>

            </div>
        </>
    );
}

export default AddFuncionarios;