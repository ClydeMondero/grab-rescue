import { Controller } from "react-hook-form";
import { Input, ErrorMessage } from "@/components";

const FormInput = ({ control, name, ...otherProps }: any) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <Input
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            {...otherProps}
          />
          {error && <ErrorMessage>{error.message}</ErrorMessage>}
        </>
      )}
    />
  );
};

export default FormInput;
