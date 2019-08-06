import React from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { IMatch } from '../../Interfaces';
import { Map, Record, } from 'immutable';
import { connect } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';
import { AddUserAction, DeleteUserAction, IUser, UserFactory, } from '../../actions/default';
import { makeSelectUsers, } from '../../selectors/default';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { InjectedFormProps } from "redux-form";
import { Field, Form, reduxForm } from "redux-form/immutable";

import FieldTextField from "../../components/FieldTextField";

interface IUserListComponentProps {
  match: IMatch,
}

interface IUserListProps extends IUserListComponentProps {
  addUser: (user: Record<IUser>) => void;
  deleteUser: (userId: number) => void;
  users: Map<number, Record<IUser>>;
}

const addUser = (user: Record<IUser>) => new AddUserAction({user});
const deleteUser = (userId: number) => new DeleteUserAction({userId});

const required = (value: string) => (value || typeof value === 'number' ? undefined : 'Required')


const UserList: React.FC<IUserListProps & InjectedFormProps> = (props) => {

  const {
    addUser,
    deleteUser,
    users,

    handleSubmit
  } = props;

  return (
    <Form onSubmit={handleSubmit((values) => {
      addUser(
        UserFactory(values),
      );
    })}>
      <Grid
        container={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
        >
          <Typography
            variant='h5'
          >
            Users
          </Typography>
        </Grid>
        <Grid
          container={true}
          item={true}
          direction='column'
          wrap='nowrap'
        >

          <Grid
            item={true}
            container={true}
            alignItems='center'
          >
            <Grid
              item={true}
            >
              <Field
                TextFieldProps={{
                  label: 'name',
                }}
                name='name'
                component={FieldTextField}
                validate={required}
              />
            </Grid>
            <Grid
              item={true}
            >
              <Button
                variant='outlined'
                type="submit"
              >
                Add User
              </Button>
            </Grid>
          </Grid>
          {
            users.map((user, userId) => {
              return <Grid
                spacing={1}
                container={true}
                key={userId}
                item={true}
              >
                <Grid
                  item={true}
                >
                  <Typography>
                    {userId}:
                  </Typography>
                </Grid>
                <Grid
                  item={true}
                >
                  <Typography>
                    {user.get('name')}
                  </Typography>
                </Grid>
                <Grid
                  item={true}
                >
                  <Link
                    to={`/todo/${userId}`}
                  >
                    <Typography>
                      todos
                    </Typography>
                  </Link>
                </Grid>
                <Grid
                  item={true}
                >
                  <Button
                    variant='outlined'
                    onClick={() => deleteUser(userId)}>
                    Delete User
                  </Button>

                </Grid>
              </Grid>;
            }).valueSeq().toArray()
          }
        </Grid>
      </Grid>
    </Form>

  );
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({addUser, deleteUser}, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: "user"
  })(UserList as any)) as any;