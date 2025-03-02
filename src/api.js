import axios from "axios";

const vaApi = axios.create({
  baseURL: "https://api.vam.ac.uk/v2",
});

const metApi = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
});

const typeToMetMedium = {
  painting: "Paintings",
  sculpture: "Sculpture",
  ceramic: "Ceramics",
  antiquities: "",
  drawing: "Drawings",
  print: "Prints",
  engraving: "Engravings",
  relief: "",
  manuscript: "",
  mosaic: "",
  artifact: "",
  bronze: "",
  marble: "",
  textile: "", // fallback to query keyword
};

export const getMetObjects = (query, objectType = "", dateBegin, dateEnd) => {
  console.log("in get met obj api call");
  const baseQuery = query.replace(/\s+/g, "+");
  const encodedQuery = encodeURIComponent(baseQuery);
  const medium = objectType ? typeToMetMedium[objectType] : "";

  const params = { q: encodedQuery };
  if (medium) {
    params.medium = medium;
  }
  if (dateBegin != null && dateEnd != null) {
    params.dateBegin = dateBegin;
    params.dateEnd = dateEnd;
  }

  let metUrl = `${metApi.defaults.baseURL}/search?q=${encodedQuery}`;
  if (medium) {
    metUrl += `&medium=${encodeURIComponent(medium)}`;
  }
  if (dateBegin != null && dateEnd != null) {
    metUrl += `&dateBegin=${dateBegin}&dateEnd=${dateEnd}`;
  }
  console.log("Final Met API URL:", metUrl);

  return metApi
    .get("/search", { params })
    .then((searchResponse) => {
      if (!searchResponse.data.objectIDs) return [];
      console.log("MET searchResponse:", searchResponse.data);
      const objectRequests = searchResponse.data.objectIDs
        .slice(0, 50)
        .map((id) => getMetObjectById(id));
      return Promise.all(objectRequests);
    })
    .then((responses) => {
      console.log("MET call pre filter", responses);
      const validObjects = responses.filter((obj) => {
        if (!obj) return false;
        const hasImages =
          obj.primaryImage ||
          obj.primaryImageSmall ||
          (obj.additionalImages && obj.additionalImages.length > 0);
        const hasOGFallback = obj.objectURL;
        return hasImages || hasOGFallback;
      });
      console.log("MET call post filter", validObjects);
      return validObjects.filter((obj) => obj !== null);
    })
    .catch((error) => {
      console.error("Error fetching from The Met:", error);
      return [];
    });
};

//////////////////
// --- V&A API Code ---
export const getVAObjects = (
  query,
  objectType = "",
  yearMadeFrom,
  yearMadeTo
) => {
  const formattedQuery = query.replace(/\s+/g, "+");
  let typeParams = "";
  if (objectType) {
    typeParams = `&kw_object_type=${objectType}`;
  } else {
    typeParams = `&kw_object_type=painting
      &kw_object_type=sculpture
      &kw_object_type=drawing
      &kw_object_type=print
      &kw_object_type=relief
      &kw_object_type=manuscript
      &kw_object_type=engraving
      &kw_object_type=mosaic
      &kw_object_type=artifact
      &kw_object_type=antiquities
      &kw_object_type=ceramic
      &kw_object_type=bronze
      &kw_object_type=marble
      &kw_object_type=textile`.replace(/\s+/g, "");
  }

  let dateParams = "";
  if (yearMadeFrom && yearMadeTo) {
    dateParams = `&year_made_from=${yearMadeFrom}&year_made_to=${yearMadeTo}`;
  }

  const vaUrl = `${vaApi.defaults.baseURL}/objects/search?q=${formattedQuery}&images_exist=true&page_size=65&response_format=json${typeParams}${dateParams}`;
  console.log("Final V&A API URL:", vaUrl);

  return vaApi
    .get(vaUrl)
    .then((response) => {
      const summaryRecords = response.data.records || [];
      console.log("V&A summary records:", summaryRecords);
      const fullObjectRequests = summaryRecords.map((record) =>
        getVAObjectById(record.systemNumber).catch(() => null)
      );
      return Promise.all(fullObjectRequests);
    })
    .then((fullObjects) => {
      console.log("fullObjects", fullObjects);
      const validObjects = fullObjects.filter((obj) => obj !== null);
      console.log("Full V&A objects:", validObjects);
      return validObjects;
    })
    .catch((error) => {
      console.error("Error fetching from V&A:", error);
      return [];
    });
};

export const getVAObjectById = (systemNumber) => {
  return vaApi
    .get(`/object/${systemNumber}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error fetching V&A object ${systemNumber}:`, error);
      return null;
    });
};

export const getMetObjectById = (id) => {
  return metApi
    .get(`/objects/${id}`)
    .then((res) => {
      // console.log(`Fetched MET object ${id}:`, res.data);
      return res.data;
    })
    .catch((error) => {
      console.error(`Error fetching Met object ${id}:`, error);
      return null;
    });
};
