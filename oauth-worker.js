// Resume Game OAuth Worker
// Deploy this to Cloudflare Workers, then add two environment variables:
//   GITHUB_CLIENT_ID     = Ov23lisEcC91IW26DZIX
//   GITHUB_CLIENT_SECRET = (from your GitHub OAuth App page — never share this)

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/callback') {
      const code  = url.searchParams.get('code')
      const state = url.searchParams.get('state') // encoded return URL

      if (!code) return new Response('Missing authorization code', { status: 400 })

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      })

      const data = await tokenRes.json()
      if (data.error) return new Response(`GitHub error: ${data.error_description}`, { status: 400 })

      const returnUrl = state
        ? decodeURIComponent(state)
        : 'https://jiyunkim.github.io/gamed_resume/setup.html'

      // Pass token via URL fragment — never sent to any server
      return Response.redirect(`${returnUrl}#gh_token=${data.access_token}`, 302)
    }

    return new Response('Not found', { status: 404 })
  }
}
