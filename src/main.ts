import { initApp } from './App'

const port = process.env.PORT || 8000
// tslint:disable-next-line: no-floating-promises
initApp().then((app) => {
	// tslint:disable-next-line: no-floating-promises
	app.listen(port, () => {
		// tslint:disable-next-line: no-console
		console.info(`> Listening on ${port}`)
	})
})
