import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import styles from './Auth.module.css';
import { auth, provider, firebaseConfig } from '../firebase';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1581784368651-8916092072cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Auth: React.FC = () => {
  const classes = useStyles();

  const [email,setEmail] = useState("");
  const [username,setUsername] = useState("");
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
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            {isLogin ? "Login" : "Register"}
          </Typography>
        <form className={classes.form} noValidate />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="usename"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="default"
          // className={classes.submit}
        >
          {isLogin ? "Login" : "Register"}
        </Button>
        <Grid container>
        <Grid item xs>
          <span className={styles.login_toggleMode}>パスワードをお忘れですか？</span>
        </Grid>
        <Grid item xs>
          <span 
              className={styles.login_toggleMode}
              onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "アカウントを新規登録しますか？" : "ログイン画面に戻る"}
          </span>
        </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          onClick={signInGoogle}
        >
          Sign-in with Google
          </Button>
      </div>
      </Grid>
    </Grid>
  )
}

export default Auth
