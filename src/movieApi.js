const moviesUrl = import.meta.env.VITE_MOCKAPI_URL?.trim().replace(/\/$/, '')

async function request(url, options) {
  if (!url) throw new Error('Configure VITE_MOCKAPI_URL in .env before managing movies.')

  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }

  if (response.status === 204) return null
  return response.json()
}

export function getMovies() {
  return request(moviesUrl)
}

export function createMovie(movie) {
  return request(moviesUrl, { method: 'POST', body: JSON.stringify(movie) })
}

export function updateMovie(id, movie, method = 'PATCH') {
  return request(`${moviesUrl}/${encodeURIComponent(id)}`, { method, body: JSON.stringify(movie) })
}

export function deleteMovie(id) {
  return request(`${moviesUrl}/${encodeURIComponent(id)}`, { method: 'DELETE' })
}