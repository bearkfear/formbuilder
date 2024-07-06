import type { Control } from "react-hook-form";
import type { FormField } from "./field";
import type { FormRenderProps } from "./form-render-props";

export interface FormConfig<TName = string> {
  fields: FormField<TName>[];
  control: Control<any>;
  shouldUnregister?: boolean;
  requiredFields?: Record<string, any>;
  onChangeField?: (name: string, value: any) => void;
  render?: (props: FormRenderProps) => React.ReactElement;
}

export type FormType = Record<FormField["name"], any>;
