import type { FieldSettingsByType } from "./field-settings-by-type";
import type { Rule } from "./rule";

export type FormField<FieldName = string> = {
  name: FieldName;
  label: string;
  required?: boolean;
  leftAddon?: React.ReactNode; // Conteúdo para ser exibido à esquerda do rótulo
  rightAddon?: React.ReactNode; // Conteúdo para ser exibido à direita do rótulo
  disabled?: boolean;
  size: number;
  placeholder?: string;
  helperText?: string;
  className?: string;
  /**
   * If returns true, whould activate field
   */
  rules?: Rule[];
} & FieldSettingsByType;
