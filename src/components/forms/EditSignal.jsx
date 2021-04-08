import { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import {
  Typography,
  TextField,
  Paper,
  Select,
  Button,
  Grid,
  FormControl,
  MenuItem,
} from '@material-ui/core';

export default function EditSignal({ onEdit, view }) {
  const classes = useStyles();
  const [type, setType] = useState(view.signal.type);
  const [threshold, setThreshold] = useState(view.signal.threshold);

  function handleConfirm(e) {
    e.preventDefault();
    onEdit(type, threshold, view.id);
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant='h5'>Signal</Typography>
      <form className={classes.form} noValidate onSubmit={handleConfirm}>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={6}>
            <FormControl className={classes.formControl} variant='outlined'>
              <Select
                name='type'
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value='none'>None</MenuItem>
                <MenuItem value='greater'>Greater than</MenuItem>
                <MenuItem value='smaller'>Smaller than</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.textField}
              type='number'
              name='threshold'
              label='Threshold'
              variant='outlined'
              disabled={type === 'none'}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              className={classes.confirmButton}
              color='primary'
              variant='contained'
              type='submit'
            >
              <DoneIcon />
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

EditSignal.propTypes = {
  onConfirm: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -theme.spacing(30),
    width: theme.spacing(60),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  formControl: {
    width: '100%',
  },
  textField: {
    width: '100%',
  },
  tagSelect: {
    appearance: 'none',
    textIndent: '1px',
    textOverflow: '',
  },
  actionsContainer: {
    padding: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));
