import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import placeholderImage from "../assets/placeholder-image.jpg";
import { getVAObjectById, getMetObjectById } from "../api";
import { getExhibitions, addToExhibition } from "../utils/exhibitionStorage";
import AddToExhibitionModal from "./AddToExhibitionModal";
import { useSearch } from "../context/SearchContext";

function getObjectId(object) {
  return object.objectID || object.record.systemNumber || object.id;
}

function SingleObject() {
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  const navigate = useNavigate();
  const { objects: contextObjects } = useSearch();

  const initialObject =
    location.state?.object ||
    contextObjects.find((obj) => getObjectId(obj) === id) ||
    null;

  const [object, setObject] = useState(initialObject);
  const [loading, setLoading] = useState(!initialObject);
  const [imageSrc, setImageSrc] = useState(
    location.state?.imageSrc || placeholderImage
  );
  const [showModal, setShowModal] = useState(false);
  const [newExhibitionName, setNewExhibitionName] = useState("");
  const [selectedExhibition, setSelectedExhibition] = useState("");
  const [exhibitions, setExhibitions] = useState([]);
  const [addedConfirmationMessage, setAddedConfirmationMessage] =
    useState(null);

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  useEffect(() => {
    const isVAObject = id.startsWith("O");
    const fetchFn = isVAObject ? getVAObjectById : getMetObjectById;
    setLoading(true);
    fetchFn(id)
      .then((data) => {
        console.log("Fetched detailed object data:", data);
        setObject(data || null);
        if (isVAObject) {
          const vaHighResImage = data?.meta?.images?._iiif_image
            ? `${data.meta.images._iiif_image}full/full/0/default.jpg`
            : null;
          setImageSrc(
            vaHighResImage ||
              data?.meta?.images?._primary_thumbnail ||
              placeholderImage
          );
        } else {
          // For MET objects, if there's an image passed via route state, use it.
          setImageSrc(
            location.state?.imageSrc ||
              data.primaryImage ||
              data.primaryImageSmall ||
              placeholderImage
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching object:", error);
        setObject(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleClick = () => {
    // Allow clicking the image to re-navigate to the object detail page.
    navigate(`/object/${getObjectId(object)}`, {
      state: { object, imageSrc },
    });
  };

  const localAddToExhibition = () => {
    if (!newExhibitionName.trim() && !selectedExhibition) return;
    const exhibitionName = newExhibitionName.trim() || selectedExhibition;
    if (!exhibitionName) return;

    const objectData = id.startsWith("O")
      ? { ...object.record, image: imageSrc || placeholderImage }
      : { ...object, image: imageSrc || placeholderImage };

    const result = addToExhibition(exhibitionName, objectData);
    setAddedConfirmationMessage(result);

    setExhibitions(getExhibitions());

    setShowModal(false);
    setNewExhibitionName("");
    setSelectedExhibition("");

    setTimeout(() => setAddedConfirmationMessage(null), 3000);
  };

  if (loading) return <p>Loading...</p>;
  if (!object) return <p>No record found.</p>;

  const formattedDimensions = object.record?.dimensions
    ? Array.isArray(object.record.dimensions)
      ? object.record.dimensions
          .map((dim) => `${dim.dimension}: ${dim.value} ${dim.unit}`)
          .join(", ")
      : object.record.dimensions
    : object.dimensions || "Not specified";

  const isVAObject = id.startsWith("O");
  const description = isVAObject
    ? object.record?.physicalDescription ||
      object.record?.briefDescription ||
      "No description available."
    : object.classification || object.objectName || "No description available.";

  return (
    <div className="single-object">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <img
        src={imageSrc}
        alt={object.title || "Artwork"}
        onClick={handleClick}
      />
      <h2>{object.title || object.record?.titles?.[0]?.title || "Untitled"}</h2>
      <p>
        <strong>Artist:</strong>{" "}
        {object.artistDisplayName ||
          object.record?.artistMakerPerson?.[0]?.name?.text ||
          "Unknown"}
      </p>
      <p>
        <strong>Artist Bio:</strong>{" "}
        {object.artistDisplayBio || "No artist bio available"}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {object.objectDate ||
          object.record?.productionDates?.[0]?.date?.text ||
          "Unknown"}
      </p>
      <p>
        <strong>Medium:</strong>{" "}
        {object.medium ||
          object.record?.materialsAndTechniques ||
          "Not specified"}
      </p>
      <p>
        <strong>Dimensions:</strong> {formattedDimensions}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>

      {object.objectURL || object.meta?._links?.collection_page?.href ? (
        <a
          href={object.objectURL || object.meta?._links?.collection_page?.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Museum Site
        </a>
      ) : null}

      {addedConfirmationMessage && (
        <div
          className={`added-confirmation-message ${addedConfirmationMessage.type}`}
        >
          {addedConfirmationMessage.text}
        </div>
      )}

      <button onClick={() => setShowModal(true)}>Add to Exhibition</button>

      <AddToExhibitionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        newExhibitionName={newExhibitionName}
        setNewExhibitionName={setNewExhibitionName}
        selectedExhibition={selectedExhibition}
        setSelectedExhibition={setSelectedExhibition}
        exhibitions={exhibitions}
        onSave={localAddToExhibition}
      />
    </div>
  );
}

export default SingleObject;
