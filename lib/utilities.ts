import { Condition } from "./model/conditions";
import type { FormField } from "./model/field";
import type { FormStore } from "./use-form-store";

/**
 * Verifica se as regras de validação em um objeto de configuração são atendidas com base nos valores fornecidos.
 *
 * @param config - O objeto de configuração que contém as regras de validação.
 * @param requiredFields - Um registro de campos obrigatórios com seus respectivos valores.
 * @returns `true` se pelo menos uma regra for válida, ou `true` se não houver regras definidas.
 */
export function validateRules(
	config: FormField,
	requiredFields: Record<string, any>,
	formStore: FormStore,
): boolean {
	// Verifica se o objeto de configuração tem regras definidas.

	if (!config.rules) return true;
	if (config.rules.length === 0) return true;

	// Utiliza o método 'some()' para verificar se pelo menos uma regra é válida.
	return config.rules.some((rule) => {
		// Verifica se o valor da regra não é indefinido ou nulo.
		if (rule.value === undefined || rule.value === null) return false;

		// Obtém o valor do campo dependente.
		const dependentFieldValue = requiredFields[rule.dependentFieldName];

		const dependentFieldState = formStore[rule.dependentFieldName];

		if (
			!dependentFieldState ||
			(dependentFieldState && dependentFieldState.active === false)
		)
			return false;

		// Avalia a condição da regra em relação ao valor do campo dependente.
		switch (rule.condition) {
			case Condition.MAJOR:
				return dependentFieldValue > rule.value;
			case Condition.MINOR:
				return dependentFieldValue < rule.value;
			case Condition.EQUALS:
				return dependentFieldValue === rule.value;
			case Condition.DIFFERENT:
				return dependentFieldValue !== rule.value;
			case Condition.MAJOR_OR_EQUAL:
				return dependentFieldValue >= rule.value;
			case Condition.MINOR_OR_EQUAL:
				return dependentFieldValue <= rule.value;
			default:
				return false; // Se a condição não for reconhecida, a regra é considerada inválida.
		}
	});
}
