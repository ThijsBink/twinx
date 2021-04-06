import PropTypes from 'prop-types';
import RGL, { WidthProvider } from 'react-grid-layout';
import View from './View';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

export default function ViewsGrid({
  views,
  layout,
  onLayoutChangeHandler,
  onEditHandler,
  onSignalHandler,
}) {
  const classes = useStyles();
  return (
    <ReactGridLayout
      cols={30}
      rowHeight={30}
      className='layout'
      layout={layout}
      onLayoutChange={(l) => onLayoutChangeHandler(l)}
    >
      {views.map((view) => (
        <Card
          key={view.id}
          className={classes.item}
          data-grid={{
            i: view.id,
            x: 0,
            y: 100,
            w: 10,
            h: 8,
          }}
        >
          <View onEdit={onEditHandler} onSignal={onSignalHandler} view={view} />
        </Card>
      ))}
    </ReactGridLayout>
  );
}

ViewsGrid.propTypes = {
  views: PropTypes.array,
  layout: PropTypes.array,
  onLayoutChangeHandler: PropTypes.func,
  onEditHandler: PropTypes.func,
  onSignalHandler: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  item: {
    border: '1px solid #3a3a3a1f',
    borderRadius: '5px',
    backgroundColor: theme.palette.background.paper,
    margin: 'auto',
    padding: 0,
  },
}));
