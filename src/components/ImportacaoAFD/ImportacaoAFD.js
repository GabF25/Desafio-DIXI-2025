import Botao from "../Botao/Botao";
import { MdOutlineFileUpload } from "react-icons/md";
import React, { useState } from 'react';
import AfdUtils from '../../utils/AfdUtils';
import './ImportacaoAFD.css';
import { IoMdOpen } from "react-icons/io";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";


const ImportacaoAFD = () => {
    function formatarData(data) {
        if (!data) return '';
        const partes = data.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return data;
    }
    const [fileContent, setFileContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [parsedRows, setParsedRows] = useState([]);
    const [parseErrors, setParseErrors] = useState([]);
    const [listaFuncionarios, setListaFuncionarios] = useState([]);
    const [rejeitadas, setRejeitadas] = useState([]);
    const [pagina, setPagina] = useState(1);
    const porPagina = 10;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const nomeMinusculo = file.name.toLowerCase();
            const tipo = file.type;
            if (!nomeMinusculo.endsWith('.afd') && tipo !== 'text/plain') {
                alert('Arquivo inválido.');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setFileContent("");
            setParsedRows([]);
            setParseErrors([]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleImport = (e) => {
        const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];

        e.preventDefault && e.preventDefault();

        if (!selectedFile) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            setFileContent(text);

            const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
            const parsed = [];
            const errors = [];

            lines.forEach((line, idx) => {
                let parsedObj = AfdUtils.parseLinha1510(line);
                if (parsedObj) {
                    parsed.push({ linha: idx + 1, ...parsedObj });
                    return;
                }
                parsedObj = AfdUtils.parseLinha671(line);
                if (parsedObj) {
                    parsed.push({ linha: idx + 1, ...parsedObj });
                    return;
                }
                errors.push({ linha: idx + 1, conteudo: line });
            });

            const rejeitadas = [];
            const unicas = [];
            parsed.forEach(marcacao => {
                let doc = marcacao.documento;
                let tipoDoc = marcacao.tipoDocumento;
                if (marcacao.tipo === '671') {
                    doc = marcacao.pisOuCpf;
                    tipoDoc = (doc.length === 11 && (doc.startsWith('9') || doc.startsWith('0'))) ? 'CPF' : 'PIS';
                }
                if (!doc) {
                    rejeitadas.push({ marcacao, motivo: 'Registro sem PIS/CPF.' });
                    return;
                }
                let docNormalizado;
                if (tipoDoc === 'CPF' && doc.length === 12 && doc.startsWith('9')) {
                    docNormalizado = AfdUtils.normalizaPis(doc.slice(1));
                } else {
                    docNormalizado = AfdUtils.normalizaPis(doc);
                }
                let funcionario = null;
                if (tipoDoc === 'CPF') {
                    funcionario = funcionarios.find(f => f.cpf && AfdUtils.normalizaPis(f.cpf) === docNormalizado);
                } else {
                    funcionario = funcionarios.find(f => f.pis && AfdUtils.normalizaPis(f.pis) === docNormalizado);
                }
                if (!funcionario) {
                    rejeitadas.push({ marcacao, motivo: 'PIS ou CPF não cadastrado para colaborador.' });
                    return;
                }
                if (!funcionario.marcacoes) funcionario.marcacoes = [];
                const existe = funcionario.marcacoes.some(m =>
                    m.data === marcacao.data &&
                    (m.horas || m.hora) === (marcacao.horas || marcacao.hora)
                );
                if (existe) {
                    rejeitadas.push({ marcacao, motivo: 'Já existe marcação nesta data e hora para o colaborador.' });
                    return;
                }
                funcionario.marcacoes.push({
                    data: marcacao.data,
                    hora: marcacao.horas || marcacao.hora,
                    hash: marcacao.hash || '',
                    origem: marcacao.tipo || '',
                });
                unicas.push(marcacao);
            });
            setParsedRows(unicas);
            setRejeitadas(rejeitadas);
            setParseErrors(errors);
            setPagina(1);
            if (unicas.length > 0) {
                localStorage.setItem("funcionario", JSON.stringify(funcionarios));
            }
        };

        

        reader.readAsText(selectedFile);
    };

    return (
        <div className="tela-centralizada">
            <div className="importacao-afd">
                <h1 className="titulo-importacao">Importação AFD</h1>
                <div className="importacao-container">

                    <div className="menu-importacaoAFD">
                        <label className="selecao-de-arquivo">
                            <span>Clique para selecionar um arquivo</span>

                            <IoMdOpen className="icone-arquivo" />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <Botao
                            icone={<MdOutlineFileUpload />}
                            aoClicar={handleImport}
                            disabled={!selectedFile}
                        >
                            Importar
                        </Botao>
                    </div>

                    {(parsedRows.length > 0 || rejeitadas.length > 0) && (
                        <div className="resumo-quantidades">
                            <span className="quantidade-apropriadas">Nº Apropriados: <span className="valor-quantidade">{parsedRows.length}</span></span>
                            <span className="quantidade-rejeitadas">Nº Não Apropriados: <span className="valor-quantidade">{rejeitadas.length}</span></span>
                        </div>
                    )}

                    {rejeitadas.length > 0 && (
                        <div className="marcacoes-rejeitadas">
                            <h3 className="titulo-rejeitadas">Marcações não Importadas</h3>
                            <table className="tabela-rejeitadas">
                                <thead>
                                    <tr>
                                        <th className="coluna-marcacoes">Dados da marcação</th>
                                        <th className="coluna-marcacoes">Motivo do erro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rejeitadas.slice((pagina - 1) * porPagina, pagina * porPagina).map((rej, i) => (
                                        <tr key={i}>
                                            <td className="celula-dados">
                                                {formatarData(rej.marcacao.data)} {rej.marcacao.horas || rej.marcacao.hora}
                                            </td>
                                            <td className="celula-motivo">
                                                {rej.motivo}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="paginacao-rejeitadas">
                                <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}><GrFormPrevious /></button>
                                <span className="pagina-atual">{pagina}</span>
                                <button onClick={() => setPagina(p => Math.min(Math.ceil(rejeitadas.length / porPagina), p + 1))} disabled={pagina === Math.ceil(rejeitadas.length / porPagina)}><GrFormNext /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ImportacaoAFD;
