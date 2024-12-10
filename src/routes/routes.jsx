import {Route, Routes} from 'react-router-dom';
import SigUp from '../pages/SingUp/SingUp';
import SingIn from '../pages/SingIn/SigIn';
import DashBoard from '../pages/DashBoard/BashBoard';
import PrivateRouter from './Private';
import Profile from '../pages/Profile/Profile';
import Clients from '../pages/Clients/Client'
import New from '../pages/New/New';


function RoutesApp() {
    return ( 
        <Routes >
            <Route path='/' element={<SingIn />} />
            <Route path='/register' element={<SigUp />} />
            <Route path='/dashboard' element={<PrivateRouter><DashBoard /></PrivateRouter>} />
            <Route path='/profile' element={<PrivateRouter><Profile /></PrivateRouter>} />
            <Route path='/customers' element={<PrivateRouter><Clients /></PrivateRouter>} />
            <Route path='/new' element={<PrivateRouter><New /></PrivateRouter>} />
            <Route path='/new/:id' element={<PrivateRouter><New /></PrivateRouter>} />
        </Routes>
     );
}

export default RoutesApp;