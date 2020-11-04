import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  width: 100%;
  height: 68px;
  background: #ff9000;
  border-radius: 10px;

  justify-content: center;
  align-items: center;

  margin-top: 12px;
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 18px;
`;
