import { useState } from 'react'

const blankMovie = {
  title: '',
  director: '',
  genre: '',
  release_year: '',
  rating: '',
  description: '',
  image: '',
}

function MovieForm({ movie, onClose, onSave, busy, error }) {
  const [form, setForm] = useState(movie ? {
    title: movie.title ?? '',
    director: movie.director ?? '',
    genre: movie.genre ?? '',
    release_year: movie.release_year ?? '',
    rating: movie.rating ?? '',
    description: movie.description ?? '',
    image: movie.image ?? '',
  } : blankMovie)
  const [method, setMethod] = useState('PATCH')
  const [errors, setErrors] = useState({})

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function submitForm(event) {
    event.preventDefault()
    const nextErrors = {}
    for (const field of ['title', 'director', 'genre', 'release_year', 'rating', 'description', 'image']) {
      if (!String(form[field]).trim()) nextErrors[field] = 'This field is required.'
    }
    const year = Number(form.release_year)
    if (form.release_year && (!Number.isInteger(year) || year < 1888 || year > new Date().getFullYear() + 10)) {
      nextErrors.release_year = 'Enter a valid four-digit year.'
    }
    const rating = Number(form.rating)
    if (form.rating && (!Number.isFinite(rating) || rating < 0 || rating > 10)) {
      nextErrors.rating = 'Rating must be between 0 and 10.'
    }
    if (form.image && !/^https?:\/\//i.test(form.image.trim())) {
      nextErrors.image = 'Enter a complete image URL starting with http:// or https://.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    onSave({
      ...form,
      title: form.title.trim(),
      director: form.director.trim(),
      genre: form.genre.trim(),
      release_year: year,
      rating,
      description: form.description.trim(),
      image: form.image.trim(),
    }, method)
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="dialog-header">
          <div>
            <p className="dialog-kicker">{movie ? 'UPDATE YOUR ARCHIVE' : 'ADD TO YOUR ARCHIVE'}</p>
            <h2 id="form-title">{movie ? 'Edit movie' : 'Add a movie'}</h2>
          </div>
          <button className="close-button" type="button" aria-label="Close form" onClick={onClose}>×</button>
        </div>
        <form onSubmit={submitForm} noValidate>
          <div className="form-grid">
            <label className="form-field field-full">Title
              <input name="title" value={form.title} onChange={updateField} placeholder="e.g. Interstellar" aria-invalid={Boolean(errors.title)} />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </label>
            <label className="form-field field-full">Director
              <input name="director" value={form.director} onChange={updateField} placeholder="Director name" aria-invalid={Boolean(errors.director)} />
              {errors.director && <span className="field-error">{errors.director}</span>}
            </label>
            <label className="form-field">Genre
              <input name="genre" value={form.genre} onChange={updateField} list="movie-genres" placeholder="Pick or type" aria-invalid={Boolean(errors.genre)} />
              <datalist id="movie-genres">{['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Science Fiction'].map((genre) => <option key={genre} value={genre} />)}</datalist>
              {errors.genre && <span className="field-error">{errors.genre}</span>}
            </label>
            <label className="form-field">Release year
              <input name="release_year" type="number" inputMode="numeric" value={form.release_year} onChange={updateField} placeholder="2014" aria-invalid={Boolean(errors.release_year)} />
              {errors.release_year && <span className="field-error">{errors.release_year}</span>}
            </label>
            <label className="form-field field-full">Rating <span className="label-hint">out of 10</span>
              <input name="rating" type="number" min="0" max="10" step="0.1" inputMode="decimal" value={form.rating} onChange={updateField} placeholder="8.7" aria-invalid={Boolean(errors.rating)} />
              {errors.rating && <span className="field-error">{errors.rating}</span>}
            </label>
            <label className="form-field field-full">Description
              <textarea name="description" rows="3" value={form.description} onChange={updateField} placeholder="A few words about the film..." aria-invalid={Boolean(errors.description)} />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </label>
            <label className="form-field field-full">Image URL
              <input name="image" type="url" value={form.image} onChange={updateField} placeholder="https://images.example.com/poster.jpg" aria-invalid={Boolean(errors.image)} />
              {errors.image && <span className="field-error">{errors.image}</span>}
            </label>
          </div>
          {form.image && /^https?:\/\//i.test(form.image) && (
            <div className="image-preview"><img src={form.image} alt="Movie poster preview" onError={(event) => event.currentTarget.classList.add('image-failed')} /><span>Poster preview</span></div>
          )}
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          <div className="dialog-actions form-actions">
            {movie && <label className="method-select">Update using
              <select value={method} onChange={(event) => setMethod(event.target.value)}><option value="PATCH">PATCH</option><option value="PUT">PUT</option></select>
            </label>}
            <span className="action-spacer" />
            <button className="button button-quiet" type="button" onClick={onClose} disabled={busy}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Saving...' : movie ? 'Save changes' : 'Add movie'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default MovieForm