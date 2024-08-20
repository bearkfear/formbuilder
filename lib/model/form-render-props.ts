import type {
	Control,
	ControllerFieldState,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";
import type { FormField } from "./field"; 

export type FormRenderProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	fieldState: ControllerFieldState;
	field: ControllerRenderProps<TFieldValues, TName>;
	fieldConfig: FormField<TFieldValues, TName>;
	control: Control<TFieldValues>;
	onChangeField?: (name: string, value: any) => void;
};
