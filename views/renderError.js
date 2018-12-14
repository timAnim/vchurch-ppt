
function renderError(err){
 var res = `<!DOCTYPE html>
	 <html>
	 <head>
	 	<meta charset=utf-8>
	 	<meta name=viewport content="width=device-width,initial-scale=1">
	 	<title>出错了</title>
	 </head>
	 <body>
	 	<h1>${err.message}</h1>
	 	<h2>${err.status}</h2>
	 	<pre>${err.stack}</pre>
	 </body>
	 </html>`
	return res
}

module.exports = renderError