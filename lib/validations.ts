import { z } from "zod";
import type { FormField } from "./model/field";
import type { ValidateResult } from "react-hook-form";
import { format } from "date-fns";

export function validateField(
	value: any,
	fieldConfig: FormField,
): ValidateResult | Promise<ValidateResult> {
	let validation: z.ZodType | undefined;

	const requiredError = `O campo ${fieldConfig.label} é obrigatório`;

	switch (fieldConfig.type) {
		case "email":
			validation = z
				.string({ required_error: requiredError })
				.trim()
				.email(`O campo ${fieldConfig.label} não possui um e-mail valido.`);
			break;
		case "password": {
			let defaultPasswordValidation = z.string({
				required_error: requiredError,
			});

			if (fieldConfig.required) {
				defaultPasswordValidation = defaultPasswordValidation.min(
					6,
					`O campo ${fieldConfig.label} precisa ter ao menos 6 caracteres.`,
				);
			}

			validation = defaultPasswordValidation;
			break;
		}
		case "text": {
			let defaultTextValidation = z
				.string({ required_error: requiredError })
				.trim();

			if (fieldConfig.required) {
				defaultTextValidation = defaultTextValidation.min(1, requiredError);
			}

			validation = defaultTextValidation;
			break;
		}
		case "select": {
			let defaultOptionsValidation = z
				.string({ required_error: requiredError })
				.or(z.number({ required_error: requiredError }));

			if (fieldConfig.required) {
				defaultOptionsValidation = z
					.string({ required_error: requiredError })
					.min(1, requiredError)
					.or(z.number({ required_error: requiredError }));
			}

			validation = defaultOptionsValidation.refine(
				(val: any) =>
					!val ||
					fieldConfig.options?.some(
						(options) => options.value.toString() === val.toString(),
					),
				"Selecione uma opção válida",
			);
			break;
		}
		case "switch":
		case "checkbox": {
			const defaultBooleanValidation = z.boolean({
				required_error: requiredError,
			});

			if (fieldConfig.required)
				validation = defaultBooleanValidation.refine(
					(element) => element === true,
					{ message: requiredError },
				);
			else validation = defaultBooleanValidation;
			break;
		}
		case "multi-select":
		case "multi-checkbox": {
			let defaultMultiOptionsValidation = z
				.union([z.string(), z.number()])
				.array();

			if (fieldConfig.required) {
				defaultMultiOptionsValidation = defaultMultiOptionsValidation.min(
					1,
					requiredError,
				);
			}

			validation = defaultMultiOptionsValidation.refine(
				(val: any[]) =>
					val.length === 0 ||
					!val ||
					val.every((v) =>
						fieldConfig.options?.some(
							(option) => option.value.toString() === v.toString(),
						),
					),
				{
					message: "Selecione ao menos uma opção válida",
				},
			);
			break;
		}
		case "date": {
			let defaultDateValidation = z.date({
				required_error: requiredError,
				description: requiredError,
				invalid_type_error: requiredError,
			});

			if (fieldConfig.min !== undefined) {
				defaultDateValidation = defaultDateValidation.min(
					new Date(
						fieldConfig.min.getFullYear(),
						fieldConfig.min.getMonth(),
						fieldConfig.min.getDate(),
					),
					`O campo ${fieldConfig.label} não atende a data mínima de ${format(fieldConfig.min, "dd/MM/yyyy")}`,
				);
			}

			if (fieldConfig.max !== undefined) {
				defaultDateValidation = defaultDateValidation.max(
					new Date(
						fieldConfig.max.getFullYear(),
						fieldConfig.max.getMonth(),
						fieldConfig.max.getDate(),
					),
					`O campo ${fieldConfig.label} não atende a data máxima de ${format(fieldConfig.max, "dd/MM/yyyy")}`,
				);
			}

			validation = defaultDateValidation;
			break;
		}
		case "datetime": {
			let defaultDateValidation = z.date({
				required_error: requiredError,
				description: requiredError,
				invalid_type_error: requiredError,
			});

			if (fieldConfig.min !== undefined)
				defaultDateValidation = defaultDateValidation.min(
					new Date(
						fieldConfig.min.getFullYear(),
						fieldConfig.min.getMonth(),
						fieldConfig.min.getDate(),
						fieldConfig.min.getHours(),
						fieldConfig.min.getMinutes(),
					),
					`O campo ${fieldConfig.label} não atende a data mínima de ${format(fieldConfig.min, "dd/MM/yyyy HH:mm")}`,
				);

			if (fieldConfig.max !== undefined)
				defaultDateValidation = defaultDateValidation.max(
					new Date(
						fieldConfig.max.getFullYear(),
						fieldConfig.max.getMonth(),
						fieldConfig.max.getDate(),
						fieldConfig.max.getHours(),
						fieldConfig.max.getMinutes(),
					),
					`O campo ${fieldConfig.label} não atende a data máxima de ${format(fieldConfig.max, "dd/MM/yyyy HH:mm")}`,
				);

			validation = defaultDateValidation;
			break;
		}
		case "time":
			validation = z
				.date({
					required_error: requiredError,
					description: requiredError,
					invalid_type_error: requiredError,
				})
				.refine(
					(element) =>
						fieldConfig.min === undefined ||
						element.getHours() > fieldConfig.min.getHours() ||
						(element.getHours() === fieldConfig.min.getHours() &&
							element.getMinutes() >= fieldConfig.min.getMinutes()),
					`O campo ${fieldConfig.label} não atende o tempo mínimo de ${format(fieldConfig.min || new Date(), "HH:mm")}`,
				)
				.refine(
					(element) =>
						fieldConfig.max === undefined ||
						element.getHours() < fieldConfig.max.getHours() ||
						(element.getHours() === fieldConfig.max.getHours() &&
							element.getMinutes() <= fieldConfig.max.getMinutes()),
					`O campo ${fieldConfig.label} não atende o tempo máximo de ${format(fieldConfig.max || new Date(), "HH:mm")}`,
				);
			break;
		case "month":
			validation = z
				.date({
					required_error: requiredError,
					description: requiredError,
					invalid_type_error: requiredError,
				})
				.refine(
					(element) =>
						fieldConfig.min === undefined ||
						element.getFullYear() > fieldConfig.min.getFullYear() ||
						(element.getFullYear() === fieldConfig.min.getFullYear() &&
							element.getMonth() >= fieldConfig.min.getMonth()),
					`O campo ${fieldConfig.label} não atende o período mínimo de ${format(fieldConfig.min || new Date(), "MM/yyyy")}`,
				)
				.refine(
					(element) =>
						fieldConfig.max === undefined ||
						element.getFullYear() < fieldConfig.max.getFullYear() ||
						(element.getFullYear() === fieldConfig.max.getFullYear() &&
							element.getMonth() <= fieldConfig.max.getMonth()),
					`O campo ${fieldConfig.label} não atende o período máximo de ${format(fieldConfig.max || new Date(), "MM/yyyy")}`,
				);
			break;
		case "number": {
			let defaultNumberValidation = z.coerce.number({
				required_error: requiredError,
				invalid_type_error: requiredError,
			});

			if (fieldConfig.min !== undefined) {
				defaultNumberValidation = defaultNumberValidation.min(
					fieldConfig.min,
					`O campo ${fieldConfig.label} não atende o valor mínimo de ${fieldConfig.min}`,
				);
			}

			if (fieldConfig.max !== undefined) {
				defaultNumberValidation = defaultNumberValidation.max(
					fieldConfig.max,
					`O campo ${fieldConfig.label} não atende o valor máximo de ${fieldConfig.max}`,
				);
			}

			validation = defaultNumberValidation.refine(
				(number) => !fieldConfig.required || Boolean(number),
				requiredError,
			);

			break;
		}
		case "color": {
			let defaultColorValidation = z.string({ required_error: requiredError });

			if (value) {
				defaultColorValidation = defaultColorValidation.regex(
					/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
					"Informe uma cor válida",
				);
			}

			if (fieldConfig.required) {
				defaultColorValidation = defaultColorValidation.min(1, requiredError);
			}

			validation = defaultColorValidation;
			break;
		}
		case "hyperlink": {
			let defaultHyperlinkOptions = z
				.object({
					label: z
						.string()
						.trim()
						.transform((element) => {
							if (fieldConfig.formatText) {
								if (fieldConfig.formatText === "upperCase") {
									return element.toUpperCase();
								}
								if (fieldConfig.formatText === "lowerCase") {
									return element.toLowerCase();
								}
								return (
									element.charAt(0).toUpperCase() +
									element.slice(1).toLowerCase()
								);
							}
							return element;
						}),
					value: z.string().trim(),
				})
				.array();

			if (fieldConfig.required) {
				defaultHyperlinkOptions = defaultHyperlinkOptions.min(1, requiredError);
			}

			validation = defaultHyperlinkOptions;
			break;
		}
		case "dynamic-checkbox": {
			let defaultDynamicOptions = z
				.object({
					label: z.string().trim(),
					value: z.boolean(),
				})
				.array();

			if (fieldConfig.required) {
				defaultDynamicOptions = defaultDynamicOptions.min(1, requiredError);
			}

			validation = defaultDynamicOptions;
			break;
		}
		case "rate":
			validation = z.coerce
				.number({
					required_error: requiredError,
					invalid_type_error: requiredError,
				})
				.max(
					fieldConfig.max || 5,
					`O campo ${fieldConfig.label} não atende o valor máximo de ${fieldConfig.max}`,
				)
				.refine(
					(number) => !fieldConfig.required || Boolean(number),
					requiredError,
				);
			break;
		default:
			validation = z.any();
			break;
	}

	if (validation) {
		if (!fieldConfig.required) {
			validation = validation.optional();
		}
		const validationResult = validation.safeParse(value);
		if (validationResult.success === false) {
			return validationResult.error.issues
				.map((issue) => issue.message)
				.join("\n");
		}

		if (fieldConfig.validate) return fieldConfig.validate(value);
	}
}
