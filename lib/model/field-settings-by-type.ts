import type { ReactNode } from "react";
import type { Option } from "./option";

export type FieldSettingsByType =
	| {
			type: "text";
			masks?: string | string[];
			maxLength?: number;
			suffix?: ReactNode;
			prefix?: ReactNode;
	  }
	| {
			type: "email" | "password" | "textarea" | "editor";
			autoComplete?: string;
	  }
	| {
			type: "checkbox" | "switch";
			valueLabels?: {
				true: string;
				false: string;
			};
	  }
	| {
			type: "money" | "color";
	  }
	| {
			type: "hyperlink";
			formatText?: "upperCase" | "lowerCase" | "capitalized";
	  }
	| {
			type: "datetime" | "time" | "date" | "month";
			dateNow?: boolean;
			min?: Date;
			max?: Date;
	  }
	| {
			type: "number";
			min?: number;
			max?: number;
	  }
	| {
			type: "multi-select" | "select";
			searchable?: boolean;
			disableOption?: ((option: Option) => boolean) | Option["value"][];
			extraActions?: React.ReactNode;
			options?: Option[];
	  }
	| {
			type: "radio";
			options?: Option[];
			position?: "vertical" | "horizontal";
	  }
	| {
			type: "dynamic-checkbox";
			checklist?: boolean;
	  }
	| {
			type: "multi-checkbox";
			options?: Option[];
			checklist?: boolean;
			position?: "vertical" | "horizontal";
	  }
	| {
			type: "file";
			multiple?: boolean;
	  }
	| {
			type: "rate";
			size?: "small" | "normal" | "medium" | "large";
			max?: number;
			showScore?: boolean;
			showText?: string[];
	  };
