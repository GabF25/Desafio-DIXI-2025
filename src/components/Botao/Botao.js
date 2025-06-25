import "./Botao.css";

const Botao = ({
    children,
    icone,
    aoClicar,
    tipo = "primario"
}) => {
    return ( 
        <button className={`btn ${tipo}`}
            onClick={aoClicar}
        >
            {icone && <span className="btn-icon">{icone}</span>}
            {children}
        </button>
     );
}
 
export default Botao;