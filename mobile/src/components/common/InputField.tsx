// src/components/common/InputField.tsx
import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { TextInputProps } from 'react-native-paper'; // Importar o tipo de props

interface InputFieldProps extends Omit<TextInputProps, 'theme' | 'error'> {
  name: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  label: string;
  rules?: object;
  error?: FieldError;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  label,
  rules,
  error,
  secureTextEntry = false,
  ...rest
}) => {
  const { colors } = useTheme();
  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }: { field: { onChange: (value: string) => void; onBlur: () => void; value: string } }) => (
          <TextInput
            label={label}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            error={!!error}
            style={{ marginBottom: error ? 0 : 10 }} // Ajuste para espaço do HelperText
            {...rest} // Passa outras props do TextInput como keyboardType, autoCapitalize etc.
          />
        )}
        name={name}
      />
      {error && (
        <HelperText type="error" visible={!!error} style={{ marginBottom: 5 }}>
          {error.message}
        </HelperText>
      )}
    </>
  );
};

export default InputField;