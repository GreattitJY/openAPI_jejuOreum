# openAPI_jejuOreum

-   제주 오름에 대한 open API를 이용하여 구글 맵에 마커 표시를 했습니다.
-   https://www.data.go.kr/data/15096996/fileData.do

## 고민 사항

-   이슈 발생: 구글 맵이 불러와지지 않는 이슈 발생
-   이슈 원인:

        1. json의 데이터를 fetch 받기 위해 탑레벨 await를 사용 (지도를 불러올 때 데이터를 바로넣기 위함)
        2. 탑레벨 await는 type='module'를 필요로함
        3. type='module'로 인해 구글맵을 호출하는 콜백함수가 제대로 작동하지 않음

-   해결 방법:

        1. 탑레벨 await를 제거
        2. 콜백함수를 사용하여 지도를 불러올 때 한 번, 데이터 넣을 때 한 번 초기화로 해결했습니다.

-   issue 발생 코드

    ```js
        <script type="module">
            const data = [];

        await(async () => {
                try {
                    const response = await fetch("https://api.odcloud.kr/api/15096996/v1/uddi:6738a90c-ec96-4245-a187-9528cea62904?page=1&perPage=10&serviceKey=3MCBWEYPV4%2BY4Un8XqdBpFBiaGQKGsEVpC1HIK1DCoHqjNlhaUGcwjBIJGDYeTaTOiG4GKJorKXpGpfNpOEjhQ%3D%3D")

                    const renderPages = await response.json()

                    for (let i = 1; i <= renderPages["perPage"]; i++) {
                        const renderPage = await fetch(`https://api.odcloud.kr/api/15096996/v1/uddi:6738a90c-ec96-4245-a187-9528cea62904?page=${i}&perPage=10&serviceKey=3MCBWEYPV4%2BY4Un8XqdBpFBiaGQKGsEVpC1HIK1DCoHqjNlhaUGcwjBIJGDYeTaTOiG4GKJorKXpGpfNpOEjhQ%3D%3D`).then((response) => response.json())

                        data.push(...renderPage["data"])
                    }
                }
                catch (e) {
                    console.error(e)
                }
            })();
            console.log(data);
        </script>
    ```

-   해결 코드

    ```js
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
    ```
