import React, { useRef, useCallback } from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import api from '../../services/api';
import validateErrors from '../../utils/validateError';

import Input from '../../components/Input';
import Button from '../../components/Button';

import LogoImg from '../../assets/logo.png';

import { Container, Title, SignUpButton, SignUpButtonText } from './style';

interface SignUpDataProps {
  email: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);

  const handleSingUpSubmit = useCallback(
    async (data: SignUpDataProps) => {
      try {
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

        navigation.goBack();

        Alert.alert(
          'E-mail enviado com sucesso!',
          'Cheque seu e-mail e siga as intruções para recuperar seu acesso',
        );
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = validateErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro enviar e-mail',
          'Ocorreu um erro ao enviar e-mail. Por Favor, tente novamente',
        );
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={LogoImg} />

            <View>
              <Title>Recuperar senha</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSingUpSubmit}>
              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Recuperar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <SignUpButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#ff9000" />
        <SignUpButtonText>Voltar para logon</SignUpButtonText>
      </SignUpButton>
    </>
  );
};

export default SignUp;
