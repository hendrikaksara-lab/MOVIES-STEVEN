import { useEffect, useState } from 'react'
import './App.css'
import MovieCard from './components/MovieCard'
import MovieDetail from './components/MovieDetail'
import MovieForm from './components/MovieForm'
import { createMovie, deleteMovie, getMovies, updateMovie } from './movieApi'

const genres = ['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Science Fiction']
const apiConfigured = Boolean(import.meta.env.VITE_MOCKAPI_URL?.trim())

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(apiConfigured)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [query, setQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [ratingFilter, setRatingFilter] = useState('Any rating')
  const [activeDialog, setActiveDialog] = useState(null)
  const [busy, setBusy] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!apiConfigured) return

    getMovies()
      .then(setMovies)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  function openDialog(dialog) {
    setActionError('')
    setActiveDialog(dialog)
  }

  function closeDialog() {
    setActionError('')
    setActiveDialog(null)
  }

  const visibleMovies = movies.filter((movie) => {
    const searchText = `${movie.title} ${movie.director}`.toLowerCase()
    const matchesSearch = searchText.includes(query.trim().toLowerCase())
    const matchesGenre = genreFilter === 'All' || movie.genre.toLowerCase() === genreFilter.toLowerCase()
    const matchesRating = ratingFilter === 'Any rating' || Number(movie.rating) >= Number(ratingFilter)
    return matchesSearch && matchesGenre && matchesRating
  })

  async function handleSave(movieData, method) {
    setBusy(true)
    setError('')
    setActionError('')
    try {
      if (activeDialog.mode === 'edit') {
        const savedMovie = await updateMovie(activeDialog.movie.id, movieData, method)
        setMovies((current) => current.map((movie) => movie.id === savedMovie.id ? savedMovie : movie))
      } else {
        const newMovie = await createMovie(movieData)
        setMovies((current) => [newMovie, ...current])
      }
      setActiveDialog(null)
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(movie) {
    setBusy(true)
    setError('')
    setActionError('')
    try {
      await deleteMovie(movie.id)
      setMovies((current) => current.filter((item) => item.id !== movie.id))
      setActiveDialog(null)
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">A personal archive</p>
          <h1>My <span>Movie</span> Shelf</h1>
          <p className="intro">Keep track of everything you’ve watched and loved.</p>
        </div>
        <button className="button button-primary add-button" onClick={() => openDialog({ mode: 'add' })}>
          <span aria-hidden="true">+</span> Add movie
        </button>
      </header>

      <section className="collection-controls" aria-label="Search and filter movies">
        <label className="search-field">
          <span className="sr-only">Search by title or director</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or director..." />
        </label>
        <label className="rating-select">
          <span className="sr-only">Filter by minimum rating</span>
          <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
            <option>Any rating</option>
            <option value="8">8+ stars</option>
            <option value="7">7+ stars</option>
            <option value="6">6+ stars</option>
          </select>
        </label>
      </section>

      <nav className="genre-tabs" aria-label="Filter by genre">
        {['All', ...genres].map((genre) => (
          <button
            className={`genre-chip ${genreFilter === genre ? 'is-active' : ''}`}
            key={genre}
            onClick={() => setGenreFilter(genre)}
            aria-pressed={genreFilter === genre}
          >
            {genre}
          </button>
        ))}
      </nav>

      {error && <div className="notice notice-error" role="alert">{error}</div>}
      {!apiConfigured && (
        <section className="setup-panel">
          <span className="setup-index">01 / CONNECT YOUR SHELF</span>
          <h2>Your collection lives in MockAPI.</h2>
          <p>Create a <code>movies</code> resource, then add its endpoint to <code>.env</code> as <code>VITE_MOCKAPI_URL</code>.</p>
          <p className="setup-note">See the project README for the field list and the eight-movie seed command.</p>
        </section>
      )}
      {apiConfigured && loading && (
        <div className="loading-state" role="status"><span className="spinner" />Loading movies...</div>
      )}
      {apiConfigured && !loading && !error && (
        visibleMovies.length > 0 ? (
          <section className="movie-grid" aria-label="Movie collection">
            {visibleMovies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={index}
                onDetails={() => openDialog({ mode: 'details', movie })}
                onEdit={() => openDialog({ mode: 'edit', movie })}
                onDelete={() => openDialog({ mode: 'delete', movie })}
              />
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <span className="empty-mark">✳</span>
            <h2>{movies.length ? 'Nothing matches those filters.' : 'Your shelf is waiting.'}</h2>
            <p>{movies.length ? 'Try another search or genre.' : 'Add your first movie to start the collection.'}</p>
            {!movies.length && <button className="button button-primary" onClick={() => openDialog({ mode: 'add' })}>Add a movie</button>}
          </section>
        )
      )}

      {activeDialog?.mode === 'add' && <MovieForm onClose={closeDialog} onSave={handleSave} busy={busy} error={actionError} />}
      {activeDialog?.mode === 'edit' && <MovieForm movie={activeDialog.movie} onClose={closeDialog} onSave={handleSave} busy={busy} error={actionError} />}
      {activeDialog?.mode === 'details' && <MovieDetail movie={activeDialog.movie} onClose={closeDialog} />}
      {activeDialog?.mode === 'delete' && (
        <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeDialog()}>
          <section className="dialog delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <p className="dialog-kicker">REMOVE FROM YOUR SHELF</p>
            <h2 id="delete-title">Delete this movie?</h2>
            <p>Are you sure you want to delete <strong>“{activeDialog.movie.title}”</strong>? This can’t be undone.</p>
            {actionError && <div className="notice notice-error" role="alert">{actionError}</div>}
            <div className="dialog-actions">
              <button className="button button-quiet" onClick={closeDialog} disabled={busy}>Cancel</button>
              <button className="button button-danger" onClick={() => handleDelete(activeDialog.movie)} disabled={busy}>{busy ? 'Deleting...' : 'Delete movie'}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default App