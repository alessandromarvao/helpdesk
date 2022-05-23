import { useState, useContext } from 'react';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './profile.css';
import avatar from "../../assets/avatar.png";

export default function Profile() {
    const { user, signOut } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>
                <div className='container'>
                    <form className='form-profile'>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25} />
                            </span>
                            <input type="file" accept='image/*' />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuário" />
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuário" />
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="email" value={email} disabled="true" />

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