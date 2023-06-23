import {useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import './DashBoard.css';
import Title from "../../components/Title/Title";


function DashBoard() {

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);

    const listRef = collection(db, "chamados");
    useEffect(() =>{
        async function loadingChamados(){
            try{
            const q = query(listRef, orderBy('created', 'desc'), limit(5));
            const querySnap = await getDocs(q);
            let lista = [];
            querySnap.docs.forEach(element =>{
                lista.push({
                    id: element.id,
                    assunto: element.data().assunto,
                    client: element.data().client,
                    clientId: element.data().clientId,
                    created: element.data().created,
                    complemento: element.data().complemento,
                })
            })
            setLoading(false);
            setChamados(chamados => [...chamados, ...lista]);
            }catch(erro){
                console.log(erro)
                
            }
        }

        loadingChamados();

        return () => { }
    }, [])






    return ( 
        <div>
            <Header />
            <div className="content">
                <Title name="Tickts" >
                    <FiMessageSquare size={25} />
                </Title>
                <>
                {
                    chamados.length === 0 ? (
                        <div className="container dashboard ">
                            <span>Nenhum chamado</span>
                            <Link to='/new' className="new" >
                            <FiPlus size={25} color="#fff"/>
                                Novo Chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                        <Link to='/new' className="new" >
                            <FiPlus size={25} color="#fff"/>
                                Novo Chamado
                        </Link>

                        <table>
                    <thead>
                        <tr>
                            <th scope="col">Cliente</th>
                            <th scope="col">Assunto</th>
                            <th scope="col">Status</th>
                            <th scope="col">Cadastrado em</th>
                            <th scope="col">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Cliente">Mercado Esquina</td>
                            <td data-label="Assunto">Suporte</td>
                            <td data-label="Status" className="badge" style={{backgroundColor: "#999"}}>
                                <span>Em aberto</span>
                            </td>
                            <td data-label="Cadastrado">01/01/2023</td>
                            <td data-label="#">
                                <button className="action" style={{backgroundColor: "#3583F6"}} >
                                    <FiSearch color="#fff" size={17} />
                                </button>
                                <button className="action" style={{backgroundColor: "#F6A925"}} >
                                    <FiEdit2 color="#fff" size={17} />
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
                        </>
                    )
                }
                

                </>

            </div>
        </div>
     );
}

export default DashBoard;