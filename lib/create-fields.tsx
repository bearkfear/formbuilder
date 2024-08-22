import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { FormField } from "./model/field";

export function createFields<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(control: Control<TFieldValues>, fields: FormField<TFieldValues, TName>[]) {
  return fields;
}
