import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface FormFieldWrapperProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

export function FormFieldWrapper({
  control,
  name,
  label,
  placeholder,
  type = "text"
}: FormFieldWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}