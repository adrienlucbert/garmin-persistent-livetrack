// Uncomment to test page loader animation
export async function load() {
	return new Promise((fulfil) => {
		setTimeout(fulfil, 1000);
	});
}
