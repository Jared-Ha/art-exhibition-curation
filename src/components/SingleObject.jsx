import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import placeholderImage from "../assets/placeholder-image.jpg";
import { getVAObjectById, getMetObjectById } from "../api";
import { getExhibitions, saveExhibitions } from "../utils/exhibitionStorage";
import AddToExhibitionModal from "./AddToExhibitionModal";

function SingleObject() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(
    location.state?.imageSrc || placeholderImage
  );

  const [showModal, setShowModal] = useState(false);
  const [newExhibitionName, setNewExhibitionName] = useState("");
  const [selectedExhibition, setSelectedExhibition] = useState("");
  const [exhibitions, setExhibitions] = useState([]);
  const [addedConfirmationMessage, setAddedConfirmationMessage] = useState("");

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  useEffect(() => {
    const fetchObject = async () => {
      const isVAObject = id.startsWith("O");
      const fetchFn = isVAObject ? getVAObjectById : getMetObjectById;

      console.log(`Fetching details for object ID: ${id}`);
      fetchFn(id)
        .then((data) => {
          console.log("Fetched object data:", data);
          setObject(data || null);

          if (imageSrc === placeholderImage) {
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
              setImageSrc(
                data.primaryImage || data.primaryImageSmall || placeholderImage
              );
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching object:", error);
          setObject(null);
        })
        .finally(() => setLoading(false));
    };

    fetchObject();
  }, [id, imageSrc]);

  const handleAddToExhibition = () => {
    if (!newExhibitionName.trim() && !selectedExhibition) return;

    const exhibitionName = newExhibitionName.trim() || selectedExhibition;
    if (!exhibitionName) return;

    const objectData = {
      ...object,
      image: imageSrc || placeholderImage,
    };

    const updatedExhibitions = getExhibitions();
    const existingExhibition = updatedExhibitions.find(
      (ex) => ex.name === exhibitionName
    );

    if (existingExhibition) {
      existingExhibition.objects.push(objectData);
    } else {
      updatedExhibitions.push({
        id: `exhibition-${Date.now()}`,
        name: exhibitionName,
        objects: [objectData],
      });
    }

    saveExhibitions(updatedExhibitions);
    setExhibitions(updatedExhibitions);

    setAddedConfirmationMessage(
      `Added to your exhibition: "${exhibitionName}"`
    );

    setShowModal(false);
    setNewExhibitionName("");
    setSelectedExhibition("");

    setTimeout(() => setAddedConfirmationMessage(""), 3000);
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

      <img src={imageSrc} alt={object.title || "Artwork"} />
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
        <p className="added-confirmation-message">{addedConfirmationMessage}</p>
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
        onSave={handleAddToExhibition}
      />
    </div>
  );
}

export default SingleObject;
