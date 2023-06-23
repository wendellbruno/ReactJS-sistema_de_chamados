import './ImageProfile.css';
import Avatar from '../../../assets/avatar.png';
import { useContext } from 'react';
import { AuthContext } from '../../../context/auth';


function ImageProfile() {
    const {user} = useContext(AuthContext);
    return ( 
        <img src={user.avatarUrl === null ? Avatar : user.avatarUrl } alt="foto do usuario" />
     );
}

export default ImageProfile;