import React, { useCallback, useRef, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import LogoImg from '../../assets/logo.svg';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import { Container, Content, ContainerAnimation } from './style';

import validateErrors from '../../utils/validateError';
import api from '../../services/api';

interface ResponseAuthData {
  password: string;
  password_confirmation: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const onHandleSubmit = useCallback(
    async (data: ResponseAuthData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação inválida',
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        const token = location.search.replace('?token=', '');

        const { password, password_confirmation } = data;

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        addToast({
          type: 'success',
          title: 'Recuperção realizada com sucesso!',
          description: 'Você já pode logar na sua conta Go Barber.',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = validateErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação',
          description:
            'Ocorreu um erro ao tentar recuperar sua senha. Por Favor, tente novamente',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <ContainerAnimation>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={onHandleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
        </ContainerAnimation>
      </Content>
    </Container>
  );
};

export default SignIn;
