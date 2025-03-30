import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Details() {
  const { id } = useParams();

  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/books/${id}`
  );

  // Calculate average rating
  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <main className="container my-5">
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {data && (
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4 shadow">
              <div className="card-body text-center py-5">
                <h1 className="display-1 text-muted">
                  <i className="bi bi-book"></i>
                </h1>
                <h5 className="card-title">{data.title}</h5>
                <p className="card-text">by {data.author}</p>
              </div>
              {data.isBestseller && (
                <div className="card-footer bg-warning text-center">
                  <strong>BESTSELLER</strong>
                </div>
              )}
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5>Book Details</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>ISBN:</span>
                  <span>{data.ISBN}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Published:</span>
                  <span>{data.publicationYear}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Decade:</span>
                  <span>{data.decade}s</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Pages:</span>
                  <span>{data.pageCount}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Publisher:</span>
                  <span>{data.publisher?.name || "N/A"}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Location:</span>
                  <span>
                    {data.publisher?.location
                      ? `${data.publisher.location.city}, ${data.publisher.location.country}`
                      : "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-8">
            <h2 className="mb-1">{data.title}</h2>
            <h5 className="text-muted mb-4">by {data.author}</h5>

            <div className="mb-4">
              {data.genres &&
                data.genres.map((genre, idx) => (
                  <span key={idx} className="badge bg-primary me-2">
                    {genre}
                  </span>
                ))}
              <span
                className={`badge ${
                  data.availability.status === "in-stock"
                    ? "bg-success"
                    : data.availability.status === "pre-order"
                    ? "bg-warning"
                    : "bg-danger"
                } me-2`}
              >
                {data.availability.status}
              </span>
              {data.isBestseller && (
                <span className="badge bg-warning">Bestseller</span>
              )}
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Rating</h5>
                    <p className="card-text fs-4">
                      {getAverageRating(data.ratings)}/5
                      <small className="d-block text-muted">
                        ({data.ratings?.length || 0} reviews)
                      </small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Stock</h5>
                    <p className="card-text fs-4">
                      {data.availability.stock}
                      <small className="d-block text-muted">
                        copies available
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h4>Available Formats</h4>
            <ul className="list-group mb-4">
              {data.formats.paperback && (
                <li className="list-group-item">
                  <i className="bi bi-book-fill text-primary me-2"></i>
                  Paperback
                </li>
              )}
              {data.formats.ebook && (
                <li className="list-group-item">
                  <i className="bi bi-tablet-fill text-success me-2"></i>
                  E-Book
                </li>
              )}
              {data.formats.audiobook && (
                <li className="list-group-item">
                  <i className="bi bi-headphones text-info me-2"></i>
                  Audiobook
                </li>
              )}
            </ul>

            {data.languages && data.languages.length > 0 && (
              <>
                <h4>Available Languages</h4>
                <ul className="list-group mb-4">
                  {data.languages.map((lang, index) => (
                    <li key={index} className="list-group-item">
                      {lang === "en" && "English"}
                      {lang === "es" && "Spanish"}
                      {lang === "fr" && "French"}
                      {lang === "de" && "German"}
                      {lang === "zh" && "Chinese"}
                      {!["en", "es", "fr", "de", "zh"].includes(lang) && lang}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {data.tags && data.tags.length > 0 && (
              <>
                <h4>Tags</h4>
                <div className="mb-4">
                  {data.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary me-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}

            {data.ratings && data.ratings.length > 0 && (
              <>
                <h4>Recent Ratings</h4>
                <table className="table table-striped mb-4">
                  <thead>
                    <tr>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ratings.slice(0, 5).map((rating, index) => (
                      <tr key={index}>
                        <td>
                          {Array(rating.score)
                            .fill()
                            .map((_, i) => (
                              <i
                                key={i}
                                className="bi bi-star-fill text-warning"
                              ></i>
                            ))}
                        </td>
                        <td>{new Date(rating.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <h4>Book Information</h4>
            <table className="table table-striped mb-4">
              <tbody>
                <tr>
                  <th scope="row">Created</th>
                  <td>{new Date(data.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th scope="row">Last Updated</th>
                  <td>{new Date(data.updatedAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="d-flex gap-2">
              <Link to="/" className="btn btn-secondary">
                Back to Books
              </Link>
              <Link to={`/update/${data._id}`} className="btn btn-primary">
                Edit
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
