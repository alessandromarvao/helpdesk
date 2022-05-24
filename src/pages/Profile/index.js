import { useState, useContext } from 'react';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConfig';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './profile.css';
import avatar from "../../assets/avatar.png";

export default function Profile() {
    const { user, setUser, storageUser, signOut } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    async function handleSave(e) {
        e.preventDefault(); //Previne o navegador de atualizar a página após o envio do form.
        //Atualiza apenas o nome do usuário
        if (imageAvatar === null && nome !== '') {
            await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome
                    }
                    //Armazena no context os dados do usuário atualizados
                    setUser(data);
                    // Armazena no storage do navegador os dados do usuário atualizados 
                    storageUser(data);
                })
        } else if (nome !== '' && imageAvatar !== null) {
            handleUpload();
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;
        const uploadTask = await firebase.storage().ref(`images/${currentUid}/${imageAvatar.name}`)
            .put(imageAvatar)
            .then(async () => {
                // Puxa do Firebase Storage a URL da imagem armazenada
                await firebase.storage().ref(`images/${currentUid}`)
                    .child(imageAvatar.name).getDownloadURL()
                    .then(async (url)=>{
                        let urlFoto = url;
                        // Armazena a url da imagem no firestore
                        await firebase.firestore().collection('users')
                        .doc(user.uid)
                        .update({
                            avatarUrl:urlFoto,
                            nome: nome
                        })
                        .then(() => {
                            let data = {
                                ...user,
                                avatarUrl: urlFoto,
                                nome: nome
                            }
                            //Armazena no context os dados do usuário atualizados
                            setUser(data);
                            // Armazena no storage do navegador os dados do usuário atualizados 
                            storageUser(data);
                        })
                    })
            })
    }

    //faz o preview da imagem (visualiza antes de enviar ao firebase)
    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
            } else {
                alert("Envie uma imagem do tipo PNG ou JPEG");
                setImageAvatar(null);
                return null;
            }
        }
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>
                <div className='container'>
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25} />
                            </span>
                            <input type="file" accept='image/*' onChange={handleFile} />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuário" />
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuário" />
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="email" value={email} disabled={true} />

                        <button type="submit">Salvar</button>
                    </form>
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={() => signOut()}>Sair</button>
                </div>
            </div>
        </div>
    )
}