import Campo from "../Campo/Campo";
import "./CampoBusca.css";

const CampoBusca = ({
    children,
    className = "campo-busca",
}
) => {
    return ( 
        <div className={className}>
           <div className="opcoes-busca">
            <Campo placeholder="Nome" />
            </div>

            <div className="opcoes-busca">
            <Campo
                tamanhoMaximo={11}
                placeholder="000.000.000-00"
            />
            </div>

            <div className="opcoes-busca">
            <Campo tamanhoMaximo={11}
                placeholder="000.00000.00-0"
            />
            </div>

            <div className="opcoes-busca">
            <Campo tamanhoMaximo={8} placeholder="Matrícula" />
            </div>

            <div className="opcoes-busca">
            <Campo type="date">00/00/0000</Campo>
            </div>
        </div>
     );
}
 
export default CampoBusca;
