import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingBottom: '10px',
    paddingTop: '10px',
  },
  tree: {
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  gridItem: {
    textAlign: 'center',
  },
  datePicker: {
    paddingBottom: '10%',
  },
  button: {
    textTransform: 'none',
  },
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
  },
}));

export default styles;