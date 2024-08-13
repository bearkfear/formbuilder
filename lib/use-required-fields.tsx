import type { UseFormWatch } from "react-hook-form";
import { useMemo } from "react";
import type { FormField } from "./model/field";
import { useFormStoreApi } from "./use-form-store";
import { useStore } from "zustand";

function getRequiredFieldNames(fields: FormField[][]) {
	return fields.reduce<string[]>((acc, curr) => {
		for (const field of curr) {
			if (field.rules) {
				for (const rule of field.rules) {
					acc.push(rule.dependentFieldName);
				}
			}
		}
		return acc;
	}, []);
}

export function useRequiredFieldsByRules(
	watch?: UseFormWatch<any>,
	...fields: FormField[][]
): Record<string, any> {
	const formStoreApi = useFormStoreApi();

	const formStoreState = useStore(formStoreApi);

	return useMemo(() => {
		if (!watch) {
			console.warn("watch is required");
			return {};
		}

		const requiredFieldNames = getRequiredFieldNames(fields);
		if (requiredFieldNames.length === 0) return {};

		const requiredFieldValues = watch(requiredFieldNames);

		return requiredFieldValues.reduce<
			Record<string, { value: any; active: boolean }>
		>((acc, curr, index) => {
			acc[requiredFieldNames[index]] = {
				active:
					!formStoreState[requiredFieldNames[index]] ||
					(formStoreState[requiredFieldNames[index]] &&
						formStoreState[requiredFieldNames[index]].active),
				value: curr,
			};
			return acc;
		}, {});
	}, [fields, watch, formStoreState]);
}
