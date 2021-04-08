import { useState } from 'react';
import { useApi } from '../hooks/context/ApiContext';

import {
  Grid,
  Button,
  Container,
  TextField,
  CssBaseline,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import logo from '../img/logo.png';

export default function Login() {
  const classes = useStyles();
  const { login } = useApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const encodedAuth = btoa(`${email}:${twoFA}:${password}`);
    login(encodedAuth);
  }

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Container component='main' maxWidth='xs'>
        <div className={classes.paper}>
          <img className='logo-image' src={logo} alt='logo' width='30%' />
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  label='Email'
                  id='email'
                  fullWidth
                  type='email'
                  noValidate
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  label='Password'
                  id='password'
                  type='password'
                  fullWidth
                  noValidate
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  label='Two-Factor Token'
                  id='twoFA'
                  fullWidth
                  type='text'
                  noValidate
                  onChange={(e) => setTwoFA(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              className={classes.submit}
              variant='contained'
              color='primary'
              type='submit'
            >
              Login
            </Button>
          </form>
        </div>
      </Container>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
