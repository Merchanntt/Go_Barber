import styled, { css } from 'styled-components/native';
import FeatherIcons from 'react-native-vector-icons/Feather';

interface FocusedProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<FocusedProps>`
  width: 100%;
  height: 68px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: #232129;

  flex-direction: row;
  align-items: center;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #db2b39;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      border-color: #ff9000;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #f4ede8;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcons)`
  margin-right: 12px;
`;
