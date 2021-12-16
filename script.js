"use strict";

const getOutput = document.querySelector("#getOutput");
const searchOutput = document.querySelector("#searchResults");
const catOutput = document.querySelector("#catResults");


document.querySelector("input#searchId").addEventListener("input", (event) => {
    const searchById = event.target.value;
    
    const form = this;
    console.log("This: ", form);

    const stockId = form.stockId.value;
    console.log("Stock:", stockId);

    axios
        .get(`http://localhost:8080/get/${searchById}`)
        .then(res => {
            console.log(res);
            const stock = res.data;
            searchOutput.textContent = "";

            const stockContainer = document.createElement("div");

                const stockDescription = document.createElement("p");
                stockDescription.innerText = `Description: ${stock.description}`;
                stockContainer.appendChild(stockDescription);

                const stockCategory = document.createElement("p");
                stockCategory.innerText = `Category: ${stock.category}`;
                stockContainer.appendChild(stockCategory);

                const stockCount = document.createElement("p");
                stockCount.innerText = `Stock Count: ${stock.stockCount}`;
                stockContainer.appendChild(stockCount);

                searchOutput.appendChild(stockContainer);

        })
        .catch(err => console.error(err));
})

document.querySelector("#catForm").addEventListener("submit", (event) => {
    const search = event.target.catId.value;
    
    const form = this;
    console.log("This: ", form);

    console.log("Search:", search);

    axios
        .get(`http://localhost:8080/getAllCategory/${search}`)
        .then(res => {
            console.log(res);
            const stocks = res.data;
            catOutput.textContent = "";
            
            for (let stock of stocks) {

            const stockContainer = document.createElement("div");

                const stockDescription = document.createElement("p");
                stockDescription.innerText = `Description: ${stock.description}`;
                stockContainer.appendChild(stockDescription);

                const stockCategory = document.createElement("p");
                stockCategory.innerText = `Category: ${stock.category}`;
                stockContainer.appendChild(stockCategory);

                const stockCount = document.createElement("p");
                stockCount.innerText = `Stock Count: ${stock.stockCount}`;
                stockContainer.appendChild(stockCount);

                catOutput.appendChild(stockContainer);
            }
        })
        .catch(err => console.error(err));
})

document.querySelector("#deleteForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = this;
    console.log("This: ", form);

    const stockId = form.stockId.value;
    console.log("Stock:", stockId);

    axios
        .delete(`http://localhost:8080/remove/${stockId}`)
        .then(res => {
            console.log(res);
            form.reset();
            form.description.focus();
            getInfo();
        })
        .catch(err => console.error(err));
});

document.querySelector("#stockForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = this;

    const data = {
        description: form.description.value,
        category: form.category.value,
        stockCount: form.count.value,
    };

    axios
        .post(`http://localhost:8080/create`, data)
        .then(res => {
            getInfo();
            form.reset();
            form.description.focus();
            console.log(res);
        })
        .catch(err => console.error(err));
});

const getInfo = () => {
    axios
        .get(`http://localhost:8080/getAll`)
        .then(response => {
            console.log("Res:", response);
            const stocks = response.data;
            getOutput.innnerHTML = "";

            for (let stock of stocks) {
                const stockContainer = document.createElement("div");

                const stockId = document.createElement("p");
                stockId.innerText = `Entry ID: ${stock.id}`;
                stockContainer.appendChild(stockId);

                const stockDescription = document.createElement("p");
                stockDescription.innerText = `Description: ${stock.description}`;
                stockContainer.appendChild(stockDescription);

                const stockCategory = document.createElement("p");
                stockCategory.innerText = `Category: ${stock.category}`;
                stockContainer.appendChild(stockCategory);

                const stockCountTitle = document.createElement("p");
                stockCountTitle.innerText = `Stock Count: `;
                stockContainer.appendChild(stockCountTitle);

                const stockCount = document.createElement("span");
                stockCount.innerText = `${stock.stockCount}`;
                stockCount.setAttribute("contenteditable", "true");

                stockCount.addEventListener("input", (event) => {
                    console.log("Event:" + event.target.innerText);
                    const updateStock = {
                        "description": `${stock.description}`,
                        "category": `${stock.category}`,
                        "stockCount": event.target.innerText
                    };
                    axios
                     .put(`http://localhost:8080/replace/${stock.id}`, updateStock)
                     .then(res => {
                        console.log(res);
                         })
                    .catch(err => console.error(err));
                });

                stockCountTitle.appendChild(stockCount);

                getOutput.appendChild(stockContainer);
            }
        })
        .catch(err => console.error(err));
}

getInfo();