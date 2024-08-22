import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useRequiredFieldsByRules } from "./use-required-fields";
import { Condition } from "./model/conditions";
import { FormFields } from "./form-fields";
import { useForm } from "react-hook-form";
import type { FormRenderProps } from "./model/form-render-props";
import userEvent from "@testing-library/user-event";
import { FormStoreProvider } from "./use-form-store";
import { createFields } from "./create-fields";

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
        name={props.field.name}
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
  const form = useForm({ values: { one: "", two: "" } });

  const fields = createFields(form.control, [
    { label: "1", name: "one", size: 12, type: "text" },
    {
      label: "2",
      size: 12,
      name: "two",
      type: "text",
      rules: [
        {
          dependentFieldName: "one",
          condition: Condition.EQUALS,
          value: "1",
        },
      ],
    },
  ]);

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

function StressForm() {
  const form = useForm<any>({
    defaultValues: {},
  });

  return (
    <FormFields
      render={SimpleRender}
      control={form.control}
      fields={new Array(1000).fill(0).map((_, index) => ({
        type: "text",
        label: `${index}_field`,
        size: 4,
        name: `${index}_field`,
      }))}
    />
  );
}

const ExampleFormWithProvider = () => (
  <FormStoreProvider>
    <ExampleForm />
  </FormStoreProvider>
);

const StreeFormWithProvider = () => {
  return (
    <FormStoreProvider>
      <StressForm />
    </FormStoreProvider>
  );
};

describe("form fields form builder", () => {
  it("should render the one field and two field validating rules", async () => {
    const { container } = render(<ExampleFormWithProvider />);

    const input = container.querySelector("#one");

    if (!input) throw new Error("Should find element `one`");

    {
      const input2 = container.querySelector("#two");
      expect(input2).toBeFalsy();
    }

    await userEvent.type(input, "1");

    {
      const input2 = container.querySelector<HTMLInputElement>("#two");
      expect(input2).toBeTruthy();
      if (!input2) throw new Error("Should find element `one`");
      await userEvent.type(input2, "2");
    }

    {
      const input2 = container.querySelector<HTMLInputElement>("#two");
      if (!input2) throw new Error("Should find element `one`");
      expect(input2.value).toBe("2");
    }

    await userEvent.type(input, "{Backspace}1");

    const input2 = container.querySelector<HTMLInputElement>("#two");
    if (!input2) throw new Error("Should find element `one`");

    expect(input).toBeTruthy();
    expect(input2.value).toEqual("2");
  });

  it("should render the field `one` only", async () => {
    const { container } = render(<ExampleFormWithProvider />);

    const input = container.querySelector("#one");
    if (!input) throw new Error("Should find element `one`");
    const input2 = container.querySelector("#two");

    await userEvent.type(input, "2");

    expect(input).toBeTruthy();
    expect(input2).toBeFalsy();
  });

  it("should render the field `one` without the provider", async () => {
    const { container } = render(<ExampleForm />);

    const input = container.querySelector("#one");
    if (!input) throw new Error("Should find element `one`");
    const input2 = container.querySelector("#two");

    await userEvent.type(input, "2");

    expect(input).toBeTruthy();
    expect(input2).toBeFalsy();
  });

  it("should be possibly render 1000 fields", async () => {
    const { container } = render(<StreeFormWithProvider />);

    const fields = Array.from(
      container.querySelectorAll<HTMLInputElement>("input")
    ).map((field) => field.name);

    expect(fields.length).toBe(1000);
  });
});
