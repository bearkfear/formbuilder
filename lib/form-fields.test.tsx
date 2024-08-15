import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useRequiredFieldsByRules } from "./use-required-fields";
import { Condition } from "./model/conditions";
import { FormFields } from "./form-fields";
import { useForm } from "react-hook-form";
import type { FormRenderProps } from "./model/form-render-props";
import userEvent from "@testing-library/user-event";
import { FormStoreProvider } from "./use-form-store";

function SimpleRender(props: FormRenderProps<any>) {
	if (props.fieldConfig.type === "text") {
		return (
			<input
				type={props.fieldConfig.type}
				placeholder={props.fieldConfig.placeholder}
				id={props.fieldConfig.name}
				value={props.field.value}
				onChange={props.field.onChange}
				data-testid={props.field.name}
				onBlur={props.field.onBlur}
				disabled={props.field.disabled}
			/>
		);
	}

	return (
		<select
			id={props.fieldConfig.name}
			value={props.field.value}
			onChange={props.field.onChange}
			data-testid={props.field.name}
			onBlur={props.field.onBlur}
			disabled={props.field.disabled}
		/>
	);
}

function ExampleForm() {
	const form = useForm<any>({ values: { one: "", two: "" } });

	const fields = [
		{ label: "1", name: "one", size: 12, type: "text" },
		{
			label: "2",
			name: "two",
			size: 12,
			type: "select",
			rules: [
				{
					dependentFieldName: "one",
					condition: Condition.EQUALS,
					value: "1",
				},
			],
		},
	];

	const requiredFieldsByRules = useRequiredFieldsByRules(form.watch, fields);

	return (
		<FormFields
			fields={fields}
			control={form.control}
			render={SimpleRender}
			requiredFields={requiredFieldsByRules}
		/>
	);
}

const ExampleFormWithProvider = () => (
	<FormStoreProvider>
		<ExampleForm />
	</FormStoreProvider>
);

describe("form fields form builder", () => {
	// it("should render one field and two field", async () => {
	// 	const { container } = render(<ExampleFormWithProvider />);

	// 	const input = container.querySelector("#one");

	// 	if (!input) throw new Error("Should find element `one`");
	// 	const input2 = container.querySelector("#two");

	// 	await userEvent.type(input, "1");

	// 	expect(input).toBeTruthy();
	// 	expect(input2).toBeTruthy();
	// });

	it("should render the field `one` only", async () => {
		const { container } = render(<ExampleFormWithProvider />);

		const input = container.querySelector("#one");
		if (!input) throw new Error("Should find element `one`");
		const input2 = container.querySelector("#two");

		await userEvent.type(input, "2");

		expect(input).toBeTruthy();
		expect(input2).toBeFalsy();
	});
});
