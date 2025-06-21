import Menu from "../Menu/Menu";
import './Tela.css'; 

const Tela = ({ 
    children 
}) => {
    return ( 
        <div className="tela">
           <Menu/>
            <div className="conteudo">
                {children}
            </div>

        </div>
    );
}

export default Tela;
