import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug. 2. we will return an error message on exception in your
 *    code, instead of the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {
    mapRequestToAsset: req => {
      // First let's apply the default handler, which we imported from
      // '@cloudflare/kv-asset-handler'
      let defaultAssetKey = mapRequestToAsset(req)

      // Now let's make an adjustment for requests to root
      if (defaultAssetKey.url.endsWith('/')) {
        defaultAssetKey.url += 'index.html'
      }

      return defaultAssetKey
    },
  }

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }

    const asset = await getAssetFromKV(event, options)

    // You can add custom logic here to handle the response
    // For example, you can add headers, modify the response, etc.

    return asset
  } catch (e) {
    // If an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), {
      status: 500,
    })
  }
}
