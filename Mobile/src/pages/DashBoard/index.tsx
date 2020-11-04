import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  ProfileName,
  ProfileButton,
  ProfileImage,
  ProviderList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderImage,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';

export interface ProvidersData {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<ProvidersData[]>([]);

  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    api.get('barbers').then((response) => setProviders(response.data));
  }, []);

  const profileNavigation = useCallback(() => {
    navigate('profile');
  }, [navigate]);

  const CreateAppointmentNavigation = useCallback(
    (providerId: string) => {
      navigate('createAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#312e38" />
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <ProfileName>{user.name}</ProfileName>
        </HeaderTitle>
        <ProfileButton onPress={profileNavigation}>
          <ProfileImage source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>
      <ProviderList
        data={providers}
        keyExtractor={(providers) => providers.id}
        ListHeaderComponent={<ProvidersListTitle>Barbeiros</ProvidersListTitle>}
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => CreateAppointmentNavigation(provider.id)}
          >
            <ProviderImage source={{ uri: provider.avatar_url }} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18hr</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
