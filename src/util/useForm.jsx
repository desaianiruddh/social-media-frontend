import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const onChange = (e) => {
    let { name, value } = e.target;
    if (name === 'userName' || name === 'email') value = value.trim();
    setValues({ ...values, [name]: value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };
  return {
    onChange,
    onSubmit,
    values,
  };
};
