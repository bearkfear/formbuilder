import { Controller } from "react-hook-form";
import type { FormConfig } from "./model/form-config";
import { isRulesValid } from "./utilities";
import { validateField } from "./validations";
import { useFormStoreApi } from "./use-form-store";

export function FormFields({
	fields,
	control,
	shouldUnregister,
	requiredFields,
	render: RenderItem,
	onChangeField,
}: FormConfig) {
	const formStoreApi = useFormStoreApi();

	return (
		<>
			{fields.map((fieldConfig) => {
				const fieldState = formStoreApi.getState()[fieldConfig.name];

				if (
					fieldConfig.hidden ||
					isRulesValid(fieldConfig, requiredFields || {}) === false
				) {
					if (!fieldState || (fieldState && fieldState.active === true)) {
						formStoreApi.setState(() => ({
							[fieldConfig.name]: { active: false },
						}));
					}

					return null;
				}

				if (!fieldState || (fieldState && fieldState.active === false)) {
					formStoreApi.setState(() => ({
						[fieldConfig.name]: { active: true },
					}));
				}

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
			})}
		</>
	);
}
