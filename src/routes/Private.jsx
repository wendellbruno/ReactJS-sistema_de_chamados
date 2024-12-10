import {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function PrivateRouter({children}) {
    const {signed, loading} = useContext(AuthContext);

    if(loading){
        return(
            <div>Carregando...</div>
        )
    }

    if(!signed){
        return <Navigate to={"/"} />
    }
    return children;
}

export default PrivateRouter;