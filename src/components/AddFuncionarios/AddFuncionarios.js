import React, { useState, useEffect } from 'react';
import Campo from '../Campo/Campo';
import './AddFuncionarios.css';
import Botao from '../Botao/Botao';
import { ValidacaoUtils } from '../../utils/Formatar';
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import ToastUtils from '../../utils/ToastUtils';

const AddFuncionarios = () => {

    const [funcionario, setFuncionario] = useState({


        nome: "",
        cpf: "",
        pis: "",
        matricula: "",
        data: "",
        ativo: true
    });

    useEffect(() => {
        const editando = localStorage.getItem('funcionarioEditando');
        if (editando) {
            setFuncionario(JSON.parse(editando));
        }
    }, []);

    const [erros, setErros] = useState({
        nome: '',
        cpf: '',
        pis: '',
        matricula: '',
        data: ''
    });

    const navigate = useNavigate();

    function salvarFuncionario() {
        const funcionariosSalvos = localStorage.getItem("funcionario");
        const funcionarios = funcionariosSalvos ? JSON.parse(funcionariosSalvos) : [];
        const editando = localStorage.getItem('funcionarioEditando');
        let novaLista = funcionarios;
        if (editando) {
            const editado = JSON.parse(editando);

            novaLista = funcionarios.filter(f =>
                !(f.cpf === editado.cpf && f.pis === editado.pis && f.matricula === editado.matricula)
            );
            localStorage.removeItem('funcionarioEditando');
        }
        novaLista.push(funcionario);
        localStorage.setItem("funcionario", JSON.stringify(novaLista));
    }

    function cadastrar() {
        if (validarCamposVazios()) return;

        if (funcionario.cpf.trim() && !validarCpf(funcionario.cpf)) {
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

        if (verificarJaCadastrado(funcionario)) return;

        setErros({ nome: '', cpf: '', pis: '', matricula: '', data: '' });
        salvarFuncionario();
        ToastUtils.success("Funcionário cadastrado com sucesso!");
        navigate("/funcionarios")
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

    function verificarJaCadastrado(funcionario) {
        const cpfNumeros = funcionario.cpf.replace(/\D/g, '');
        const pis = funcionario.pis;
        const matricula = funcionario.matricula;

        const funcionariosSalvos = localStorage.getItem("funcionario");
        const funcionarios = funcionariosSalvos ? JSON.parse(funcionariosSalvos) : [];

        const editando = localStorage.getItem('funcionarioEditando');
        let idEditando = null;
        if (editando) {
            const editado = JSON.parse(editando);
            idEditando = {
                cpf: editado.cpf,
                pis: editado.pis,
                matricula: editado.matricula
            };
        }

        let erroCpf = '', erroPis = '', erroMatricula = '';

        for (let f of funcionarios) {
            if (idEditando && (
                f.cpf === idEditando.cpf &&
                f.pis === idEditando.pis &&
                f.matricula === idEditando.matricula
            )) {
                continue;
            }
            const fCpf = f.cpf.replace(/\D/g, '');
            if (fCpf === cpfNumeros) erroCpf = 'CPF já cadastrado';
            if (pis && f.pis === pis) erroPis = 'PIS já cadastrado';
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

    function validarCamposVazios() {
        const novosErros = {};
        const cpfPreenchido = !!funcionario.cpf.trim();
        const pisPreenchido = !!funcionario.pis.trim();

        if (!funcionario.nome.trim()) novosErros.nome = 'Campo obrigatório';

        if (!cpfPreenchido && !pisPreenchido) {
            novosErros.cpf = "Informe CPF ou PIS";
            novosErros.pis = "Informe CPF ou PIS";
        }

        if (!funcionario.matricula.trim()) novosErros.matricula = 'Campo obrigatório';
        if (!funcionario.data.trim()) novosErros.data = 'Campo obrigatório';

        setErros(prev => ({ ...prev, ...novosErros }));

        return Object.keys(novosErros).length > 0;
    }

    return (
        <>
            <h3 className="titulo">Cadastro de Funcionários</h3>
            <div className="tela-centralizada">
                <div className="cadastro-container">
                    <div className="formulario-funcionario">
                        <div className="campoGrupo">
                            <Campo
                                placeholder={"Nome"}
                                value={funcionario.nome}
                                onChange={e => setFuncionario({ ...funcionario, nome: e.target.value })}
                                className={`campo-nome${erros.nome ? ' campo-erro' : ''}`}
                            >
                                Nome do Funcionário
                            </Campo>
                            {erros.nome && <p style={{ color: 'red' }}>{erros.nome}</p>}
                        </div>
                        <div className="linhaCampos">
                            <div className='campoGrupo'>
                                <Campo
                                    placeholder={"000.000.000-00"}
                                    tamanhoMaximo={14}
                                    value={funcionario.cpf}
                                    onChange={e => {
                                        const valor = e.target.value;
                                        const formatado = ValidacaoUtils.formatarCpf(valor);
                                        setFuncionario({ ...funcionario, cpf: formatado });
                                    }}
                                    className={erros.cpf ? 'campo-erro' : ''}
                                >
                                    CPF
                                </Campo>
                                {erros.cpf && <p style={{ color: 'red' }}>{erros.cpf}</p>}
                            </div>
                            <h4>OU</h4>
                            <div className='campoGrupo'>
                                <Campo
                                    placeholder={"000.00000.00-0"}
                                    tamanhoMaximo={14}
                                    value={funcionario.pis}
                                    onChange={e => {
                                        const valor = e.target.value;
                                        const formatado = ValidacaoUtils.formatarPis(valor);
                                        setFuncionario({ ...funcionario, pis: formatado });
                                    }}
                                    className={erros.pis ? 'campo-erro' : ''}
                                >
                                    PIS
                                </Campo>
                                {erros.pis && <p style={{ color: 'red' }}>{erros.pis}</p>}
                            </div>
                        </div>
                        <div className="linha-campos-espacada">
                            <div className='campoGrupo'>
                                <Campo
                                    value={funcionario.matricula}
                                    tamanhoMaximo={8}
                                    onChange={e => setFuncionario({ ...funcionario, matricula: e.target.value })}
                                    className={erros.matricula ? 'campo-erro' : ''}
                                >
                                    Matrícula
                                </Campo>
                                {erros.matricula && <p style={{ color: 'red' }}>{erros.matricula}</p>}
                            </div>
                            <div className='campoGrupo'>
                                <Campo
                                    type="date"
                                    value={funcionario.data}
                                    onChange={e => setFuncionario({ ...funcionario, data: e.target.value })}
                                    className={erros.data ? 'campo-erro' : ''}
                                >
                                    Data de Admissão
                                </Campo>
                                {erros.data && <p style={{ color: 'red' }}>{erros.data}</p>}
                            </div>
                        </div>
                        <div className='campoGrupo' style={{ marginBottom: 16 }}>
                            <span className="switch-label" style={{ marginBottom: 6 }}>Situação Cadastro</span>
                            <div
                                className={`switch-bar${funcionario.ativo ? '' : ' inativo'}`}
                                onClick={() => setFuncionario({ ...funcionario, ativo: !funcionario.ativo })}
                                title={funcionario.ativo ? 'Ativo' : 'Inativo'}
                            >
                                <div
                                    className={`switch-ball${funcionario.ativo ? '' : ' inativo'}`}
                                />
                            </div>
                            <span>

                            </span>
                        </div>
                        <div className='botoesCadastro'>
                            <Botao
                                tipo='secundario'
                                icone={<IoMdClose />}
                                aoClicar={() => navigate("/funcionarios")}
                                customClass='botao-cancelar'
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                tipo='primario'
                                icone={<FaCheck />}
                                aoClicar={cadastrar}
                                customClass='botao-salvar'
                            >
                                Salvar
                            </Botao>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default AddFuncionarios;
