import { readFile } from 'node:fs/promises'

const endpoint = process.env.VITE_MOCKAPI_URL?.trim().replace(/\/$/, '')

if (!endpoint || endpoint.includes('YOUR_PROJECT_ID')) {
  throw new Error('Set VITE_MOCKAPI_URL in .env to your MockAPI movies resource URL first.')
}

const seedFile = new URL('../public/seed-movies.json', import.meta.url)
const sampleMovies = JSON.parse(await readFile(seedFile, 'utf8'))
const existingResponse = await fetch(endpoint)

if (!existingResponse.ok) {
  throw new Error(`Could not read MockAPI (${existingResponse.status}). Check the movies resource URL.`)
}

const existingMovies = await existingResponse.json()
if (!Array.isArray(existingMovies)) throw new Error('MockAPI should return a list from the movies resource URL.')

let added = 0
for (const movie of sampleMovies) {
  const alreadyExists = existingMovies.some((existing) => existing.title?.toLowerCase() === movie.title.toLowerCase())
  if (alreadyExists) continue

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  })
  if (!response.ok) throw new Error(`Could not add "${movie.title}" (${response.status}).`)
  added += 1
  console.log(`Added ${movie.title}`)
}

console.log(`Done. Added ${added} movie${added === 1 ? '' : 's'}; ${existingMovies.length + added} now in MockAPI.`)