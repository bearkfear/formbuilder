"use client";

import type { UseFormWatch } from "react-hook-form";
import { useMemo } from "react";
import type { FormField } from "./model/field";

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
	return useMemo(() => {
		if (!watch) {
			console.warn("watch is required");
			return {};
		}

		const requiredFieldNames = getRequiredFieldNames(fields);
		if (requiredFieldNames.length === 0) return {};

		const requiredFieldValues = watch(requiredFieldNames);

		return requiredFieldValues.reduce<Record<string, any>>(
			(acc, curr, index) => {
				acc[requiredFieldNames[index]] = curr;
				return acc;
			},
			{},
		);
	}, [fields, watch]);
}
