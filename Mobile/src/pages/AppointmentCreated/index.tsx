import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Lottie from 'lottie-react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';
import check from '../../assets/check.json';

interface DateParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as DateParams;

  const handleResetNavigation = useCallback(() => {
    reset({
      routes: [{ name: 'dashBoard' }],
      index: 0,
    });
  }, [reset]);

  const formatedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      { locale: ptBR },
    );
  }, [routeParams.date]);

  return (
    <Container>
      <Lottie
        source={check}
        autoSize
        autoPlay
        resizeMode="contain"
        loop={false}
      />
      <Title>Agendamento concluído</Title>
      <Description>{formatedDate}</Description>

      <OkButton onPress={handleResetNavigation}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
