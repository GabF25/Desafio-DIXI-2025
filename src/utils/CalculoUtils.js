export class CalculoUtils {
    static calcularHorasExtrasSimples(marcacoes, horarioPadrao) {
        if (!marcacoes || marcacoes.length < 2 || !horarioPadrao || !horarioPadrao.entrada || !horarioPadrao.fimExpediente) return "00:00";

        const totalTrabalhado = this.calcularHorasTrabalhadas(marcacoes);
        const [hTrab, mTrab] = totalTrabalhado.split(':').map(Number);
        const minutosTrabalhados = hTrab * 60 + mTrab;

        const [hEntrada, mEntrada] = horarioPadrao.entrada.split(':').map(Number);
        const [hSaida, mSaida] = horarioPadrao.fimExpediente.split(':').map(Number);
        let entradaMin = hEntrada * 60 + mEntrada;
        let saidaMin = hSaida * 60 + mSaida;
        if (saidaMin <= entradaMin) saidaMin += 24 * 60;
        let minutosJornada = saidaMin - entradaMin;

        if (horarioPadrao.inicioIntervalo && horarioPadrao.fimIntervalo) {
            let ini = horarioPadrao.inicioIntervalo.split(":").map(Number);
            let fim = horarioPadrao.fimIntervalo.split(":").map(Number);
            let iniMin = ini[0] * 60 + ini[1];
            let fimMin = fim[0] * 60 + fim[1];
            if (fimMin <= iniMin) fimMin += 24 * 60;
            minutosJornada -= (fimMin - iniMin);
        }
        if (horarioPadrao.inicioIntervalo2 && horarioPadrao.fimIntervalo2) {
            let ini2 = horarioPadrao.inicioIntervalo2.split(":").map(Number);
            let fim2 = horarioPadrao.fimIntervalo2.split(":").map(Number);
            let iniMin2 = ini2[0] * 60 + ini2[1];
            let fimMin2 = fim2[0] * 60 + fim2[1];
            if (fimMin2 <= iniMin2) fimMin2 += 24 * 60;
            minutosJornada -= (fimMin2 - iniMin2);
        }

        let minutosEntradaAntecipada = 0;

        const ordenados = this.ordenarMarcacoesExpediente(marcacoes);
        if (ordenados.length > 0) {
            const [h1, m1] = ordenados[0].split(":").map(Number);
            const entradaRealMin = h1 * 60 + m1;
            if (entradaRealMin < entradaMin) {
                minutosEntradaAntecipada = entradaMin - entradaRealMin;
            }
        }

        const minutosExtras = Math.max(0, minutosTrabalhados - minutosJornada) + minutosEntradaAntecipada;
        const horasExtrasFormatadas = Math.floor(minutosExtras / 60).toString().padStart(2, '0');
        const minutosExtrasFormatados = (minutosExtras % 60).toString().padStart(2, '0');
        return `${horasExtrasFormatadas}:${minutosExtrasFormatados}`;
    }
    static ordenarMarcacoesExpediente(marcacoes, diaSemana) {
        return marcacoes.slice().sort((a, b) => {
            const toMinutes = hstr => {
                const [h, m] = hstr.split(":").map(Number);
                if (diaSemana === 4 && h < 4) {
                    return (h + 24) * 60 + m;
                }
                return h * 60 + m;
            };
            return toMinutes(a) - toMinutes(b);
        });
    }

    static calcularHorasTrabalhadas(marcacoes, diaSemana) {
        if (!marcacoes || marcacoes.length < 2) return "";
        const ordenados = this.ordenarMarcacoesExpediente(marcacoes, diaSemana);
        let totalMinutos = 0;
        for (let i = 0; i < ordenados.length - 1; i += 2) {
            const [h1, m1] = ordenados[i].split(':').map(Number);
            const [h2, m2] = ordenados[i + 1].split(':').map(Number);
            let entrada = h1 * 60 + m1;
            let saida = h2 * 60 + m2;
            if (saida <= entrada) saida += 24 * 60;
            totalMinutos += Math.max(0, saida - entrada);
        }
        if (totalMinutos === 0) return "";
        const horas = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
        const minutos = (totalMinutos % 60).toString().padStart(2, '0');
        return `${horas}:${minutos}`;
    }

    static calcularHorasExtras(marcacoes, horarioPadrao) {
        if (!marcacoes || marcacoes.length < 2) return "00:00";

        if (!horarioPadrao || horarioPadrao.entrada == null || horarioPadrao.fimExpediente == null) {
            return this.calcularHorasTrabalhadas(marcacoes);
        }

        const totalTrabalhado = this.calcularHorasTrabalhadas(marcacoes);
        const [hTrab, mTrab] = totalTrabalhado.split(':').map(Number);
        const minutosTrabalhados = hTrab * 60 + mTrab;

        const [hEntrada, mEntrada] = horarioPadrao.entrada.split(':').map(Number);
        const [hSaida, mSaida] = horarioPadrao.fimExpediente.split(':').map(Number);
        let minutosJornada = (hSaida * 60 + mSaida) - (hEntrada * 60 + mEntrada);

        if (horarioPadrao.inicioIntervalo && horarioPadrao.fimIntervalo) {
            const [hIni, mIni] = horarioPadrao.inicioIntervalo.split(":").map(Number);
            const [hFim, mFim] = horarioPadrao.fimIntervalo.split(":").map(Number);
            minutosJornada -= (hFim * 60 + mFim) - (hIni * 60 + mIni);
        }
        if (horarioPadrao.inicioIntervalo2 && horarioPadrao.fimIntervalo2) {
            const [hIni2, mIni2] = horarioPadrao.inicioIntervalo2.split(":").map(Number);
            const [hFim2, mFim2] = horarioPadrao.fimIntervalo2.split(":").map(Number);
            minutosJornada -= (hFim2 * 60 + mFim2) - (hIni2 * 60 + mIni2);
        }

        const minutosExtras = Math.max(0, minutosTrabalhados - minutosJornada);
        const horasExtrasFormatadas = Math.floor(minutosExtras / 60).toString().padStart(2, '0');
        const minutosExtrasFormatados = (minutosExtras % 60).toString().padStart(2, '0');
        return `${horasExtrasFormatadas}:${minutosExtrasFormatados}`;
    }

    static calcularHorasFaltas(marcacoes, horarioPadrao) {
        if (!horarioPadrao || horarioPadrao.entrada == null || horarioPadrao.fimExpediente == null) {
            return "00:00";
        }

        const [hEntrada, mEntrada] = horarioPadrao.entrada.split(':').map(Number);
        const [hSaida, mSaida] = horarioPadrao.fimExpediente.split(':').map(Number);
        let entradaMin = hEntrada * 60 + mEntrada;
        let saidaMin = hSaida * 60 + mSaida;
        if (saidaMin <= entradaMin) saidaMin += 24 * 60;
        let minutosJornada = saidaMin - entradaMin;

        if (horarioPadrao.inicioIntervalo && horarioPadrao.fimIntervalo) {
            let ini = horarioPadrao.inicioIntervalo.split(":").map(Number);
            let fim = horarioPadrao.fimIntervalo.split(":").map(Number);
            let iniMin = ini[0] * 60 + ini[1];
            let fimMin = fim[0] * 60 + fim[1];
            if (fimMin <= iniMin) fimMin += 24 * 60;
            minutosJornada -= (fimMin - iniMin);
        }
        if (horarioPadrao.inicioIntervalo2 && horarioPadrao.fimIntervalo2) {
            let ini2 = horarioPadrao.inicioIntervalo2.split(":").map(Number);
            let fim2 = horarioPadrao.fimIntervalo2.split(":").map(Number);
            let iniMin2 = ini2[0] * 60 + ini2[1];
            let fimMin2 = fim2[0] * 60 + fim2[1];
            if (fimMin2 <= iniMin2) fimMin2 += 24 * 60;
            minutosJornada -= (fimMin2 - iniMin2);
        }

        if (!marcacoes || marcacoes.length < 2) {
            const horasFaltas = Math.floor(minutosJornada / 60).toString().padStart(2, '0');
            const minutosFaltas = (minutosJornada % 60).toString().padStart(2, '0');
            return `${horasFaltas}:${minutosFaltas}`;
        }

        const totalTrabalhado = this.calcularHorasTrabalhadas(marcacoes, horarioPadrao);
        const [hTrab, mTrab] = totalTrabalhado.split(':').map(Number);
        const minutosTrabalhados = hTrab * 60 + mTrab;

        const minutosFaltas = Math.max(0, minutosJornada - minutosTrabalhados);
        const horasFaltasFormatadas = Math.floor(minutosFaltas / 60).toString().padStart(2, '0');
        const minutosFaltasFormatados = (minutosFaltas % 60).toString().padStart(2, '0');
        return `${horasFaltasFormatadas}:${minutosFaltasFormatados}`;
    }

    static calcularHorasAtrasos(marcacoes, horarioPadrao) {
        if (!marcacoes || marcacoes.length < 2 || !horarioPadrao || horarioPadrao.entrada == null || horarioPadrao.fimExpediente == null) {
            return "00:00";
        }

        const [hEntrada, mEntrada] = horarioPadrao.entrada.split(':').map(Number);
        const [hSaida, mSaida] = horarioPadrao.fimExpediente.split(':').map(Number);
        let minutosJornada = (hSaida * 60 + mSaida) - (hEntrada * 60 + mEntrada);

        let minutosIntervaloPadrao = 0;
        if (horarioPadrao.inicioIntervalo && horarioPadrao.fimIntervalo) {
            const [hIni, mIni] = horarioPadrao.inicioIntervalo.split(":").map(Number);
            const [hFim, mFim] = horarioPadrao.fimIntervalo.split(":").map(Number);
            minutosIntervaloPadrao += (hFim * 60 + mFim) - (hIni * 60 + mIni);
        }
        if (horarioPadrao.inicioIntervalo2 && horarioPadrao.fimIntervalo2) {
            const [hIni2, mIni2] = horarioPadrao.inicioIntervalo2.split(":").map(Number);
            const [hFim2, mFim2] = horarioPadrao.fimIntervalo2.split(":").map(Number);
            minutosIntervaloPadrao += (hFim2 * 60 + mFim2) - (hIni2 * 60 + mIni2);
        }

        const totalTrabalhado = this.calcularHorasTrabalhadas(marcacoes);
        const [hTrab, mTrab] = totalTrabalhado.split(':').map(Number);
        const minutosTrabalhados = hTrab * 60 + mTrab;

        let minutosIntervaloFeito = 0;
        const ordenados = this.ordenarMarcacoesExpediente(marcacoes);
        for (let i = 1; i < ordenados.length - 1; i += 2) {
            const [h1, m1] = ordenados[i].split(':').map(Number);
            const [h2, m2] = ordenados[i + 1].split(':').map(Number);
            minutosIntervaloFeito += (h2 * 60 + m2) - (h1 * 60 + m1);
        }

        const excessoIntervalo = Math.max(0, minutosIntervaloFeito - minutosIntervaloPadrao);

        const atrasoPorFalta = Math.max(0, (minutosJornada - minutosIntervaloPadrao) - minutosTrabalhados);

        const minutosAtraso = excessoIntervalo + atrasoPorFalta;
        const horasAtrasoFormatadas = Math.floor(minutosAtraso / 60).toString().padStart(2, '0');
        const minutosAtrasoFormatados = (minutosAtraso % 60).toString().padStart(2, '0');
        return `${horasAtrasoFormatadas}:${minutosAtrasoFormatados}`;
    }

    static calcularAdicionalNoturno(marcacoes) {
        if (!marcacoes || marcacoes.length < 2) return "00:00:00";
        const NOTURNO_INICIO = 22 * 60; 
        const NOTURNO_FIM = 5 * 60;    
        let minutosNoturnos = 0;
        const ordenados = this.ordenarMarcacoesExpediente(marcacoes);
        for (let i = 0; i < ordenados.length - 1; i += 2) {
            const [h1, m1] = ordenados[i].split(':').map(Number);
            const [h2, m2] = ordenados[i + 1].split(':').map(Number);
            let entrada = h1 * 60 + m1;
            let saida = h2 * 60 + m2;

            if (saida <= entrada) saida += 24 * 60;
            for (let t = entrada; t < saida; t++) {
                let horaDoDia = t % (24 * 60);
                if (horaDoDia >= NOTURNO_INICIO || horaDoDia < NOTURNO_FIM) {
                    minutosNoturnos++;
                }
            }
        }

        const minutosAdicional = Math.floor(minutosNoturnos * (52.5 / 60));
        const segundosAdicional = Math.round((minutosNoturnos * (52.5 / 60) - minutosAdicional) * 60);
        const horas = Math.floor(minutosAdicional / 60).toString().padStart(2, '0');
        const minutos = (minutosAdicional % 60).toString().padStart(2, '0');
        const segundos = segundosAdicional.toString().padStart(2, '0');
        return `${horas}:${minutos}:${segundos}`;
    }
}