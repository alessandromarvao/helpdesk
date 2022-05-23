import { useState, useEffect, createContext } from "react";
import firebase from '../services/firebaseConfig';
import 'firebase/firestore';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState('');
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadStorage() {
            const storageUser = localStorage.getItem('helpdeskUser');

            if (storageUser) {
                setUser(JSON.parse(storageUser));
            }

            setLoading(false);
        }

        loadStorage();
    }, []);


    function storageUser(data) {
        localStorage.setItem('helpdeskUser', JSON.stringify(data));
    }

    // Cadastrando um usuário
    async function signUp(email, password, nome) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        nome: nome,
                        avatarUrl: null
                    })
                    .then(() => {
                        let data = {
                            uid: uid,
                            nome: nome,
                            email: email,
                            avatarUrl: null
                        }

                        setUser(data);
                        storageUser(data);
                        toast.success('Seja bem vindo!');
                    })
            }).catch((error) => {
                console.log(error);
                toast.error('Ops! Algo deu errado!');
            });

        setLoadingAuth(false);
    }

    // Confere a autenticação do usuário
    async function signIn(email, password) {
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                const userProfile = await firebase.firestore().collection('users').doc(uid).get();

                let data = {
                    uid: uid,
                    nome: userProfile.data().nome,
                    avatarUrl: userProfile.data().avatarUrl,
                    email: email
                }

                setUser(data);
                storageUser(data);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.message);
            });

        setLoadingAuth(false);
    }

    // Desconectando um usuário
    async function signOut() {
        await firebase.auth().signOut();
        localStorage.removeItem('helpdeskUser');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            loading,
            signUp,
            signOut,
            signIn,
            loadingAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;