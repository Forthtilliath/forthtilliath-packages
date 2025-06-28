import { Form as ShadForm } from "../form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createContext } from "react";
import {
  type DefaultValues,
  type FieldValues,
  useForm,
} from "react-hook-form";
import type { z } from "zod/v4";

type Props<TFieldValues extends FieldValues> = {
  schema: z.ZodType<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
  onSubmit: (data: z.output<z.ZodType<TFieldValues>>) => void;
  className?: string;
  children: React.ReactNode;
};

function useFormContext<T>(value: T) {
  return createContext<T>(value);
}

export function Form<TFieldValues extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
  className,
}: Props<TFieldValues>): React.ReactNode {
  const form = useForm<z.infer<typeof schema>>({
    resolver: standardSchemaResolver(schema),
    defaultValues: defaultValues,
  });

  const { register, handleSubmit } = form;
  const FormContext = useFormContext({register});

  return (
    <ShadForm {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FormContext.Provider value={{ register }}>
          {children}
        </FormContext.Provider>
      </form>
    </ShadForm>
  );
}
