import './Client.css';
import Header from '../../components/layout/Header/Header'
import Title from '../../components/Title/Title';
import {FiUser} from 'react-icons/fi'
import { useState } from 'react';
import {toast} from 'react-toastify';
import { db } from '../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';

function Client() {

    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleRegister(e){
        e.preventDefault();
        
        if(nome.length < 3 || cnpj.length < 8 || endereco.length < 5){
            toast.warning('dados insuficientes')
            return;
        }
        
       try{
        const client = await addDoc(collection(db, "customers"), {
            nomeFantasia: nome,
            cnpj: cnpj,
            endereco: endereco
        })
        setCnpj('');
        setEndereco('');
        setNome('');
        toast.success('Cliente cadastrado com sucesso')
       }catch(erro){
        console.log(erro);
        toast.error('Erro ao inserir dados');
        return;
       }


    }


    return ( 
       <div>
         <Header />
            <div className='content'>
                <Title name="Clientes"> 
                <FiUser size={25} />
                </Title>
                
                <div className="conteiner">
                <form className='form-profile' onSubmit={handleRegister}>
                    <label >Nome fantasia</label>
                    <input 
                    type="text"
                    placeholder='Nome da empresa'
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    />

                    <label >CNPJ</label>
                    <input 
                    type="text"
                    placeholder='Cnpj da empresa'
                    value={cnpj}
                    onChange={e => setCnpj(e.target.value)}
                    />

                    <label >Endereço</label>
                    <input 
                    type="text"
                    placeholder='Endereço da empresa'
                    value={endereco}
                    onChange={e => setEndereco(e.target.value)}
                    />

                    <button type='submit'>Salvar</button>
                 
                </form>
            </div>

            </div>

            
       </div>
     );
}

export default Client;