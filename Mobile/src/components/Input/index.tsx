import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './style';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
}

interface InputReferenceValue {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const [isFocused, setFocused] = useState(false);
  const [isFilled, setFilled] = useState(false);

  const { registerField, fieldName, defaultValue = '', error } = useField(name);
  const inputValueRef = useRef<InputReferenceValue>({ value: defaultValue });

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [registerField, fieldName]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  const handleInputFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setFocused(false);

    setFilled(!!inputValueRef.current.value);
  }, []);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#666360"
        {...rest}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
      />
    </Container>
  );
};

export default forwardRef(Input);
