import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import LogoImg from '../../assets/logo.svg';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import { Container, Content, Background, ContainerAnimation } from './style';

import validateErrors from '../../utils/validateError';
import api from '../../services/api';

interface ForgotPasswordData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const history = useHistory();

  const onHandleSubmit = useCallback(
    async (data: ForgotPasswordData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail enviado com sucesso',
          description:
            'Um e-mail de verificação foi enviado, cheque sua caixa de entrada para dar continuidade a sua recuperação',
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
            'Ocorreu um erro ao tentar recuperar sua senha. Por favor, tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <ContainerAnimation>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={onHandleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar para logon
          </Link>
        </ContainerAnimation>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
