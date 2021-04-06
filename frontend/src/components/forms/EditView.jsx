import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ColorPicker from '../inputs/ColorPicker';

import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Grid,
  Paper,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  Button,
  Container,
} from '@material-ui/core';

export default function EditView({
  isCreating,
  onConfirm,
  onDelete,
  tagList,
  view,
}) {
  const classes = useStyles();
  const [name, setName] = useState(isCreating ? '' : view.name);
  const [color, setColor] = useState(isCreating ? '#0213ff' : view.color);
  const [selectedTag, setSelectedTag] = useState(tagList[0].publicId);
  const [formula, setFormula] = useState(isCreating ? '' : view.formula);
  const [timeTicks, setTimeTicks] = useState(isCreating ? 12 : view.timeTicks);
  const [timeUnit, setTimeUnit] = useState(isCreating ? '1*h' : view.timeUnit);
  const [chartType, setChartType] = useState(
    isCreating ? 'line' : view.chartType
  );
  const [error, setError] = useState({ type: '', message: '' });
  const [tokenRegExp, setTokenRegExp] = useState('');

  const createError = (type = '', message = '') => setError({ type, message });

  /**
   * Create Regex functions to extract tokens from formula input
   * A token can be '+', '-', '*', '/', number, tag (in form '[tag.name]')
   */
  useEffect(() => {
    const tagsRegString = tagList.reduce((acc, tag) => {
      const nameRegComp = tag.name.replace('(', '\\(').replace(')', '\\)');
      return `${acc}+|(\\[${nameRegComp}\\])`;
    }, '');
    setTokenRegExp(new RegExp(`\\s*([0-9]${tagsRegString}+|\\S)\\s*`, 'g'));
  }, [tagList]);

  /**
   * Inspired by https://jorendorff.github.io/calc/docs/calculator-parser.html
   *
   * @param {*} formula
   * @returns
   */
  function parse(formula) {
    let tokens = [];
    let hasTag = false;
    let position = 0;
    let m;

    const peek = () => tokens[position];
    const isTag = (token) =>
      tagList.find((tag) => `[${tag.name}]` === token) !== undefined;
    const isNumber = (token) =>
      token !== undefined && token.match(/^[0-9]+$/) !== null;

    while ((m = tokenRegExp.exec(formula)) !== null) {
      tokens.push(m[1]);
    }

    function consume(token) {
      if (token !== tokens[position]) {
        throw new Error('Consumer error');
      }
      position++;
    }

    function parsePrimaryExpr() {
      let t = peek();
      switch (true) {
        case isNumber(t):
          consume(t);
          return { type: 'number', value: Number.parseFloat(t) };
        case isTag(t):
          consume(t);
          hasTag = true;
          return {
            type: 'tag',
            id: tagList.find((tag) => `[${tag.name}]` === t).publicId,
          };
        case '(':
          consume(t);
          var expr = parseExpr();
          if (peek() !== ')') throw new Error('Bracket not closed');
          consume(')');
          return expr;
        default:
          console.log(t);
          throw new Error('Expected number, tag or parentheses');
      }
    }

    function parseMulExpr() {
      let expr = parsePrimaryExpr();
      let t = peek();
      while (t === '*' || t === '/') {
        consume(t);
        expr = { type: t, left: expr, right: parsePrimaryExpr() };
        t = peek();
      }
      return expr;
    }

    function parseExpr() {
      let expr = parseMulExpr();
      let t = peek();
      while (t === '+' || t === '-') {
        consume(t);
        expr = { type: t, left: expr, right: parseMulExpr() };
        t = peek();
      }
      return expr;
    }

    let result = parseExpr();

    if (position !== tokens.length) throw new Error(`Unexpected '${peek()}'`);
    if (!hasTag) throw new Error(`Formula should contain at least a tag`);

    return result;
  }

  const handleConfirm = (e) => {
    e.preventDefault();

    if (name.trim().length === 0) {
      return createError('name', 'No name added');
    }
    if (timeTicks < 1 || timeTicks > 120) {
      return createError('timeTicks', 'Number between 1 and 120');
    }
    if (formula.trim().length === 0) {
      return createError('formula', 'No formula added');
    }

    let tagIdsList = [];
    function searchTagIds(graph) {
      switch (graph.type) {
        case 'tag':
          tagIdsList.push(graph.id);
          return;
        case 'number':
          return;
        default:
          searchTagIds(graph.left);
          searchTagIds(graph.right);
      }
    }

    try {
      const formulaGraph = parse(formula);
      searchTagIds(formulaGraph);
      onConfirm({
        name,
        color,
        chartType,
        formula,
        formulaGraph,
        tagIdsList,
        timeTicks,
        timeUnit,
      });
    } catch (err) {
      createError('formula', err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error.type === name) createError();

    switch (name) {
      case 'name':
        return setName(value);
      case 'timeTicks':
        return setTimeTicks(value);
      case 'formula':
        return setFormula(value);
      case 'selectedTag':
        setFormula(
          (text) =>
            `${text}[${tagList.find((tag) => tag.publicId === value).name}]`
        );
        return setSelectedTag(value);
      case 'timeUnit':
        return setTimeUnit(value);
      case 'color':
        return setColor(value);
      default:
        return;
    }
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant='h6' gutterBottom>
        {isCreating ? 'Adding new view' : 'Editing view'}
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleConfirm}>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <Button
              variant={chartType === 'line' ? 'outlined' : 'text'}
              onClick={() => setChartType('line')}
            >
              📉 Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'outlined' : 'text'}
              onClick={() => setChartType('bar')}
            >
              📊 Bar
            </Button>
          </Grid>

          <Grid item xs={2}>
            <ColorPicker value={color} onChange={handleChange} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              name='name'
              label='Name'
              variant='outlined'
              value={name}
              onChange={handleChange}
              error={error.type === 'name'}
              helperText={error.type === 'name' ? error.message : ''}
            />
          </Grid>

          <Grid item xs={9}>
            <TextField
              className={classes.textField}
              name='formula'
              label='Formula'
              variant='outlined'
              value={formula}
              onChange={handleChange}
              error={error.type === 'formula'}
              helperText={error.type === 'formula' ? error.message : ''}
            />
          </Grid>

          <Grid item xs={3}>
            <FormControl className={classes.formControl} variant='outlined'>
              <InputLabel id='tag-label'>Tag</InputLabel>
              <Select
                className={classes.tagSelect}
                name='selectedTag'
                label='Tag'
                value={selectedTag}
                renderValue={() => '➕'}
                onChange={handleChange}
              >
                {tagList.map((tag) => (
                  <MenuItem key={tag.publicId} value={tag.publicId}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={5}>
            <TextField
              className={classes.textField}
              type='number'
              name='timeTicks'
              label='Collect'
              variant='outlined'
              value={timeTicks}
              onChange={handleChange}
              error={error.type === 'timeTicks'}
              helperText={error.type === 'timeTicks' ? error.message : ''}
              InputProps={{ inputProps: { min: 1, max: 120, step: 1 } }}
            />
          </Grid>

          <Grid item xs={7}>
            <FormControl className={classes.formControl} variant='outlined'>
              <InputLabel id='tag-label'>Bin type</InputLabel>
              <Select
                name='timeUnit'
                label='Bin type'
                value={timeUnit}
                onChange={handleChange}
              >
                <MenuItem value='5*m'>5mins</MenuItem>
                <MenuItem value='15*m'>15mins</MenuItem>
                <MenuItem value='1*h'>1hr</MenuItem>
                <MenuItem value='4*h'>4hrs</MenuItem>
                <MenuItem value='1*d'>day</MenuItem>
                <MenuItem value='1*w'>week</MenuItem>
                <MenuItem value='1*M'>month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Container className={classes.actionsContainer}>
          {isCreating || (
            <Button
              className={classes.deleteButton}
              color='secondary'
              variant='contained'
              onClick={() => onDelete(view.id)}
            >
              <DeleteIcon />
            </Button>
          )}
          <Button
            className={classes.confirmButton}
            color='primary'
            variant='contained'
            type='submit'
          >
            Confirm
          </Button>
        </Container>
      </form>
    </Paper>
  );
}

EditView.propTypes = {
  isCreating: PropTypes.bool,
  onConfirm: PropTypes.func,
  onDelete: PropTypes.func,
  tagList: PropTypes.array,
  view: PropTypes.object,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    marginLeft: -theme.spacing(35),
    width: theme.spacing(70),
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
  confirmButton: {
    width: theme.spacing(12),
    margin: theme.spacing(2),
    '&:hover': {
      color: theme.palette.success.main,
    },
  },
  deleteButton: {
    margin: theme.spacing(2),
  },
}));
