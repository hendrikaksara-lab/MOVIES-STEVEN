function MovieCard({ movie, index, onDetails, onEdit, onDelete }) {
  return (
    <article className="movie-card" style={{ '--card-index': index }}>
      <div className="poster-frame">
        <div className="poster-fallback" aria-hidden="true">{movie.title}</div>
        {movie.image && <img src={movie.image} alt={`${movie.title} poster`} onError={(event) => event.currentTarget.classList.add('image-failed')} />}
        <span className="rating-badge">★ {Number(movie.rating).toFixed(1)}</span>
      </div>
      <div className="movie-card-info">
        <div className="card-heading">
          <h2>{movie.title}</h2>
          <span className="release-year">{movie.release_year}</span>
        </div>
        <p className="director-line">{movie.director}</p>
        <span className="genre-tag">{movie.genre}</span>
        <div className="card-actions">
          <button className="button button-small button-gold" onClick={onDetails}>Details</button>
          <button className="button button-small button-outline" onClick={onEdit}>Edit</button>
          <button className="button button-small button-outline button-delete" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </article>
  )
}

export default MovieCard