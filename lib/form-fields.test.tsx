import { useForm } from "react-hook-form";
import { FormFields } from "./form-fields";

const TestComponent = () => {
	const form = useForm<{ lastName2: string }>({});

	return (
		<FormFields
			control={form.control}
			fields={[
				{
					label: "test",
					name: "lastName2",
					type: "text",
					size: 12,
				},
			]}
			render={() => <></>}
		/>
	);
};
