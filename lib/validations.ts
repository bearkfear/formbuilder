import { z } from "zod";
import type { FormField } from "./model/field";
import type { ValidateResult } from "react-hook-form";

export function validateField(
  value: any,
  fieldConfig: FormField
): ValidateResult | Promise<ValidateResult> {
  let validation: z.ZodType | undefined;

  const requiredError = `O campo ${fieldConfig.label} é obrigatório`;

  switch (fieldConfig.type) {
    case "email":
      validation = z
        .string({ required_error: requiredError })
        .email(`O campo ${fieldConfig.label} não possui um e-mail valido.`);
      break;
    case "password":
      validation = z
        .string({ required_error: requiredError })
        .min(
          6,
          `O campo ${fieldConfig.label} precisa ter ao menos 6 caracteres.`
        );
      break;
    case "text":
      validation = z
        .string({ required_error: requiredError })
        .min(1, requiredError);
      break;
    case "select":
      validation = z
        .string({ required_error: requiredError })
        .min(1, requiredError)
        .or(z.number())
        .refine(
          (val: any) =>
            fieldConfig.options?.some(
              (options) => options.value.toString() === val.toString()
            ),
          "Selecione uma opção válida"
        );
      break;
    case "multi-select":
      validation = z
        .array(z.union([z.string(), z.number()]))
        .nonempty(requiredError)
        .refine(
          (val: any[]) =>
            val.every((v) =>
              fieldConfig.options?.some(
                (option) => option.value.toString() === v.toString()
              )
            ),
          {
            message: "Selecione ao menos uma opção válida",
          }
        );
      break;
    case "date":
      validation = z.string({
        required_error: requiredError,
        description: requiredError,
        invalid_type_error: requiredError,
      });
      break;
    case "number":
      validation = z.coerce.number({
        required_error: requiredError,
        invalid_type_error: requiredError,
      });
      break;
    default:
      validation = z.any();
      break;
  }

  if (!fieldConfig.required) return true;

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
  }
}
