import { createContext, useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import {auth, db} from '../services/firebaseConnection';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore'
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({children}){

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() =>{
        async function loadUser(){
            const stogeUser = localStorage.getItem('@ticketsPRO');
            if(stogeUser){
                setUser(await JSON.parse(stogeUser));
                setLoading(false)
            }
            setLoading(false)
        }
        loadUser();
    },[]);


    async function signIn(email, password){
       setLoadingAuth(true)
       try{
        const userLog = await signInWithEmailAndPassword(auth,email, password);
        let uid = userLog.user.uid;

        const docRef =  doc(db, "users", uid);
        const docSnap = await getDoc(docRef)

        let data = {
            uid: uid,
            nome: docSnap.data().nome,
            email: userLog.user.email,
            avatarUrl: docSnap.data().avatarUrl
          }
        
          setUser(data)
          storageUser(data)
          setLoadingAuth(false)
          toast.success(`Bem vindo de volta`)
          navigate("/dashboard")
    
    
    }catch(erro){
        setLoadingAuth(false)
        toast.error('Ops... algo deu errado')
        console.log(erro)
       }
    }

   async function signUp(email, password, nome){
        setLoadingAuth(true)
        try{
          const createdUser =  await createUserWithEmailAndPassword(auth, email, password);
          let uid = createdUser.user.uid

           await setDoc(doc(db, "users", uid), {
            nome: nome,
            avatarUrl: null
          })
          
          let data = {
              uid: uid,
              nome: nome,
              email: createdUser.user.email,
              avatarUrl: null
            }

          setUser(data)
          storageUser(data)
          setLoadingAuth(false)
          toast.success(`Sejá Bem Vindo ${nome}`)
          navigate("/dashboard")

        }catch(erro){
            setLoadingAuth(false)
            console.log(erro)
        }

       /*  .then(async (value) =>{
            let uid = value.user.uid;
            await setDoc(doc(db, "users", uid),{
                nome: nome,
                avatarUrl: null,
            })
        .then(() =>{
            setLoadingAuth(false)
            alert('cadastrado com sucesso')
        })
        }).catch(erro => {
            setLoadingAuth(false)
            console.log( erro)
        }) */
    }

    function storageUser(data){
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
    }

    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO'),
        setUser(null)
    }

    const data = {
        signed: !!user, //false
        user,
        setUser,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser
        
    }

    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;