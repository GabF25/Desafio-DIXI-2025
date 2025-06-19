import "./Botao.css";

const Botao = ({
    children,
    icone,
    aoClicar,
}) => {
    return ( 
        <button className="btn"
            onClick={aoClicar}
        >
            {icone && <span className="btn-icon">{icone}</span>}
            {children}
        </button>
     );
}
 
export default Botao;