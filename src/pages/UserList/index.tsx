import React, { useState } from 'react';
import { AnyAction, bindActionCreators, compose, Dispatch } from 'redux';
import { IMatch } from '../../Interfaces';
import { Map, Record, } from 'immutable';
import { connect } from 'react-redux';
import { Button, FormControl, FormHelperText, Grid, TextField, Typography } from '@material-ui/core';
import { AddUserAction, DeleteUserAction, IUser, UserFactory, } from '../../actions/default';
import { makeSelectUsers, } from '../../selectors/default';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

interface IUserListComponentProps {
  match: IMatch,
}

interface IUserListProps extends IUserListComponentProps {
  addUser: (user: Record<IUser>) => void;
  deleteUser: (userId: number) => void;
  users: Map<number, Record<IUser>>;
}

const addUser = (user: Record<IUser>) => new AddUserAction({ user });
const deleteUser = (userId: number) => new DeleteUserAction({ userId });

const UserList: React.FC<IUserListProps> = (props) => {
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');

  const {
    addUser,
    deleteUser,
    users,
  } = props;

  return (
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
            <FormControl error={error != ''}>
              <TextField
                label='name'
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setError('');
                }}
              />
              <FormHelperText>{error}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item={true}
          >
            <Button
              variant='outlined'
              onClick={
                () => {
                  if ( textInput ) {
                    addUser(
                      UserFactory({
                        name: textInput,
                      }),
                    );
                    setTextInput('');
                  } else {
                    setError("Required");
                  }
                }
              }
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
  );
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({ addUser, deleteUser }, dispatch)
  };
};


export default compose<React.ComponentClass<IUserListComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(UserList);