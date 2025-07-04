import Botao from "../Botao/Botao";
import { MdOutlineFileUpload } from "react-icons/md";
import React, { useState } from 'react';
import AfdUtils from '../../utils/AfdUtils';

const ImportacaoAFD = () => {
    const [fileContent, setFileContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [parsedRows, setParsedRows] = useState([]);
    const [parseErrors, setParseErrors] = useState([]);
    const [listaFuncionarios, setListaFuncionarios] = useState([]);
    const [rejeitadas, setRejeitadas] = useState([]);
    const [pagina, setPagina] = useState(1);
    const porPagina = 10;

    // Função para tratar mudança do input de arquivo
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setFileContent("");
            setParsedRows([]);
            setParseErrors([]);
            console.log("Arquivo selecionado:", e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleImport = (e) => {
        // Busca funcionarios no localStorage
        const funcionarios = JSON.parse(localStorage.getItem("funcionario")) || [];

        e.preventDefault && e.preventDefault();

        if (!selectedFile) {
            console.log("Nenhum arquivo selecionado");
            return;
        }

        console.log("Importando arquivo:", selectedFile);
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

        // Nova lógica: rejeita duplicadas e também registros sem funcionário
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
            const docNormalizado = AfdUtils.normalizaPis(doc);
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
        console.log("Marcações apropriadas:", unicas);
        if (errors.length) console.warn("Linhas com erro:", errors);
        };

        reader.onerror = (err) => {
            console.error("Erro ao ler arquivo:", err);
        };

        reader.readAsText(selectedFile);
    };

    return (
        <div>
            <h1>Importação AFD</h1>
            <div>
                <input
                    type="file"
                    onChange={handleFileChange}
                    key={selectedFile ? selectedFile.name : ''}
                />
                <Botao
                    icone={<MdOutlineFileUpload />}
                    aoClicar={handleImport}
                    disabled={!selectedFile}
                >
                    Importar
                </Botao>
            </div>

            {/* Resumo de quantidades */}
            {(parsedRows.length > 0 || rejeitadas.length > 0) && (
                <div style={{ marginTop: 24, marginBottom: 16, fontWeight: 'bold' }}>
                    <span style={{ color: 'green' }}>Apropriadas: {parsedRows.length}</span>
                    <span style={{ marginLeft: 24, color: 'red' }}>Rejeitadas: {rejeitadas.length}</span>
                </div>
            )}

            {/* Exibe marcações rejeitadas e motivos com paginação */}
            {rejeitadas.length > 0 && (
                <div style={{ marginTop: 20, color: 'red' }}>
                    <h3>Marcações rejeitadas:</h3>
                    <ul>
                        {rejeitadas.slice((pagina-1)*porPagina, pagina*porPagina).map((rej, i) => (
                            <li key={i}>
                                {rej.motivo} [{rej.marcacao.documento || rej.marcacao.pisOuCpf} - {rej.marcacao.data} {rej.marcacao.horas || rej.marcacao.hora}]
                            </li>
                        ))}
                    </ul>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                        <button onClick={() => setPagina(p => Math.max(1, p-1))} disabled={pagina === 1}>Anterior</button>
                        <span>Página {pagina} de {Math.ceil(rejeitadas.length/porPagina)}</span>
                        <button onClick={() => setPagina(p => Math.min(Math.ceil(rejeitadas.length/porPagina), p+1))} disabled={pagina === Math.ceil(rejeitadas.length/porPagina)}>Próxima</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImportacaoAFD;
