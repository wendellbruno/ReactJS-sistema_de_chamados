import { useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import './SingUp.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth';


function SingUp() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {signUp, loadingAuth} = useContext(AuthContext);

    async function handleSubmit(event){
        event.preventDefault()
        if(name.length < 2 | email.length < 5 | password.length < 4){
            alert('pouco dados')
        }
       await signUp(email, password, name)
    }

        return ( 
            <div className="container-center">
                <div className="login">
                    <div className="login-area">
                        <img src={logo} alt="logo do sistema de chamados" />
                    </div>

                    <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input type="text" 
                    placeholder='Nome'
                    onChange={e => setName(e.target.value)}
                    value={name}
                    />
                    <input type="email" 
                    placeholder='seuemail@seuemail.com'
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    />
                    <input type="password" 
                    placeholder='senha'
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    />
                    <button type='submit'>{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
                </form>
                <Link to={'/'}>
                Já possui uma conta ? faça login
                </Link>
                </div>
                
            </div>
         );
}

export default SingUp;