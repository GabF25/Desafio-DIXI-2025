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

    function salvarFuncionario() {
        const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];
        funcionarios.push(funcionario);
        localStorage.setItem("funcionario", JSON.stringify(funcionarios));
        console.log("Funcionário Cadastrado")
    }

    function cadastrar() {
        if (!validarCpf(funcionario.cpf)) {
            console.log("CPF inválido")
        } else if(funcionarioCadastrado(funcionario)) {
            return;
        } else {
            salvarFuncionario();
        }

    }

    function validarCpf(cpf) {
        if (!cpf)
            return false;
        cpf = cpf.replace(/\D/g, '');

        return cpf.length == 11;
    }

    function funcionarioCadastrado(funcionario) {
        const cpfNumeros = funcionario.cpf.replace(/\D/g, '');
        const pis = funcionario.pis;
        const matricula = funcionario.matricula;

        const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];
        const cpf = cpfNumeros;

        return funcionarios.some(f => {
            const fCpf = f.cpf.replace(/\D/g, '');
            const fPis = f.pis;
            const fMatricula = f.matricula;

            if (fCpf === cpfNumeros) {
                console.log("CPF já cadastrado!")
                return true;
            }

            else if (fPis === pis) {
                console.log("PIS já Cadastrado")
                return true;
            }

            else if (fMatricula === matricula) {
                console.log("Matrícula já Cadastrada")
                return true;
            }
            return false;
            
        });
        
        
    }


    return (
        <>
            <h3>Adicionar Funcionários</h3>
            <div className="formulario-funcionario">
                <div className='campoGrupo'>
                    <h3>Nome do Funcionário</h3>
                    <Campo
                        placeholder={"Nome"}
                        value={funcionario.nome}
                        onChange={e => setFuncionario({ ...funcionario, nome: e.target.value })}
                    />
                </div>

                <div className='campoGrupo'>
                    <h3>CPF</h3>
                    <Campo
                        placeholder={"000.000.000-00"}
                        tamanhoMaximo={14}
                        value={funcionario.cpf}
                        onChange={e => {
                            const valor = e.target.value;
                            const numeros = valor.replace(/\D/g, '');
                            const formatado = numeros
                                .replace(/(\d{3})(\d)/, '$1.$2')
                                .replace(/(\d{3})(\d)/, '$1.$2')
                                .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

                            setFuncionario({ ...funcionario, cpf: formatado });
                        }}
                    />
                </div>

                <div className='campoOu'>
                    <h4>OU</h4>
                </div>

                <div className='campoGrupo'>
                    <h3>PIS</h3>
                    <Campo
                        placeholder={"000.00000.00-0"}
                        tamanhoMaximo={14}
                        value={funcionario.pis}
                        onChange={e => {
                            const valor = e.target.value;
                            const numeros = valor.replace(/\D/g, '');
                            const formatado = numeros
                                .replace(/(\d{3})(\d)/, '$1.$2')
                                .replace(/(\d{5})(\d)/, '$1.$2')
                                .replace(/(\d{2})(\d)$/, '$1-$2');

                            setFuncionario({ ...funcionario, pis: formatado });
                        }}
                    />
                </div>

                <div className='campoGrupo'>
                    <h3>Matrícula</h3>
                    <Campo
                        value={funcionario.matricula}
                        tamanhoMaximo={8}
                        onChange={e => setFuncionario({ ...funcionario, matricula: e.target.value })}
                    />
                </div>

                <div className='campoGrupo'>
                    <h3>Data de Admissão</h3>
                    <Campo type="date"
                        value={funcionario.data}
                        onChange={e => setFuncionario({ ...funcionario, data: e.target.value })}
                    />
                </div>

                <div className='botoesCadastro'>
                    <Botao
                        tipo='primario'
                        icone={<FaCheck />}
                        aoClicar={cadastrar}
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