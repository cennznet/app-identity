const fetchTwitterHandle = async (twitterId: string) =>
	await fetch(`/api/auth/twitterHandle`, {
		method: "post",
		body: JSON.stringify({ twitterId }),
	})
		.then((res) => res.json())
		.then((data) => data);

export default fetchTwitterHandle;
