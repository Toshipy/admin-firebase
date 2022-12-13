import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
// import handleChangeTerms from './Checkbox';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import styles from './Auth.module.css';
import { updateUserProfile } from '../features/userSlice';
import { auth, provider, storage } from '../firebase';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";


import {
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
// import CameraIcon from "@material-ui/icons/Camera";
// import EmailIcon from "@material-ui/icons/Email";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

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

const Auth: React.FC = () => {
  const classes = useStyles();

  const [email,setEmail] = useState("");
  const [username,setUsername] = useState("");
  const dispatch = useDispatch();
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [password,setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [openModal,setOpenModal] = React.useState(false);
  const [resetEmail,setResetEmail] = useState("");
  const [value, setValue] = React.useState('female');

  
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value="";
    }
  };

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
    .sendPasswordResetEmail(resetEmail)
    .then(() => {
      setOpenModal(false);
      setResetEmail("");
    })
    .catch((err) => {
      alert(err.message);
      setResetEmail("");
    });
  };

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  }

  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      const S ="abcdefghijklmnopqrstuvwxyz123456789";
      const N =16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;

      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref('avatars').child(fileName).getDownloadURL();
    }

    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });

    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    )
  }


  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  }
  

  // const signInGoogle = async () => {
  //   await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  // };

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
            {isLogin ? "ログイン" : "新規登録"}
          </Typography>
        <form className={classes.form} noValidate >
          {!isLogin && (
        <>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="ユーザーネーム"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value)
            }}
          />
          <Box textAlign="center">
            <IconButton>
              <label>
                <AccountCircleIcon
                  fontSize="large"
                  className={
                    avatarImage
                    ? styles.login_addIconLoaded
                    : styles.login_addIcon
                  }
                />
                <input
                  className={styles.login_hiddenIcon}
                  type="file"
                  onChange={onChangeImageHandler}
                ></input>
              </label>
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                id="date"
                label="生年月日"
                type="date"
                defaultValue="2000-01-01"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={4}>
            <FormControl component="fieldset">
            <FormLabel component="legend">性別</FormLabel>
              <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                <FormControlLabel value="female" control={<Radio />} label="女性" />
                <FormControlLabel value="male" control={<Radio />} label="男性" />
              </RadioGroup>
            </FormControl>
            </Grid>
          </Grid>
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="規約に同意する"  />
            <Link href="https://menherasenpai.notion.site/457df49475494671807673a0a3346451">利用規約</Link>
          </FormGroup>
        </>
      )}

        
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Eメールアドレス"
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
          id="password"
          type="password"
          label="パスワード"
          name="password"
          autoComplete="password"
          autoFocus
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
          }}
        />
        <Button
        disabled={
          isLogin
            ? !email || password.length <6
            : !username || !email || password.length < 6 || !avatarImage
        }
          fullWidth
          variant="contained"
          color="primary"
          style={{
            marginTop:"10px",
            marginBottom: "10px"
          }}
          
          // className={classes.submit}
          onClick={
            isLogin
              ? async () => {
                  try{
                    await signInEmail();
                  } catch (err:any) {
                    alert(err.message);
                  }
                }
              : async () => {
                try{
                  await signUpEmail();
                } catch (err:any) {
                  alert(err.message);
                }
              }
          }
        >
          {isLogin ? "ログイン" : "新規登録"}
        </Button>
        {/* <Button
          color="primary"
          fullWidth
          variant="contained"
          onClick={signInGoogle}
        >
          Googleでサインインする
          </Button> */}
        </form>
      
      
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
        <Grid container>
          <Grid item xs>
            <span 
              className={styles.login_toggleMode}
              onClick={() => setOpenModal(true)}
            >パスワードをお忘れですか？</span>
          </Grid>
          <Grid item>
            <span 
                className={styles.login_toggleMode}
                onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "アカウントを新規登録しますか？" : "ログイン画面に戻る"}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    
  );
};

export default Auth
