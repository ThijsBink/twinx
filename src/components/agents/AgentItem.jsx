import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import SignalsList from './SignalsList';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Card, Grid } from '@material-ui/core';

export default function AgentItem({ agent }) {
  const classes = useStyles();

  return (
    <Link to={`/agent/${agent.publicId}`} style={{ textDecoration: 'none' }}>
      <Card className={classes.card}>
        <Grid container direction='column'>
          <Grid item>
            <Typography variant='caption'>{agent.companyName}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='h5' color='primary'>
              <strong>{agent.name}</strong>
            </Typography>
          </Grid>
          <Grid item>
            {agent.signallingViews && (
              <SignalsList views={agent.signallingViews} />
            )}
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
}

AgentItem.propTypes = {
  agent: PropTypes.object,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
