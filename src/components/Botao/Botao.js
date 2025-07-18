import "./Botao.css";

const Botao = ({
    children,
    icone,
    aoClicar,
    tipo = "primario",
    customClass = ""
}) => {
    return ( 
        <button className={`btn ${tipo} ${customClass}`}
            onClick={aoClicar}
        >
            {icone && <span className="btn-icon">{icone}</span>}
            {children}
        </button>
     );
}
 
export default Botao;