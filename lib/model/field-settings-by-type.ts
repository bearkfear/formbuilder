import type { ReactNode } from "react";
import type { Option } from "./option";

type Tokens = Record<
	string,
	{
		pattern?: RegExp;
		transform?: (value: string) => string;
		escape?: boolean;
	}
>;

export type FieldSettingsByType =
	| {
			type: "text";
			masks?: string | string[];
			tokens?: Tokens;
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
			type: "select";
			searchable?: boolean;
			onSearch?: (search: string) => void;
			disableOption?: ((option: Option) => boolean) | Option["value"][];
			extraActions?: React.ReactNode;
			options?: Option[];
			loadingOptions?: boolean;
			page?: number;
			onChangePage?: (page: number) => void;
			onCloseSelect?: () => void;
	  }
	| {
			type: "multi-select";
			checkAll?: boolean;
			searchable?: boolean;
			onSearch?: (search: string) => void;
			disableOption?: ((option: Option) => boolean) | Option["value"][];
			extraActions?: React.ReactNode;
			options?: Option[];
			loadingOptions?: boolean;
			page?: number;
			onChangePage?: (page: number) => void;
			onCloseSelect?: () => void;
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
			type: "rate";
			max?: number;
	  }
	| {
			type: "file";
			multiple?: boolean;
	  };
