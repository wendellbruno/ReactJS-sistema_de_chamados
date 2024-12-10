import "./Profile.css";
import { FiSettings, FiUpload } from "react-icons/fi";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import { toast } from 'react-toastify';
import {storage, db} from '../../services/firebaseConnection';
import {doc, updateDoc} from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'


import Title from "../../components/Title/Title";
import Header from "../../components/layout/Header/Header";
import ImageProfile from "../../components/layout/ImageProfile/ImageProfile";


function Profile() {

 const {user, setUser, storageUser} = useContext(AuthContext);

 const [nome, setNome] = useState(user && user.nome);
 const [email, setEmail] = useState(user && user.email);
 const [imageAvatar, setImageAvatar] = useState(user && user.imageUrl)

 const [imgProfile, setImgProfile] = useState(null);

 function handleFile(event){
    if(event.target.files[0]){
        const image = event.target.files[0];

        if(image.type === "image/jpeg" || image.type === "image/png"){
            setImgProfile(image)
            setImageAvatar(URL.createObjectURL(image))
        }else{
           toast.warning('Formato incorreto apenas PNG ou JPG')
           setImageAvatar(null)
           return;
        }
    }
 }



 async function handleUpload(){
   
   try{
      const currentUid = user.uid;
      const uploadRef = ref(storage, `images/${currentUid}/${imgProfile.name}`);
      
      //const uploadTask = await uploadBytes(uploadRef, ImageProfile)
      //const urlImg = await getDownloadURL(uploadTask.ref)
      const uploadTask = await uploadBytes(uploadRef, ImageProfile)
      .then((snapshot) =>{
        getDownloadURL(snapshot.ref).then(async(downloadURL) =>{
          let urlFoto = downloadURL;
          const docRef = doc(db, "users", user.uid)
          await updateDoc(docRef, {
            avatarUrl: urlFoto,
            nome: nome
          })
          .then(() =>{
            let data = {
              ...user,
              nome: nome,
              avatarUrl: urlFoto
            }
            setUser(data);
            storageUser(data);
            toast.success('Dados Atualizados')

          })

        })
        
      })



      
      /* let data = {
        ...user,
        nome: nome,
        avatarUrl: urlImg
      }
      setUser(data);
      storageUser(data);
      toast.success('Dados Atualizados') */

    }catch(erro){
      console.log(erro)
    }
 }

 async function handleSubmit(event){
   event.preventDefault()

   try{
    if(imgProfile === null && nome !== ''){
      //atualizar apenas o nome do user
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef,{
        nome: nome
      })

      let data = {
        ...user,
        nome: nome
      }
      setUser(data);
      storageUser(data);
      toast.success('Dados Atualizados')
   }else if(nome !== '' && imgProfile !== null){
      //atualizar completo
      await handleUpload()
   }
   }catch(erro){
    console.log(erro);
    toast.error('Erro ao atualizar dados');
    return;
   }

   
 }


  return (
    <div>
      <Header />
      <div className="content">
        <Title name={"Meu Perfil"}>
          <FiSettings size={25} />
        </Title>

        <div className="conteiner">

          <form className="form-profile" onSubmit={handleSubmit}>

            <label className="label-avatar">
              <span>
                <FiUpload color="#fff" size={25} />
              </span>
              <input type="file" accept="image/*" onChange={handleFile}/> <br />
              {
                
                imageAvatar === undefined ? (
                    <ImageProfile />
                    ) : (
                    <img src={imageAvatar} alt="img de perfil" />
                )}
                
            </label>


            <label>Nome</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)}/>

            <label>E-mail</label>
            <input type="email" value={email} disabled={true} />
        

            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
