import type { FieldPath, FieldValues } from "react-hook-form";
import type { FieldSettingsByType } from "./field-settings-by-type";
import type { Rule } from "./rule";
import type { ValidateFieldResult } from "./types";

export type FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	hidden?: boolean;
	validate?: (value: any) => ValidateFieldResult;
	name: TName;
	label?: string;
	required?: boolean;
	leftAddon?: React.ReactNode; // Conteúdo para ser exibido à esquerda do rótulo
	rightAddon?: React.ReactNode; // Conteúdo para ser exibido à direita do rótulo
	disabled?: boolean;
	size: number;
	placeholder?: string;
	helperText?: string;
	className?: string;
	style?: React.CSSProperties;
	/**
	 * If returns true, whould activate field
	 */
	rules?: Rule[];
} & FieldSettingsByType;
