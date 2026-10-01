function MovieDetail({ movie, onClose }) {
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="dialog-header">
          <div>
            <p className="dialog-kicker">FROM YOUR COLLECTION</p>
            <h2 id="detail-title">{movie.title}</h2>
          </div>
          <button className="close-button" type="button" aria-label="Close details" onClick={onClose}>×</button>
        </div>
        <div className="detail-content">
          <div className="detail-poster">
            <span>{movie.title}</span>
            {movie.image && <img src={movie.image} alt={`${movie.title} poster`} onError={(event) => event.currentTarget.classList.add('image-failed')} />}
          </div>
          <div className="detail-copy">
            <p className="detail-rating"><span>★</span> {Number(movie.rating).toFixed(1)} <span className="rating-out-of">/ 10</span></p>
            <dl>
              <div><dt>Director</dt><dd>{movie.director}</dd></div>
              <div><dt>Genre</dt><dd>{movie.genre}</dd></div>
              <div><dt>Year</dt><dd>{movie.release_year}</dd></div>
            </dl>
            <p className="detail-description">{movie.description}</p>
          </div>
        </div>
        <div className="dialog-actions"><button className="button button-quiet" onClick={onClose}>Close</button></div>
      </section>
    </div>
  )
}

export default MovieDetail