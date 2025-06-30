import { type ReactNode } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import type {
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";

type Props<TFieldValues extends FieldValues> = {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  name: Path<TFieldValues>;
} & UseFormRegisterReturn;

export function Field<TFieldValues extends FieldValues>({
  label,
  description,
  ...props
}: Props<TFieldValues>) {
  return (
    <FormField
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <input
              className="border-input bg-background w-full rounded-md border px-3 py-2"
              placeholder="username"
              {...field}
            />
          </FormControl>
          <FormDescription>{description}.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
      {...props}
    />
  );
}
