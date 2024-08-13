import {
	createContext,
	useContext,
	useMemo,
	type PropsWithChildren,
} from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";

export type FormStoreItem = {
	active: boolean;
};

export type FormStore = Record<string, FormStoreItem>;

function storeGenerator() {
	return create<Record<string, FormStoreItem>>(() => ({}));
}

export const formStore = createContext<UseBoundStore<StoreApi<FormStore>>>(
	storeGenerator(),
);

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const FormStoreProvider = ({ children }: PropsWithChildren<{}>) => {
	const storeApi = useMemo(storeGenerator, []);

	return <formStore.Provider value={storeApi}>{children}</formStore.Provider>;
};

export function useFormStoreApi() {
	return useContext(formStore);
}
