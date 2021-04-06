import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useApi } from '../../hooks/context/ApiContext';

import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Button } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import logo from '../../img/logo-bg-blue.jpeg';

const LinkComponent = forwardRef((props, ref) => (
  <NavLink {...props} ref={ref} />
));

export default function Navbar() {
  const classes = useStyles();
  const { logout } = useApi();

  return (
    <Toolbar className={classes.navbar}>
      <img className={classes.logo} src={logo} width='50px' alt='logo' />
      <div>
        <Button
          className={classes.link}
          color='primary'
          component={LinkComponent}
          to='/dashboard'
        >
          <AppsIcon />
          Dashboard
        </Button>
        <Button
          className={classes.link}
          variant='outlined'
          // color='primary'
          onClick={() => {
            logout();
          }}
        >
          <ExitToAppIcon />
          Logout
        </Button>
      </div>
    </Toolbar>
  );
}

const useStyles = makeStyles((theme) => ({
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
  },
  link: {
    margin: theme.spacing(1),
    color: theme.palette.background.paper,
    borderColor: theme.palette.background.paper,
    '&:hover': {
      color: theme.palette.success.main,
      borderColor: theme.palette.success.main,
    },
  },
}));
