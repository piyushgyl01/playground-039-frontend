import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Home() {
  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/books`
  );

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/books/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          refetch();
        }
      } catch (error) {
        throw error;
      }
    }
  }

  // Calculate average rating for a book
  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className="container my-5">
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

      <div className="row">
        {data &&
          data.map((book) => (
            <div className="col-md-4 mb-4" key={book._id}>
              <div className="card h-100">
                <div className="card-header">
                  {book.isBestseller && (
                    <span className="badge bg-warning float-end">
                      Bestseller
                    </span>
                  )}
                  <h5 className="card-title mb-0">{book.title}</h5>
                  <p className="text-muted mb-0">by {book.author}</p>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    {book.genres.map((genre, idx) => (
                      <span key={idx} className="badge bg-primary me-1">
                        {genre}
                      </span>
                    ))}
                    <span
                      className={`badge ms-1 ${
                        book.availability.status === "in-stock"
                          ? "bg-success"
                          : book.availability.status === "pre-order"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {book.availability.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="card-text mb-1">
                      <strong>ISBN:</strong> {book.ISBN}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Published:</strong> {book.publicationYear}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Pages:</strong> {book.pageCount}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Rating:</strong> {getAverageRating(book.ratings)}{" "}
                      / 5
                      {book.ratings && book.ratings.length > 0 && (
                        <small className="text-muted ms-1">
                          ({book.ratings.length} reviews)
                        </small>
                      )}
                    </p>
                  </div>

                  <div className="mb-2">
                    <h6>Available Formats</h6>
                    <div className="d-flex gap-1 mb-3">
                      {book.formats.paperback && (
                        <span className="badge bg-secondary">Paperback</span>
                      )}
                      {book.formats.ebook && (
                        <span className="badge bg-secondary">E-Book</span>
                      )}
                      {book.formats.audiobook && (
                        <span className="badge bg-secondary">Audiobook</span>
                      )}
                    </div>
                  </div>

                  {book.tags && book.tags.length > 0 && (
                    <>
                      <h6>Tags</h6>
                      <ul className="list-group list-group-flush mb-3">
                        {book.tags.slice(0, 3).map((tag, index) => (
                          <li key={index} className="list-group-item py-1">
                            {tag}
                          </li>
                        ))}
                        {book.tags.length > 3 && (
                          <li className="list-group-item py-1 text-muted">
                            +{book.tags.length - 3} more tags
                          </li>
                        )}
                      </ul>
                    </>
                  )}

                  <div className="d-flex mt-auto">
                    <Link
                      to={`/details/${book._id}`}
                      className="btn btn-primary flex-grow-1"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="btn btn-danger ms-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="card-footer text-muted">
                  <small>Stock: {book.availability.stock} copies</small>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
