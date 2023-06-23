import './Header.css';
import { Link } from 'react-router-dom';
import {FiHome, FiUser, FiSettings, FiArrowLeftCircle} from 'react-icons/fi';
import ImageProfile from '../ImageProfile/ImageProfile';
import { useContext } from 'react';
import { AuthContext } from '../../../context/auth';

function Header() {

    const {logout} = useContext(AuthContext)

    async function handleLogout(){
        await logout();
    }


    return ( 
        <div className="sidebar">
            <div>
                <ImageProfile />
            </div>

            <Link to="/dashboard">
            <FiHome size={24} color='#FFF' />
            Chamados
            </Link>
            <Link to="/customers">
            <FiUser size={24} color='#FFF' />
            Clientes
            </Link>
            <Link to="/profile">
            <FiSettings size={24} color='#FFF' />
            Perfil
            </Link>
            <button onClick={handleLogout}><FiArrowLeftCircle size={24} color='#fff' />Sair</button>
            

        </div>
     );
}

export default Header;