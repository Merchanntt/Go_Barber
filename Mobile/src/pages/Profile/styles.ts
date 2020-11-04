import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  text-align: left;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const AvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const AvatarButtonImage = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const ButtonContainer = styled.View`
  margin-top: 40px;
  flex-direction: row;
  justify-content: space-between;
`;

export const BackButton = styled.TouchableOpacity``;
