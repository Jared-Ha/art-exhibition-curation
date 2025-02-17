const EXHIBITIONS_KEY = "exhibitions";

export const getExhibitions = () => {
  const storedExhibitions =
    JSON.parse(localStorage.getItem(EXHIBITIONS_KEY)) || [];

  if (storedExhibitions.length === 0) {
    const dummyExhibition = [
      {
        id: "test-exhibition",
        name: "Test Exhibition",
        objects: [
          {
            id: "object-123",
            title: "Starry Night",
            artist: "Vincent van Gogh",
            image:
              "https://images.metmuseum.org/CRDImages/ep/original/DT2163.jpg",
          },
        ],
      },
    ];
    localStorage.setItem(EXHIBITIONS_KEY, JSON.stringify(dummyExhibition));
    return dummyExhibition;
  }

  return storedExhibitions;
};

export const saveExhibitions = (exhibitions) => {
  localStorage.setItem(EXHIBITIONS_KEY, JSON.stringify(exhibitions));
};

export const addToExhibition = (exhibitionName, object) => {
  const exhibitions = getExhibitions();

  let exhibition = exhibitions.find((ex) => ex.name === exhibitionName);

  if (!exhibition) {
    exhibition = {
      id: `exhibition-${Date.now()}`,
      name: exhibitionName,
      objects: [],
    };
    exhibitions.push(exhibition);
  }

  if (!exhibition.objects.some((obj) => obj.id === object.id)) {
    exhibition.objects.push(object);
    saveExhibitions(exhibitions);
    console.log(`Added to exhibition: ${exhibitionName}`, exhibitions);
  } else {
    console.log("⚠️ Object already exists in the exhibition.");
  }
};
