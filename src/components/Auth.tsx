import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import styles from 'Auth.module.css';
import { auth, provider, firebaseConfig } from '../firebase';

const Auth: React.FC = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const SignInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  }

  const SignUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password);
  }

  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };

  // console.log(firebaseConfig.authDomain);

  return (
    <div>Auth
      <button>Sign In</button>
      
      <button onClick={signInGoogle}>SignIn with Google</button>
    </div>
  )
}

export default Auth
