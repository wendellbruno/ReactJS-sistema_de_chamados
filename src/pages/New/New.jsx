import { FiPlusCircle } from 'react-icons/fi';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebaseConnection';
import { collection, getDoc, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import {toast} from 'react-toastify'
import './New.css';
import Title from '../../components/Title/Title';
import Header from '../../components/layout/Header/Header';



function New() {
    
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const {id} = useParams();
    const [idClient, setIdClient] = useState(false)
    
    const [clients, setClients] = useState([]);
    const [ clientSelected, setClientSelected] = useState(0);
    const [loadClients, setLoadClients] = useState(true);

    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    
    const listRef = collection(db,"customers");
    useEffect(() =>{
        async function loadClientes(){
            try{
                const querySnapshot = await getDocs(listRef)

                let lista = [];
                querySnapshot.docs.map(element =>{
                    lista.push({
                        id: element.id,
                        nomeFantasia: element.data().nomeFantasia
                    })
                })
                setClients(lista);
                setLoadClients(false);

                if(id){
                    loadId(lista);
                    return;
                }

            }catch(erro){
            setLoadClients(false);
            console.log(erro)
            return;
        }
    }
        loadClientes()
    }, [id])


    async function loadId(lista){
        const docRef = doc(db, 'chamados', id);
        try{
            const chamado = await getDoc(docRef)
            setAssunto(chamado.data().assunto)
            setComplemento(chamado.data().complemento)
            setStatus(chamado.data().status)

            let index = lista.findIndex(item => item.id === chamado.data().clientId)
            setClientSelected(index)
            setIdClient(true);
        }catch(erro){
            console.log(erro)
            setIdClient(false);
            toast.error('erro ao buscar chamado');
        }
    }
    


    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }

    function handleCustomSeleted(e){
        setClientSelected(e.target.value);
    }

    async function handleRegister(e){
        e.preventDefault();

        if(idClient){
            
            try{
                const docref = doc(db,"chamados",id)
                await updateDoc(docref, {
                client: clients[clientSelected].nomeFantasia,
                clientId: clients[clientSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
                })
                toast.success('Chamado editado com sucesso');
                setClientSelected(0);
                setComplemento('');
                navigate('/dashboard');
                return;

            }catch(erro){
             toast.error('Erro ao editar dados')
             console.log(erro);
             return;
            }
            
        }



       try{
        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            client: clients[clientSelected].nomeFantasia,
            clientId: clients[clientSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
           })
        toast.success('Chamado cadastrado com sucesso');
        setAssunto(0);
        setClientSelected(0);
        setComplemento('');
       }catch(erro){
        toast.error('Erro ao gravar dados')
        console.log(erro)
       }
    }


    return ( 
        <div>
            <Header />
            <div className="content">
                <Title name={id ? 'Editando chamando' : 'Novo Chamado'}>
                    <FiPlusCircle size={24} />
                </Title>

                <div className="container">
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Clientes</label>

                        {
                            loadClients ? (
                                <input type='text' disabled={true} value="Carregando..." />
                            ) : (
                                <select value={clientSelected} onChange={handleCustomSeleted}>
                                    {
                                        clients.map((element, index) =>{
                                            return (
                                                <option value={index} key={index}>
                                                    {element.nomeFantasia}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte" key={1}>Suporte</option>
                            <option value="Visita Tecnica" key={2}>Visita Tecnica</option>
                            <option value="Financeiro" key={3}>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input 
                            type="radio" 
                            name="radio" 
                            value="Aberto" 
                            onChange={handleOptionChange}
                            checked={status === "Aberto"}
                            />
                            <span>Aberto</span>

                            <input 
                            type="radio" 
                            name="radio" 
                            value="Progresso"
                            onChange={handleOptionChange}
                            checked={status === "Progresso"}
                            
                            />
                            <span>Progresso</span>

                            <input 
                            type="radio" 
                            name="radio" 
                            value="Atendido"
                            onChange={handleOptionChange}
                            checked={status === "Atendido"}
                            
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>

                        <textarea
                        type="text"
                        placeholder='Descreva seu problema (opcional)'
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        />

                        <button type='submit'>{idClient ?'Editar' : 'Registrar'}</button>

                    </form>
                </div>



            </div>
        </div>
     );
}

export default New;