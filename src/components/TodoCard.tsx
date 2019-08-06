import React from 'react';
import { AnyAction, compose, Dispatch, } from 'redux';
import { makeStyles, } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { List, Record, } from 'immutable';
import {
  AddSubTodoAction,
  CompletedTodoAction,
  CompleteSubTodoAction,
  DeleteTodoAction,
  ISubTodo,
  ITodo,
  SelectTodoAction,
  SubTodoFactory,
} from '../actions/default';
import { Button, Checkbox, Grid, Typography, } from '@material-ui/core';
import { connect, } from 'react-redux';
import { createStructuredSelector, } from 'reselect';
import { makeSelectSelectedTodoId, makeSelectSubTodosForTodo, } from '../selectors/default';
import classnames from 'classnames';
import { Field, Form, reduxForm } from 'redux-form/immutable';
import { InjectedFormProps } from "redux-form";
import FieldTextField from './FieldTextField';

interface ITodoCardComponentProps {
  todo: Record<ITodo>;
}

interface ITodoCardProps extends ITodoCardComponentProps {
  dispatch: Dispatch<AnyAction>;
  todoId: number;
  complete: boolean;
  subtodos: List<Record<ISubTodo>>;
  selectedTodoId: number;
}

const useStyles = makeStyles({
  card: {
    margin: 4,
    maxWidth: 345,
  },
  cardSelected: {
    backgroundColor: 'lightgrey',
  },
  completed: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  subtodoContainer: {
    paddingLeft: '1em',
  }
});

interface Values extends Partial<ISubTodo> {
}

const TodoCard: React.FC<ITodoCardProps & InjectedFormProps> = (props) => {
  const classes = useStyles();
  const {
    todo,
    todoId,
    complete,
    subtodos,
    dispatch,
    selectedTodoId,

    reset,
    handleSubmit,
  } = props;


  // (values: Record<Values>) but handleSubmit is typed wrong
  const onSubmit = (values: any) => {
    dispatch(new AddSubTodoAction({
      todoId,
      subTodo: SubTodoFactory(values)
    }));
    reset()
  }
  return (
    <Form<Record<Values>> onSubmit={handleSubmit(onSubmit)}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent
            classes={{
              root: classnames({ [classes.cardSelected]: selectedTodoId === todoId })
            }}
            onClick={() => {
              dispatch(new SelectTodoAction({ todoId }))
            }}
          >
            <Grid
              container={true}
            >
              <Grid
                container={true}
                item={true}
                alignItems='center'
                wrap='nowrap'
              >
                <Checkbox
                  checked={complete}
                  value={complete}
                  onChange={() => {
                    dispatch(new CompletedTodoAction({ todo, complete }))
                  }}
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  classes={{
                    root: complete ? classes.completed : '',
                  }}
                >
                  {todo.get('title')}
                  {
                    [
                      todo.get('value1'),
                      todo.get('value2'),
                      todo.get('value3'),
                      todo.get('value4')
                    ]
                      .reduce((acc, value) => {
                        if ( value ) {
                          acc.push(value);
                        }
                        return acc;
                      }, [] as Array<string>)
                      .join(";")
                  }
                </Typography>
              </Grid>
              <Grid
                container={true}
                item={true}
                direction='column'
                classes={{
                  item: classes.subtodoContainer,
                }}
              >
                {
                  subtodos.map((subtodo) => {
                    const subtodoId = subtodo.get('id');
                    const subComplete = subtodo.get('complete');
                    return <Grid
                      key={subtodoId}
                      container={true}
                      item={true}
                      alignItems='center'
                      wrap='nowrap'
                    >
                      <Checkbox
                        checked={subComplete}
                        value={subComplete}
                        onChange={() => {
                          dispatch(new CompleteSubTodoAction({ subtodo, complete: subComplete }))
                        }}
                        inputProps={{
                          'aria-label': 'primary checkbox',
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        classes={{
                          root: subComplete ? classes.completed : '',
                        }}
                      >
                        {subtodo.get('title')}
                      </Typography>
                    </Grid>
                  })
                }
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            //@ts-ignore   
            onClick={() => {
              dispatch(new DeleteTodoAction({ todo }));
            }}
          >
            Delete
          </Button>
          <Field
            TextFieldProps={{
              label: 'title',
            }}
            name='title'
            component={FieldTextField}
          />
          <Button
            size="small"
            color="primary"
            type="submit"
          >
            {"Add SubTodo"}
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
}

const mapStateToProps = (state: any, ownProps: ITodoCardComponentProps) => {
  const {
    todo
  } = ownProps;
  const todoId = todo.get('id');
  const complete = todo.get('complete');
  const form = `form_${todoId}`;
  return {
    form,
    todoId,
    complete,
    ...createStructuredSelector({
      selectedTodoId: makeSelectSelectedTodoId(),
      subtodos: makeSelectSubTodosForTodo(todoId),
    })(state)
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    dispatch,
  };
};

export default compose<React.ComponentClass<ITodoCardComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: true,
  }),
)(TodoCard);