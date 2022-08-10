import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useForm } from '../util/useForm';
import { login } from '../redux/userSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUser, {
    userName: '',
    password: '',
  });
  const [addUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, result) {
      navigate('/');
      dispatch(login(result.data.login));
      localStorage.setItem(
        'userToken',
        JSON.stringify(result?.data.login.token)
      );
    },
    onError(err) {
      setErrors(err?.graphQLErrors[0]?.extensions.errors);
    },
    variables: values,
  });
  function loginUser() {
    addUser();
  }
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="userName"
          type="text"
          value={values.userName}
          onChange={onChange}
          autoComplete="false"
          error={errors.userName ? true : false}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          autoComplete="false"
          error={errors.password ? true : false}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      id
      email
      userName
      token
    }
  }
`;

export default Login;
