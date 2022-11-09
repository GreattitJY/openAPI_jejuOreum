const btnReset = document.querySelector("#btn-reset");

function initMap(jejuOreum) {
    const jeju = { lat: 33.3616658, lng: 126.5204118 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: jeju,
    });
    if (jejuOreum) {
        for (const locationData of jejuOreum) {
            const location = { lat: parseFloat(locationData["위도"]), lng: parseFloat(locationData["경도"]) };
            new google.maps.Circle({
                strokeColor: "#09EB00",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#78E6A4",
                fillOpacity: 0.35,
                map,
                center: location,
                radius: parseFloat(locationData["표고(m)"]),
            });
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: locationData["오름명"],
            });
            marker.addListener("click", () => {
                infowindow(locationData);
            });
        }
    }
}
function infowindow(locationData) {
    const location = { lat: parseFloat(locationData["위도"]), lng: parseFloat(locationData["경도"]) };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: location,
    });
    const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        `<h1 id="firstHeading" class="firstHeading">${locationData["오름명"]}</h1>` +
        '<div id="bodyContent">' +
        `<p>설명 : ${locationData["설명"]}</p>` +
        `<p>위치 : ${locationData["위치"]}</p>` +
        "</div>" +
        "</div>";
    const Oreum = new google.maps.InfoWindow({
        content: contentString,
    });
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: locationData["오름명"],
    });
    new google.maps.Circle({
        strokeColor: "#09EB00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#78E6A4",
        fillOpacity: 0.35,
        map,
        center: location,
        radius: parseFloat(locationData["표고(m)"]),
    });
    Oreum.open(map, marker);
}

async function renderOpenApi() {
    const jejuOreum = [];

    const renderPages = await fetch(
        "https://api.odcloud.kr/api/15096996/v1/uddi:6738a90c-ec96-4245-a187-9528cea62904?page=1&perPage=10&serviceKey=9llzYCL8YbC8lWXtECA%2BJnP3bstFGvI2%2Bp9PEqwH5FLw05ZcSF6JtRjsUQvr7ScQhG5yqowpLUJMeLviQZozVw%3D%3D"
    )
        .then((response) => response.json())
        .catch((e) => {
            console.error(e);
        });

    for (let i = 1; i <= renderPages["perPage"]; i++) {
        const renderPage = await fetch(
            `https://api.odcloud.kr/api/15096996/v1/uddi:6738a90c-ec96-4245-a187-9528cea62904?page=${i}&perPage=10&serviceKey=9llzYCL8YbC8lWXtECA%2BJnP3bstFGvI2%2Bp9PEqwH5FLw05ZcSF6JtRjsUQvr7ScQhG5yqowpLUJMeLviQZozVw%3D%3D`
        )
            .then((response) => response.json())
            .catch((e) => {
                console.error(e);
            });

        jejuOreum.push(...renderPage["data"]);
    }

    return jejuOreum;
}

async function init() {
    const jejuOreum = await renderOpenApi();
    initMap(jejuOreum);
    btnReset.addEventListener("click", () => {
        initMap(jejuOreum);
    });
}

init();

//

// fetch("https://api.odcloud.kr/api/15096996/v1/uddi:6738a90c-ec96-4245-a187-9528cea62904?page=1&perPage=10&serviceKey=9llzYCL8YbC8lWXtECA%2BJnP3bstFGvI2%2Bp9PEqwH5FLw05ZcSF6JtRjsUQvr7ScQhG5yqowpLUJMeLviQZozVw%3D%3D")
// .then((r) => r.json())
// .then(data => {
//     console.log(data)
//     initMap(data)
// })
