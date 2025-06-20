const Cadastro = () => {
    return ( 
        <div>
            <h1>Cadastro de Funcionários</h1>
            <form>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="cargo">Cargo:</label>
                    <input type="text" id="cargo" name="cargo" required />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
     );
}
 
export default Cadastro;