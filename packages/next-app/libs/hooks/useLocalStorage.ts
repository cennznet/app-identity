import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue?: T) {
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	useEffect(() => {
		const storedValue = window.localStorage.getItem(key);

		if (!!storedValue) setStoredValue(JSON.parse(storedValue));
	}, [key, setStoredValue]);

	const setValue = (value: T) => {
		setStoredValue(value);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(key, JSON.stringify(value));
		}
	};

	return [storedValue, setValue] as const;
}
