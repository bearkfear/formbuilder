import type { Option } from "./option";

export type FieldSettingsByType =
	| {
			type: "text";
			masks?: string | string[];
			maxLength?: number;
	  }
	| {
			type: "email" | "password" | "textarea" | "editor";
			autoComplete?: string;
	  }
	| {
			type: "checkbox" | "money" | "date" | "switch";
	  }
	| {
			type: "number";
			maxLength?: number;
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
	  };
