import { Controller } from "react-hook-form";
import type { FormConfig } from "./model/form-config";
import { isRulesValid } from "./utilities";
import { validateField } from "./validations";
import { type Store, useFormStoreApi } from "./use-form-store";
import type { FormField } from "./model/field";
import { useEffect, useMemo } from "react";

export type FieldControllerProps = Omit<FormConfig, "fields"> & {
	fieldConfig: FormField<string>;
	formStoreApi: Store;
};

function FieldController({
	formStoreApi,
	fieldConfig,
	requiredFields,
	control,
	shouldUnregister,
	onChangeField,
	render: RenderItem,
}: FieldControllerProps) {
	const fieldState = formStoreApi.getState()[fieldConfig.name];

	const isActive = useMemo(() => {
		if (
			fieldConfig.hidden ||
			isRulesValid(fieldConfig, requiredFields || {}) === false
		) {
			false;
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

export function FormFields({ fields, ...props }: FormConfig) {
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
