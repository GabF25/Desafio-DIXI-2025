import Menu from "../Menu/Menu";

const Tela = ({ children }) => {
    return ( 
        <div className="tela">
        
            <main>
                {children}
            </main>
        </div>
    );
}

export default Tela;
