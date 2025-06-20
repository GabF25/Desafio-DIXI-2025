import './Menu.css';
import { IoPersonSharp } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import{Link} from 'react-router-dom'; // Importando Link


const Menu = () => {
    return ( 
        <div className="menu"> 

           <div className='botoes'> 
                <ItemMenu
                    icone ={<IoPersonSharp />}
                    nome="Funcionários" 
                    rota="/funcionarios"
                />
                <ItemMenu
                    icone ={<MdDescription/>}
                    nome="Espelho Ponto" 
                    rota="espelho-ponto"  
                />
                <ItemMenu
                    icone ={<MdOutlineSystemUpdateAlt />}
                    nome="Importação AFD"
                    rota="importacao-afd"
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
    return (
        <Link to={rota} className="menu-item">
            <span className="menu-item-icone">{icone}</span>
            <span className="menu-item-nome">{nome}</span>
        </Link>
    );
}

export default Menu;