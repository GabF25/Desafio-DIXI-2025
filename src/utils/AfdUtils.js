class AfdUtils {
    
    
    /**
     * 
     * @param {Array} marcacoes 
     * @returns {{unicas: Array, rejeitadas: Array<{marcacao: Object, motivo: string}>}}
     */
    
    static filtraDuplicadas(marcacoes) {
        const set = new Set();
        const unicas = [];
        const rejeitadas = [];
        for (const m of marcacoes) {
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
    static normalizaPis(pis) {
        return (pis || "").replace(/[.\-\s]/g, "");
    }

    static parseLinha1510(line) {
        const l = line.replace(/ +/g, ' ').trim();
        let match = l.match(/^(\d{9})\s*(\d)\s*(\d{8})\s*(\d{4})\s*(\d{11,12})\s*([A-Za-z0-9]{4})/);
        if (match) {
            const [_, numeroAtividade, codigoEvento, dataRaw, horaRaw, pisCpf, hash] = match;
            if (codigoEvento !== '3') return null;
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
        match = l.match(/^3(\d{8})(\d{4})0{18}(\d{11,12})/);
        if (match) {
            const [_, dataRaw, horaRaw, pisCpf] = match;
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

    static parseLinha671(line) {
        const match = line.match(/^0*(\d{10})\s*(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})([+-]\d{2,4})\s*(.*)$/);
        if (match) {
            const [_, sequencia, data, horaCompleta, fuso, resto] = match;
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
