import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import type { FormField } from "./field";
import type { FormType } from "./form-config";

export type FormRenderProps = {
  fieldState: ControllerFieldState;
  field: ControllerRenderProps<FormType, string>;
  fieldConfig: FormField;
  control: Control<any>;
  onChangeField?: (name: string, value: any) => void;
};
