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
			type: "date";
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
	  }
	| {
			type: "file";
			multiple?: boolean;
	  };
