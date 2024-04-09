document.addEventListener("click", function (event) {
  console.log(event.target.id);
  if (event.target.id !== "load_api_key") return;

  let itemsPerCoverageType = {};
  const apiKey = document.getElementById("api_key").value;
  console.log(apiKey);
  fetch(
    'https://public-api.meteofrance.fr/public/arome/1.0/wcs/MF-NWP-HIGHRES-AROME-001-FRANCE-WCS/GetCapabilities?service=WCS&version=1.3.0&language=eng"',
    {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    }
  )
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      console.log(xml);
      const coverageItems = xml.querySelectorAll("CoverageSummary");
      console.log(coverageItems);
      coverageItems.forEach((coverageItem) => {
        const itemTitle = coverageItem.querySelector("Title").textContent;
        const itemCoverageId =
          coverageItem.querySelector("CoverageId").textContent;
        const itemCoverageSubtype =
          coverageItem.querySelector("CoverageSubtype").textContent;
        console.log(itemTitle, itemCoverageId, itemCoverageSubtype);
        if (!itemsPerCoverageType[itemTitle]) {
          itemsPerCoverageType[itemTitle] = [itemCoverageId];
        } else {
          itemsPerCoverageType[itemTitle].push(itemCoverageId);
        }
      });
    })
    .then(() => {
      const coverageTypeSelect = document.getElementById("coverageType");
      console.log(coverageTypeSelect);
      for (const key in itemsPerCoverageType) {
        const option = document.createElement("option");
        option.value = key;
        option.text = key;
        coverageTypeSelect.appendChild(option);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(itemsPerCoverageType);

  document.addEventListener(
    "input",
    function (event) {
      if (event.target.id !== "coverageType") return;
      const coverageTypeSelected = event.target.value;
      console.log("coverageTypeSelected", coverageTypeSelected);
      const coverageIdSelect = document.getElementById("coverageId");
      coverageIdSelect.innerHTML = "";
      for (const item of itemsPerCoverageType[coverageTypeSelected]) {
        const option = document.createElement("option");
        option.value = item;
        option.text = item;
        coverageIdSelect.appendChild(option);
      }
    },
    false
  );

  document.addEventListener(
    "input",
    function (event) {
      if (event.target.id !== "coverageId") return;
      const coverageIdSelected = event.target.value;
      console.log("coverageIdSelected", coverageIdSelected);
      const coverageIdSelect = document.getElementById("coverageId");
      fetch(
        `https://public-api.meteofrance.fr/public/arome/1.0/wcs/MF-NWP-HIGHRES-AROME-001-FRANCE-WCS/DescribeCoverage?service=WCS&version=2.0.1&coverageId=${coverageIdSelected}`,
        {
          method: "GET",
          headers: {
            apikey: apiKey,
          },
        }
      )
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          const parser = new DOMParser();
          const xml = parser.parseFromString(data, "application/xml");
          console.log(xml);
          const axesItems = xml.querySelectorAll("GeneralGridAxis");

          const timeSelect = document.getElementById("time");
          timeSelect.innerHTML = "";
          const heightSelect = document.getElementById("height");
          heightSelect.innerHTML = "";

          axesItems.forEach((axesItem) => {
            const itemTitle =
              axesItem.querySelector("gridAxesSpanned").textContent;
            const itemValues =
              axesItem.querySelector("coefficients").textContent;
            console.log(itemTitle, itemValues);

            if (itemTitle === "time") {
              const timeValues = itemValues.split(" ");
              for (const value of timeValues) {
                const option = document.createElement("option");
                option.value = value;
                option.text = value / 3600;
                timeSelect.appendChild(option);
              }
            }

            if (itemTitle === "height") {
              const heightValues = itemValues.split(" ");
              for (const value of heightValues) {
                const option = document.createElement("option");
                option.value = value;
                option.text = value;
                heightSelect.appendChild(option);
              }
            }
          });
        }, false);
    },
    false
  );
  document.addEventListener("click", function (event) {
    console.log(event.target.id);
    if (event.target.id !== "download") return;
    const coverageIdSelected = document.getElementById("coverageId").value;
    const timeSelected = document.getElementById("time").value;
    const heightSelected = document.getElementById("height").value;
    const latitude_1 = document.getElementById("latitude_1").value;
    const latitude_2 = document.getElementById("latitude_2").value;
    const longitude_1 = document.getElementById("longitude_1").value;
    const longitude_2 = document.getElementById("longitude_2").value;
    let url = `https://public-api.meteofrance.fr/public/arome/1.0/wcs/MF-NWP-HIGHRES-AROME-001-FRANCE-WCS/GetCoverage?service=WCS&version=2.0.1&language=eng&coverageID=${coverageIdSelected}&format=application/wmo-grib&subset=lat(${latitude_1},${latitude_2})&subset=long(${longitude_1},${longitude_2})`;
    if (timeSelected) {
      url += `&subset=time(${timeSelected})`;
    }
    if (heightSelected) {
      url += `&subset=height(${heightSelected})`;
    }

    console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        var file = window.URL.createObjectURL(blob);
        window.location.assign(file);
      }),
      false;
  });
});
