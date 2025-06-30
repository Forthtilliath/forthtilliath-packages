import { Form as ShadForm } from "../form";
import {
  type DefaultValues,
  type FieldValues,
  useForm,
  type UseFormRegister,
} from "react-hook-form";
import type { z } from "zod/v4";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

type Props<TFieldValues extends FieldValues> = {
  schema: z.ZodType<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
  onSubmit: (data: TFieldValues) => void;
  className?: string;
  children: ({
    register,
  }: {
    register: UseFormRegister<TFieldValues>;
  }) => React.ReactNode;
};

export function Form<TFieldValues extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
  className,
}: Props<TFieldValues>): React.ReactNode {
  const form = useForm<TFieldValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: defaultValues,
  });

  const { register, handleSubmit } = form;

  return (
    <ShadForm {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {children({ register })}
      </form>
    </ShadForm>
  );
}
