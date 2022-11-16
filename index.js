const express = require("express")
const {
	createProxyMiddleware,
	responseInterceptor,
} = require("http-proxy-middleware")
const { matchPath } = require("react-router")

const PORT = 3030
const SFRA_INSTANCE_ORIGIN = `https://zzrx-031.dx.commercecloud.salesforce.com`
const PWA_ORIGIN = "https://haven-production.mobify-storefront.com"

// Update the PWA routes
const PWA_ROUTES = [
	{
		path: "/",
		exact: true,
	},
	{
		path: "/callback",
	},
	{
		path: "/product/:productId",
	},
	{
		path: "/search",
	},
	{
		path: "/category/:categoryId",
	},
	{
		path: "/:locale/product/:productId",
	},
	{
		path: "/:locale/search",
	},
	{
		path: "/:locale/category/:categoryId",
	},
	{
		path: "/:site/:locale/product/:productId",
	},
	{
		path: "/:site/:locale/search",
	},
	{
		path: "/:site/:locale/category/:categoryId",
	},
]

const options = {
	target: SFRA_INSTANCE_ORIGIN,
	secure: false,
	changeOrigin: true,
	autoRewrite: true,
	hostRewrite: true,
	cookieDomainRewrite: true,
	router: req => {
		const match = PWA_ROUTES.some(route => {
			return matchPath(req.path, route)
		})

		if (match || req.path.startsWith("/mobify")) {
			return PWA_ORIGIN
		}

		return SFRA_INSTANCE_ORIGIN
	},
	selfHandleResponse: true,
	onProxyRes: (proxyRes, req, res) => {
		return responseInterceptor(async responseBuffer => {
			if (!proxyRes.headers["content-type"]?.includes("html")) {
				return responseBuffer
			}
			const response = responseBuffer.toString()
			return (
				response
					// some links are absolute URLs
					// replace them so they go through the proxy
					.replace(
						new RegExp(`${SFRA_INSTANCE_ORIGIN}`, "g"),
						`https://cc-hybrid-app.herokuapp.com`
					)
			)
		})(proxyRes, req, res)
	},
}

const app = express()

app.use(createProxyMiddleware(options))

app.listen(PORT, err => {
	if (err) throw err
	console.log(`Proxy server listening: https://cc-hybrid-app.herokuapp.com`)
})
