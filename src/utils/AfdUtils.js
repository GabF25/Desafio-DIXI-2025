class AfdUtils {
    /**
     * Filtra marcações duplicadas e retorna:
     * - marcações únicas
     * - array de rejeitadas com motivo
     * @param {Array} marcacoes Array de marcações {documento, data, horas, ...}
     * @returns {{unicas: Array, rejeitadas: Array<{marcacao: Object, motivo: string}>}}
     */
    static filtraDuplicadas(marcacoes) {
        const set = new Set();
        const unicas = [];
        const rejeitadas = [];
        for (const m of marcacoes) {
            // Chave única: documento + data + horas
            const chave = `${m.documento}-${m.data}-${m.horas}`;
            if (set.has(chave)) {
                rejeitadas.push({ marcacao: m, motivo: 'Marcação duplicada para este funcionário, data e hora.' });
            } else {
                set.add(chave);
                unicas.push(m);
            }
        }
        return { unicas, rejeitadas };
    }
    // Normaliza PIS/CPF removendo pontos, traços e zeros à esquerda
    static normalizaPis(pis) {
        return (pis || "").replace(/[.\-]/g, "").replace(/^0+/, "");
    }

    // Parser para linha padrão 1510 (dois formatos conhecidos)
    static parseLinha1510(line) {
        const l = line.replace(/ +/g, ' ').trim();
        // Formato 1: 1510 detalhado (com hash)
        let match = l.match(/^(\d{9})\s*(\d)\s*(\d{8})\s*(\d{4})\s*(\d{11,12})\s*([A-Za-z0-9]{4})/);
        if (match) {
            const [_, numeroAtividade, codigoEvento, dataRaw, horaRaw, pisCpf, hash] = match;
            if (codigoEvento !== '3') return null;
            // dataRaw: ddmmaaaa
            const data = `${dataRaw.slice(4, 8)}-${dataRaw.slice(2, 4)}-${dataRaw.slice(0, 2)}`;
            const horas = `${horaRaw.slice(0, 2)}:${horaRaw.slice(2, 4)}`;
            const tipoDocumento = pisCpf.startsWith('9') ? 'CPF' : 'PIS';
            return {
                tipo: '1510',
                numeroAtividade,
                codigoEvento,
                data,
                horas,
                documento: pisCpf,
                tipoDocumento,
                hash
            };
        }
        // Formato 2: 1510 simplificado (sem hash, registro tipo 3)
        match = l.match(/^3(\d{8})(\d{4})0{18}(\d{11,12})/);
        if (match) {
            const [_, dataRaw, horaRaw, pisCpf] = match;
            // dataRaw: aaaammdd
            const data = `${dataRaw.slice(0, 4)}-${dataRaw.slice(4, 6)}-${dataRaw.slice(6, 8)}`;
            const horas = `${horaRaw.slice(0, 2)}:${horaRaw.slice(2, 4)}`;
            const tipoDocumento = pisCpf.startsWith('9') ? 'CPF' : 'PIS';
            return {
                tipo: '1510',
                data,
                horas,
                documento: pisCpf,
                tipoDocumento
            };
        }
        return null;
    }

    // Parser para linha padrão 671
    static parseLinha671(line) {
        // Exemplo: 0000000001 2024-07-01T08:00:00-0300 12345678901 NOME
        // Regex tolerante a espaços e campos extras
        const match = line.match(/^0*(\d{10})\s*(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})([+-]\d{2,4})\s*(.*)$/);
        if (match) {
            const [_, sequencia, data, horaCompleta, fuso, resto] = match;
            // Busca PIS/CPF (11 ou 12 dígitos) no resto da linha
            const pisCpfMatch = resto.match(/(\d{11,12})\b/);
            let nome = '';
            if (pisCpfMatch) {
                const idx = resto.indexOf(pisCpfMatch[1]);
                nome = resto.slice(idx + pisCpfMatch[1].length).trim().split('  ')[0];
            }
            return {
                tipo: '671',
                sequencia,
                data,
                hora: horaCompleta.slice(0, 5),
                fuso,
                resto,
                pisOuCpf: pisCpfMatch ? pisCpfMatch[1] : '',
                nome: nome || ''
            };
        }
        return null;
    }
}

export default AfdUtils;
