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
    });

    const [erros, setErros] = useState({
        nome: '',
        cpf: '',
        pis: '',
        matricula: '',
        data: ''
    });

    const navigate = useNavigate();

    function salvarFuncionario() {
        const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];
        funcionarios.push(funcionario);
        localStorage.setItem("funcionario", JSON.stringify(funcionarios));
        console.log("Funcionário Cadastrado");
    }

    function cadastrar() {
        if (camposVazios()) {
            return; // Interrompe se algum campo obrigatório estiver vazio
        }

        if (!validarCpf(funcionario.cpf)) {
            setErros(prev => ({ ...prev, cpf: 'CPF inválido' }));
            return;
        }

        if (funcionario.pis.trim() && !validarPis(funcionario.pis)) {
            setErros(prev => ({ ...prev, pis: 'PIS inválido' }));
            return;
        }

        if (!validarData(funcionario.data)) {
            setErros(prev => ({ ...prev, data: 'Data inválida' }));
            return;
        }

        if (funcionarioCadastrado(funcionario)) {
            return;
        } else {
            setErros({ nome: '', cpf: '', pis: '', matricula: '', data: '' });
            salvarFuncionario();
            setFuncionario({ nome: "", cpf: "", pis: "", matricula: "", data: "" });
        }
    }

    function validarPis(pis) {
        if (!pis) return false;

        const pisNumeros = pis.replace(/\D/g, '');
        if (pisNumeros.length !== 11) return false;

        const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += parseInt(pisNumeros[i], 10) * pesos[i];
        }

        const resto = soma % 11;
        let digitoVerificador = 0;

        if (resto !== 0 && resto !== 1) {
            digitoVerificador = 11 - resto;
        }

        return digitoVerificador === parseInt(pisNumeros[10], 10);
    }

    function validarCpf(cpf) {
        if (!cpf) return false;
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
        let digito1 = (soma * 10) % 11;
        if (digito1 === 10 || digito1 === 11) digito1 = 0;
        if (digito1 !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
        let digito2 = (soma * 10) % 11;
        if (digito2 === 10 || digito2 === 11) digito2 = 0;
        if (digito2 !== parseInt(cpf[10])) return false;

        return true;
    }

    function funcionarioCadastrado(funcionario) {
        const cpfNumeros = funcionario.cpf.replace(/\D/g, '');
        const pis = funcionario.pis;
        const matricula = funcionario.matricula;

        const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];

        let erroCpf = '', erroPis = '', erroMatricula = '';

        for (let f of funcionarios) {
            const fCpf = f.cpf.replace(/\D/g, '');
            if (fCpf === cpfNumeros) erroCpf = 'CPF já cadastrado';
            if (f.pis === pis) erroPis = 'PIS já cadastrado';
            if (f.matricula === matricula) erroMatricula = 'Matrícula já cadastrada';
        }

        const hasError = erroCpf || erroPis || erroMatricula;
        if (hasError) {
            setErros({ cpf: erroCpf, pis: erroPis, matricula: erroMatricula });
            return true;
        }

        return false;
    }

    function validarData(dataStr) {
        const hoje = new Date();
        const dataInput = new Date(dataStr);

        return dataInput <= hoje;
    }

    function camposVazios() {
        const novosErros = {};
        const cpfVazio = !funcionario.cpf.trim();
        const pisVazio = !funcionario.pis.trim();

        if (!funcionario.nome.trim()) novosErros.nome = 'Campo obrigatório';

        if (cpfVazio && pisVazio) {
            novosErros.cpf = "Informe CPF ou PIS";
            novosErros.pis = "Informe CPF ou PIS";
        }

        if (!funcionario.matricula.trim()) novosErros.matricula = 'Campo obrigatório';
        if (!funcionario.data.trim()) novosErros.data = 'Campo obrigatório';

        setErros(prev => ({ ...prev, ...novosErros }));

        // Retorna true se houver erros
        return Object.keys(novosErros).length > 0;
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
                        className={erros.nome ? 'campo-erro' : ''}
                    />
                    {erros.nome && <p style={{ color: 'red' }}>{erros.nome}</p>}
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
                                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

                            setFuncionario({ ...funcionario, cpf: formatado });
                        }}
                        className={erros.cpf ? 'campo-erro' : ''}
                    />
                    {erros.cpf && <p style={{ color: 'red' }}>{erros.cpf}</p>}
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
                        className={erros.pis ? 'campo-erro' : ''}
                    />
                    {erros.pis && <p style={{ color: 'red' }}>{erros.pis}</p>}
                </div>

                <div className='campoGrupo'>
                    <h3>Matrícula</h3>
                    <Campo
                        value={funcionario.matricula}
                        tamanhoMaximo={8}
                        onChange={e => setFuncionario({ ...funcionario, matricula: e.target.value })}
                        className={erros.matricula ? 'campo-erro' : ''}
                    />
                    {erros.matricula && <p style={{ color: 'red' }}>{erros.matricula}</p>}
                </div>

                <div className='campoGrupo'>
                    <h3>Data de Admissão</h3>
                    <Campo
                        type="date"
                        value={funcionario.data}
                        onChange={e => setFuncionario({ ...funcionario, data: e.target.value })}
                        className={erros.data ? 'campo-erro' : ''}
                    />
                    {erros.data && <p style={{ color: 'red' }}>{erros.data}</p>}
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
                        aoClicar={() => navigate("/funcionarios")}
                    >
                        Cancelar
                    </Botao>
                </div>
            </div>
        </>
    );
}

export default AddFuncionarios;
