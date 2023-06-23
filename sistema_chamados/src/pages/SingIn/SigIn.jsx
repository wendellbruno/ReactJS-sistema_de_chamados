import './SingIn.css';
import logo from '../../assets/logo.png';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

function SingIn() {

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const {signIn,loadingAuth} = useContext(AuthContext);

        async function handleSignIn(event){
            event.preventDefault();
            if(email.length < 5 || password.length < 5){
                alert('dados mt curto')
            }
            await signIn(email, password)
        }

        return ( 
            <div className="container-center">
                <div className="login">
                    <div className="login-area">
                        <img src={logo} alt="logo do sistema de chamados" />
                    </div>
                    <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>
                    <input type="email" 
                    placeholder='email'
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    />
                    <input type="password" 
                    placeholder='senha'
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    />
                    <button type='submit'>{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                </form>
                <Link to="/register">
                Criar conta
                </Link>
                </div>
                
            </div>
         );
}

export default SingIn;