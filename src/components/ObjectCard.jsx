function ObjectCard({ object }) {
  const primaryImage =
    object.primaryImage || object._images?._primary_thumbnail;
  const fallbackImage =
    object.primaryImageSmall || object._images?._primary_thumbnail;
  const objectURL = object.objectURL || "#";
  const artistOrCulture =
    object.artistDisplayName ||
    object._primaryMaker?.name ||
    object.culture ||
    "Unknown";

  return (
    <div className="object-card">
      {primaryImage ? (
        <img
          src={primaryImage}
          alt={object._primaryTitle || object.title || "Artwork"}
          width="150"
        />
      ) : (
        <a href={objectURL} target="_blank" rel="noopener noreferrer">
          <img
            src="missing-image-placeholder.jpg"
            alt="View on Museum Site"
            width="150"
          />
        </a>
      )}
      <h3>{object._primaryTitle || object.title}</h3>
      <p>{artistOrCulture}</p>
      {object.objectID && <p>Met Object ID: {object.objectID}</p>}{" "}
    </div>
  );
}

export default ObjectCard;
