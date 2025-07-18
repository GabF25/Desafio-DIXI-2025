import './Menu.css';
import { IoPersonSharp } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import{Link, useNavigate} from 'react-router-dom';
import LogoMenu from '../../assets/logomenu.png';

const Menu = () => {

    return ( 
        <div className="menu"> 

        <img src={LogoMenu} alt="Logo Dixi" className='logo-menu' />

           <div className='botoes'> 
                <ItemMenu
                    icone ={<IoPersonSharp />}
                    nome="Funcionários" 
                    rota="/funcionarios"
                />
              
                
                <ItemMenu
                    icone ={<MdDescription/>}
                    nome="Espelho Ponto" 
                    rota="/espelho-ponto"  
                />

                <ItemMenu
                    icone ={<MdOutlineSystemUpdateAlt />}
                    nome="Importação AFD"
                    rota="/importacao-afd"
                />

           </div>

        </div>
     );
}
 
const ItemMenu = ({
    nome,
    icone,
    rota,
}) => {
    const navigate = useNavigate();

    return (
        <div className='menu-wrapper'>
            <div 
            className="menu-item"
            onClick={() => navigate(rota)}
        >
            <span className="menu-item-icone">{icone}</span>
            <span className="menu-item-nome">{nome}</span>
        </div>
        </div>
    );
}

export default Menu;