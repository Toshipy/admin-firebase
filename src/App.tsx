import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, login, logout } from './features/userSlice'
import { auth } from './firebase';
import './App.css';
import styles from "./App.module.css";
import Auth from './components/Auth';
import Feed from './components/Feed';


const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser)=> {
      if(authUser) {
        dispatch((login({
          uid: authUser,
          photoUrl: authUser.photoURL,
          displayName: authUser.displayName,
        }))) 
      } else {
        dispatch(logout());
      }
    });
      return () => {
        unSub();
      };
  }, [dispatch]);

  return  (
    <>
      {user.uid ? (
        <div className = {styles.app}>
          <Feed />
        </div>
      ): (
        <Auth />
        )}
  </>
  );
};

export default App;
