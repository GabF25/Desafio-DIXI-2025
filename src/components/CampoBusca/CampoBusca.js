import Campo from "../Campo/Campo";
import "./CampoBusca.css";
import { ValidacaoUtils } from "../../utils/Formatar";

const CampoBusca = ({
    value,
    onChange,
    className = "campo-busca",
}
) => {
    return ( 
        <div className={className}>
           <div className="opcoes-busca">
            <Campo 
              label={"Nome"}
              value={value.nome}
              onChange={e => onChange({ ...value, nome: e.target.value })}
            />
           </div>

           <div className="opcoes-busca">
            <Campo
              label={"CPF"}
              tamanhoMaximo={14}
              placeholder="000.000.000-00"
              value={ValidacaoUtils.formatarCpf(value.cpf)}
              onChange={e => onChange({ ...value, cpf: e.target.value })}
            />
           </div>

           <div className="opcoes-busca">
            <Campo 
              label={"PIS"}
              tamanhoMaximo={14}
              placeholder="000.00000.00-0"
              value={ValidacaoUtils.formatarPis(value.pis)}
              onChange={e => onChange({ ...value, pis: e.target.value })}
            />
           </div>

           <div className="opcoes-busca">
            <Campo 
              label={"Matrícula"}
              tamanhoMaximo={8}
              value={value.matricula}
              onChange={e => onChange({ ...value, matricula: e.target.value })}
            />
           </div>

           <div className="opcoes-busca">
            <Campo 
              label={"Data de Admissão"}
              type="date"
              value={value.data}
              onChange={e => onChange({ ...value, data: e.target.value })}
            />
           </div>
        </div>
     );
}
 
export default CampoBusca;
