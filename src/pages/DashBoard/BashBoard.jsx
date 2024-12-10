import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Header from "../../components/layout/Header/Header";
import "./DashBoard.css";
import Title from "../../components/Title/Title";

function DashBoard() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState({})

  const listRef = collection(db, "chamados");
  useEffect(() => {
    async function loadingChamados() {
      try {
        const q = query(listRef, orderBy("created", "desc"), limit(1));
        const querySnap = await getDocs(q);
        let lista = [];
        querySnap.docs.forEach((element) => {
          lista.push({
            id: element.id,
            assunto: element.data().assunto,
            status: element.data().status,
            client: element.data().client,
            clientId: element.data().clientId,
            created: element.data().created,
            createdFormat: format(
              element.data().created.toDate(),
              "dd/MM/yyyy"
            ),
            complemento: element.data().complemento,
          });
        });
        setLoading(false);
        const lastDoc = querySnap.docs[querySnap.docs.length - 1];
        setLastDocs(lastDoc);
        setChamados((chamados) => [...chamados, ...lista]);
      } catch (erro) {
        setIsEmpty(true);
        setLoadingMore(false);
        toast.error("Erro ao buscar chamados");
        console.log(erro);
      }
    }

    loadingChamados();

    return () => {};
  }, []);

  async function handleMore() {
    setLoadingMore(true);
    try {
      const q = query(
        listRef,
        orderBy("created", "desc"),
        startAfter(lastDocs),
        limit(1)
      );
      const querySnap = await getDocs(q);
      let lista = [];
      querySnap.docs.forEach((element) => {
        lista.push({
          id: element.id,
          assunto: element.data().assunto,
          status: element.data().status,
          client: element.data().client,
          clientId: element.data().clientId,
          created: element.data().created,
          createdFormat: format(element.data().created.toDate(), "dd/MM/yyyy"),
          complemento: element.data().complemento,
        });
      });
      setLoading(false);
      const lastDoc = querySnap.docs[querySnap.docs.length - 1];
      setLastDocs(lastDoc);
      setChamados((chamados) => [...chamados, ...lista]);
      setLoadingMore(false);
    } catch (erro) {
      setLoadingMore(true);
      console.log(erro);
    }
  }

  function openModal(element){
    setShowModal(!showModal);
    setDetail(element);
  }



  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Tickts">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Tickts">
          <FiMessageSquare size={25} />
        </Title>
        <>
          {chamados.length === 0 ? (
            <div className="container dashboard ">
              <span>Nenhum chamado</span>
              <Link to="/new" className="new">
                <FiPlus size={25} color="#fff" />
                Novo Chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus size={25} color="#fff" />
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
                  {chamados.map((element, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{element.client}</td>
                        <td data-label="Assunto">{element.assunto}</td>
                        <td
                          data-label="Status"
                          className="badge"
                          style={{
                            backgroundColor:
                              element.status === "Aberto" ? "#5cb85c" : "#999",
                          }}
                        >
                          <span>{element.status}</span>
                        </td>
                        <td data-label="Cadastrado">{element.createdFormat}</td>
                        <td data-label="#">
                          <button
                            className="action"
                            onClick={() => openModal(element)}
                            style={{ backgroundColor: "#3583F6" }}
                          >
                            <FiSearch color="#fff" size={17} />
                          </button>
                          <Link to={`/new/${element.id}`}
                            className="action"
                            style={{ backgroundColor: "#F6A925" }}
                          >
                            <FiEdit2 color="#fff" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loadingMore && <h3>Buscando mais itens</h3>}
              {!loadingMore && !isEmpty && (
                <button onClick={handleMore} className="btn-more">
                  Buscar mais
                </button>
              )}
            </>
          )}
        </>
      </div>

      {
        showModal && (
          <Modal 
          conteudo={detail}
          close={() => setShowModal(!showModal)}
          />   
        )
      }    

    </div>
  );
}

export default DashBoard;
