import {
  type DefaultValues,
  type FieldValues,
  useForm,
  type UseFormRegister,
} from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { z } from "zod/v4";

import { Form as ShadForm } from "@forthtilliath/shadcn-ui/components/form";

interface Props<TFieldValues extends FieldValues> {
  schema: z.ZodType<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
  onSubmit: (data: TFieldValues) => void;
  className?: string;
  children: ({
    register,
  }: {
    register: UseFormRegister<TFieldValues>;
  }) => React.ReactNode;
}

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
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {children({ register })}
      </form>
    </ShadForm>
  );
}
