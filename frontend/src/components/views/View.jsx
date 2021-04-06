import Chart from './Chart';
import PropTypes from 'prop-types';

import { Grid, Typography, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import { makeStyles } from '@material-ui/core/styles';

export default function View({ view, onEdit, onSignal }) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Grid container className={classes.header} direction='row'>
        <Grid item className={classes.detailsContainer}>
          <Typography variant='subtitle2' className={classes.viewName}>
            {view.name}
          </Typography>
          <Typography variant='caption'>
            {view.timeTicks} x {view.timeUnit.replace('*', '')}
          </Typography>
        </Grid>
        <Grid
          item
          onMouseDown={(e) => e.stopPropagation()}
          className={classes.buttonsContainer}
        >
          <Button className={classes.button} onClick={() => onSignal(view)}>
            {view.signal.type === 'none' ? (
              <NotificationsOffIcon style={{ color: '#0000004f' }} />
            ) : (
              <NotificationsActiveIcon style={{ color: '#56a548' }} />
            )}
          </Button>
          <Button className={classes.button} onClick={() => onEdit(view)}>
            <EditIcon />
          </Button>
        </Grid>
      </Grid>
      <Chart
        syncId={`${view.timeTicks}${view.timeUnit}`}
        signal={view.signal}
        type={view.chartType}
        color={view.color}
        data={view.values}
      />
    </div>
  );
}

View.propTypes = {
  view: PropTypes.object,
  onEdit: PropTypes.func,
  onSignal: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space',
    height: '100%',
    width: '100%',
  },
  buttonsContainer: {
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  detailsContainer: {
    padding: 0,
    display: 'flex',
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  viewName: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  header: {
    color: '#0000009f',
    fontWeight: 'bold',
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    color: '#0000009f',
    padding: 0,
    minWidth: '25px',
  },
}));
