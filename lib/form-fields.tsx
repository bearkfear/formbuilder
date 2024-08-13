import { Controller, type FieldPath, type FieldValues } from "react-hook-form";
import type { FormConfig } from "./model/form-config";
import { isRulesValid } from "./utilities";
import { validateField } from "./validations";
import { type Store, useFormStoreApi } from "./use-form-store";
import type { FormField } from "./model/field";
import { useEffect, useMemo } from "react";

export type FieldControllerProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<FormConfig<TFieldValues>, "fields"> & {
	fieldConfig: FormField<TFieldValues, TName>;
	formStoreApi: Store;
};

function FieldController<TFieldValues extends FieldValues = FieldValues>({
	formStoreApi,
	fieldConfig,
	requiredFields,
	control,
	shouldUnregister,
	onChangeField,
	render: RenderItem,
}: FieldControllerProps<TFieldValues>) {
	const fieldState = formStoreApi.getState()[fieldConfig.name];

	const isActive = useMemo(() => {
		if (
			fieldConfig.hidden ||
			isRulesValid(fieldConfig, requiredFields || {}) === false
		) {
			return false;
		}

		return true;
	}, [requiredFields, fieldConfig]);

	useEffect(() => {
		if (!fieldState) {
			formStoreApi.setState(() => ({
				[fieldConfig.name]: { active: true },
			}));
			return;
		}

		if (fieldState.active !== isActive) {
			formStoreApi.setState(() => ({
				[fieldConfig.name]: { active: isActive },
			}));
		}
	}, [formStoreApi, fieldState, isActive, fieldConfig]);

	return (
		<Controller
			key={fieldConfig.name}
			name={fieldConfig.name}
			control={control}
			shouldUnregister={shouldUnregister}
			rules={{ validate: (value) => validateField(value, fieldConfig) }}
			render={({ fieldState, field }) => (
				<RenderItem
					{...{ field, fieldState, fieldConfig, onChangeField, control }}
				/>
			)}
		/>
	);
}

export function FormFields<TFieldValues extends FieldValues = FieldValues>({
	fields,
	...props
}: FormConfig<TFieldValues>) {
	const formStoreApi = useFormStoreApi();

	return (
		<>
			{fields.map((fieldConfig) => (
				<FieldController
					{...props}
					key={fieldConfig.name}
					fieldConfig={fieldConfig}
					formStoreApi={formStoreApi}
				/>
			))}
		</>
	);
}
