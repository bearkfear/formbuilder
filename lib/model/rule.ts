import type { Condition } from "./conditions";

export interface Rule {
	dependentFieldName: string;
	condition: Condition;
	value: any;
}
