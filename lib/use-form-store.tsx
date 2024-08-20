"use client";


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

export type Store = UseBoundStore<StoreApi<FormStore>>;

function storeGenerator() {
	return create<Record<string, FormStoreItem>>(() => ({}));
}

export const formStore = createContext<Store>(
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
