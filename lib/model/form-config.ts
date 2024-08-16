import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { FormField } from "./field";
import type { FormRenderProps } from "./form-render-props";

export interface FormConfig<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	fields: FormField<TFieldValues, TName>[];
	control: Control<TFieldValues>;
	requiredFields?: Record<string, any>;
	onChangeField?: (name: string, value: any) => void;
	render: (props: FormRenderProps<TFieldValues>) => React.ReactNode;
}

export type FormType = Record<FormField["name"], any>;
