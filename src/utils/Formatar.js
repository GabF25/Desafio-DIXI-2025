export class ValidacaoUtils {
    static formatarCpf(valor) {
        const numeros = valor.replace(/\D/g, '');
        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    static formatarPis(valor) {
        const numeros = valor.replace(/\D/g, '');
        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{5})(\d)/, '$1.$2')
            .replace(/(\d{2})(\d)$/, '$1-$2');
    }
}