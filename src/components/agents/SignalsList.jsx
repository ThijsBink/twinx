import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Container } from '@material-ui/core';

export default function SignalsList({ views }) {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      {views.map((view) => (
        <Grid
          key={view.id}
          container
          spacing={1}
          alignItems='baseline'
          justify='space-between'
        >
          <Grid item xs={6}>
            <Typography noWrap variant='caption'>
              {view.name}
            </Typography>
          </Grid>
          {view.value !== 'none' && (
            <Grid item xs={6}>
              <Typography
                variant='subtitle2'
                style={{ color: view.passed ? '#ff0000' : '#0acc00' }}
              >
                {`${view.value}`}
              </Typography>
            </Grid>
          )}
        </Grid>
      ))}
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2, 0),
    maxWidth: '100%',
    padding: 0,
  },
}));
