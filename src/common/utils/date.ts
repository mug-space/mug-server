export const sleepTime = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
