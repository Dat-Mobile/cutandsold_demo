const API_BASE_URL = 'https://saint-laurent.supplyandfriends.com/api/data/take-home'

const ALLOWED_ENDPOINTS = new Set([
  'get-feed-moves',
  'get-board-images',
  'get-board-image-filter-options',
  'get-move-details',
])

export default async function handler(request, response) {
  const endpoint = request.query.endpoint
  const authToken = process.env.TAKE_HOME_API_TOKEN

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    response.status(404).json({ error: 'Unknown take-home endpoint' })
    return
  }

  if (!authToken) {
    response.status(500).json({ error: 'Missing TAKE_HOME_API_TOKEN' })
    return
  }

  const upstreamUrl = new URL(`${API_BASE_URL}/${endpoint}`)

  for (const [key, value] of Object.entries(request.query)) {
    if (key === 'endpoint') continue
    if (Array.isArray(value)) {
      value.forEach((item) => upstreamUrl.searchParams.append(key, item))
    } else if (value !== undefined) {
      upstreamUrl.searchParams.set(key, value)
    }
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      Authorization: authToken,
    },
  })

  const body = await upstreamResponse.text()
  response.status(upstreamResponse.status)
  response.setHeader(
    'content-type',
    upstreamResponse.headers.get('content-type') || 'application/json',
  )
  response.send(body)
}
