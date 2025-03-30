import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Form({ isEditMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    ISBN: "",
    publicationYear: "",
    genres: [],
    formats: { paperback: false, ebook: false, audiobook: false },
    languages: [],
    pageCount: "",
    ratings: [],
    publisher: {
      name: "",
      location: {
        city: "",
        country: "",
      },
    },
    tags: [],
    isBestseller: false,
    availability: { status: "in-stock", stock: 0 },
  });

  const { data, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/${id}`
  );

  useEffect(() => {
    if (isEditMode && data) {
      setFormData({
        title: data?.title || "",
        author: data?.author || "",
        ISBN: data?.ISBN || "",
        publicationYear: data?.publicationYear || "",
        genres: data?.genres || [],
        formats: data?.formats || { paperback: false, ebook: false, audiobook: false },
        languages: data?.languages || [],
        pageCount: data?.pageCount || "",
        ratings: data?.ratings || [],
        publisher: {
          name: data?.publisher?.name || "",
          location: {
            city: data?.publisher?.location?.city || "",
            country: data?.publisher?.location?.country || "",
          },
        },
        tags: data?.tags || [],
        isBestseller: data?.isBestseller || false,
        availability: {
          status: data?.availability?.status || "in-stock",
          stock: data?.availability?.stock || 0,
        },
      });
    }
  }, [isEditMode, id, data]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isEditMode) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          navigate(`/details/${id}`);
          refetch();
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          navigate("/");
        } else {
          const errorData = await response.json();
          console.error("Error posting book:", errorData);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // Helper function to handle changes to nested objects
  const handleNestedChange = (parentKey, childKey, value) => {
    setFormData({
      ...formData,
      [parentKey]: {
        ...formData[parentKey],
        [childKey]: value,
      },
    });
  };

  // Helper function to handle changes to deeply nested objects
  const handleDeepNestedChange = (parentKey, nestedKey, childKey, value) => {
    setFormData({
      ...formData,
      [parentKey]: {
        ...formData[parentKey],
        [nestedKey]: {
          ...formData[parentKey][nestedKey],
          [childKey]: value,
        },
      },
    });
  };

  return (
    <div className="card shadow border-0">
      <div className="card-body p-4">
        <h2 className="card-title mb-4">
          {isEditMode ? "Edit Book Details" : "Add New Book"}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className="form-control"
              name="title"
              id="title"
              placeholder="Enter book title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="form-label">
              Author:
            </label>
            <input
              type="text"
              className="form-control"
              name="author"
              id="author"
              placeholder="Enter author name"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="ISBN" className="form-label">
              ISBN:
            </label>
            <input
              type="text"
              className="form-control"
              name="ISBN"
              id="ISBN"
              placeholder="13-digit ISBN"
              value={formData.ISBN}
              onChange={(e) =>
                setFormData({ ...formData, ISBN: e.target.value })
              }
              required
              minLength={13}
              maxLength={13}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="publicationYear" className="form-label">
              Publication Year:
            </label>
            <input
              type="number"
              className="form-control"
              name="publicationYear"
              id="publicationYear"
              placeholder="e.g., 2023"
              value={formData.publicationYear}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publicationYear: e.target.value ? parseInt(e.target.value) : "",
                })
              }
              min={1450}
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="genres" className="form-label">
              Genres:
            </label>
            <div className="d-flex flex-wrap gap-3">
              {["fiction", "non-fiction", "sci-fi", "biography", "history", "fantasy"].map(
                (genre) => (
                  <div key={genre} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`genre-${genre}`}
                      checked={formData.genres.includes(genre)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            genres: [...formData.genres, genre],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            genres: formData.genres.filter((g) => g !== genre),
                          });
                        }
                      }}
                    />
                    <label htmlFor={`genre-${genre}`} className="form-check-label">
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Formats:</label>
            <div className="d-flex gap-3">
              {Object.keys(formData.formats).map((format) => (
                <div key={format} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`format-${format}`}
                    checked={formData.formats[format]}
                    onChange={(e) => {
                      handleNestedChange("formats", format, e.target.checked);
                    }}
                  />
                  <label htmlFor={`format-${format}`} className="form-check-label">
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="languages" className="form-label">
              Languages:
            </label>
            <div className="d-flex flex-wrap gap-3">
              {[
                { code: "en", name: "English" },
                { code: "es", name: "Spanish" },
                { code: "fr", name: "French" },
                { code: "de", name: "German" },
                { code: "zh", name: "Chinese" },
              ].map((language) => (
                <div key={language.code} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`language-${language.code}`}
                    checked={formData.languages.includes(language.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          languages: [...formData.languages, language.code],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          languages: formData.languages.filter(
                            (l) => l !== language.code
                          ),
                        });
                      }
                    }}
                  />
                  <label
                    htmlFor={`language-${language.code}`}
                    className="form-check-label"
                  >
                    {language.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="pageCount" className="form-label">
              Page Count:
            </label>
            <input
              type="number"
              className="form-control"
              name="pageCount"
              id="pageCount"
              placeholder="e.g., 256"
              value={formData.pageCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pageCount: e.target.value ? parseInt(e.target.value) : "",
                })
              }
              min={1}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Publisher:</label>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Publisher Name"
                  value={formData.publisher.name}
                  onChange={(e) =>
                    handleNestedChange("publisher", "name", e.target.value)
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="City"
                  value={formData.publisher.location.city}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "publisher",
                      "location",
                      "city",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Country"
                  value={formData.publisher.location.country}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "publisher",
                      "location",
                      "country",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="form-label">
              Tags:
            </label>
            <input
              type="text"
              className="form-control"
              name="tags"
              id="tags"
              placeholder="e.g., bestseller, award-winning, classic (comma-separated)"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(",").map((tag) => tag.trim().toLowerCase()),
                })
              }
            />
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isBestseller"
              id="isBestseller"
              checked={formData.isBestseller}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isBestseller: e.target.checked,
                })
              }
            />
            <label htmlFor="isBestseller" className="form-check-label">
              Bestseller
            </label>
          </div>

          <div className="mb-4">
            <label className="form-label">Availability:</label>
            <div className="row g-3">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={formData.availability.status}
                  onChange={(e) =>
                    handleNestedChange("availability", "status", e.target.value)
                  }
                  required
                >
                  <option value="">Select Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="pre-order">Pre-order</option>
                </select>
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock Quantity"
                  value={formData.availability.stock}
                  onChange={(e) =>
                    handleNestedChange(
                      "availability",
                      "stock",
                      e.target.value ? parseInt(e.target.value) : 0
                    )
                  }
                  min={0}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            {isEditMode ? "Save Changes" : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}