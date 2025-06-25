import "./CampoBusca.css";

const CampoBusca = ({
    children,
    className = "campo-busca",
}
) => {
    return ( 
        <div className={className}>
            {children}
        </div>
     );
}
 
export default CampoBusca;
