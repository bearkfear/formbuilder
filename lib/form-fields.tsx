import { Controller, useFormState } from "react-hook-form";
import type { FormConfig } from "./model/form-config";
import { isRulesValid } from "./utilities";
import { validateField } from "./validations";

export function FormFields({
	fields,
	control,
	shouldUnregister,
	requiredFields,
	render: RenderItem,
	onChangeField,
}: FormConfig) {
	const { dirtyFields } = useFormState({ control });

	return (
		<>
			{fields.map((fieldConfig) => {
				if (
					fieldConfig.hidden ||
					isRulesValid(fieldConfig, requiredFields || {}, dirtyFields) === false
				) {
					return null;
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
