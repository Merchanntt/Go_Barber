import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import DatePicker from '@react-native-community/datetimepicker';

import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProviderListContainer,
  ProviderList,
  ProviderContainer,
  ProviderImage,
  ProviderName,
  Calendar,
  Title,
  CalendarButton,
  CalendarButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  AppointmentButton,
  AppointmentButtonText,
} from './styles';

interface ProviderId {
  providerId: string;
}

export interface ProvidersData {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityData {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [providers, setProviders] = useState<ProvidersData[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const route = useRoute();

  const router = route.params as ProviderId;
  const [selectedProvider, setSelectedProvider] = useState(router.providerId);

  useEffect(() => {
    api.get('barbers').then((response) => setProviders(response.data));
  }, []);

  useEffect(() => {
    api
      .get(`barbers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const NavigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleProviderSelected = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDatePicker = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const mornigAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ available, hour }) => {
        return {
          hour,
          available,
          formatedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoomAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ available, hour }) => {
        return {
          hour,
          available,
          formatedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const handleHourSelected = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('appointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar o agendamento',
        'Ocorreu um erro ao criar seu agendamento, tente novamente',
      );
    }
  }, [selectedProvider, selectedDate, selectedHour, navigate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={NavigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Barbeiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProviderListContainer>
          <ProviderList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleProviderSelected(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderImage source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProviderListContainer>

        <Calendar>
          <Title>Escolha uma data</Title>

          <CalendarButton onPress={handleToggleDatePicker}>
            <CalendarButtonText>Selecionar outra data</CalendarButtonText>
          </CalendarButton>

          {showDatePicker && (
            <DatePicker
              mode="date"
              onChange={handleDatePicker}
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha um horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {mornigAvailability.map(({ formatedHour, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  onPress={() => handleHourSelected(hour)}
                  available={available}
                  key={formatedHour}
                >
                  <HourText selected={selectedHour === hour}>
                    {formatedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoomAvailability.map(
                ({ formatedHour, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    onPress={() => handleHourSelected(hour)}
                    available={available}
                    key={formatedHour}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formatedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <AppointmentButton onPress={handleCreateAppointment}>
          <AppointmentButtonText>Agendar</AppointmentButtonText>
        </AppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
