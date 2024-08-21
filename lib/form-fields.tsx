"use client";

import { Controller, type FieldPath, type FieldValues } from "react-hook-form";
import type { FormConfig } from "./model/form-config";
import { validateRules } from "./utilities";
import { validateField } from "./validations";
import type { FormField } from "./model/field";
import { useEffect } from "react";
import { type FormStore, type Store, useFormStoreApi } from "./use-form-store";

export type FieldControllerProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<FormConfig<TFieldValues>, "fields"> & {
	fieldConfig: FormField<TFieldValues, TName>;
	storeApi: Store;
};

function FieldController<TFieldValues extends FieldValues = FieldValues>({
	fieldConfig,
	requiredFields = {},
	control,
	onChangeField,
	render: RenderItem,
	storeApi,
}: FieldControllerProps<TFieldValues>) {
	useEffect(() => {


		const state = storeApi.getState()

		if (!state[fieldConfig.name]) {
			return;
		}

		const isActive =
			!fieldConfig.hidden &&
			validateRules(fieldConfig, requiredFields, state);

		if (state[fieldConfig.name].active === isActive) {
			return;
		}
		storeApi.setState(() => {
			return {
				[fieldConfig.name]: { active: isActive },
			};
		});
	}, [fieldConfig, requiredFields, storeApi]);

	const fieldState = storeApi((selector) => selector[fieldConfig.name]);

	if (!fieldState || fieldState.active === false) return null;
	return (
		<Controller
			key={fieldConfig.name}
			name={fieldConfig.name}
			control={control}
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
	const storeApi = useFormStoreApi();

	useEffect(() => {
		const fieldsState = storeApi.getState();

		const fieldsNotInState = fields.filter(
			(fieldConfig) => !fieldsState[fieldConfig.name],
		);

		if (fieldsNotInState.length === 0) {
			return;
		}

		storeApi.setState(() => {
			return fieldsNotInState.reduce<FormStore>((acc, curr) => {
				acc[curr.name] = { active: true };

				return acc;
			}, {});
		});
	}, [storeApi, fields]);

	return (
		<>
			{fields.map((fieldConfig) => (
				<FieldController
					{...props}
					key={fieldConfig.name}
					fieldConfig={fieldConfig}
					storeApi={storeApi}
				/>
			))}
		</>
	);
}
