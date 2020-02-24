let db;
let version = 1.0;
let dbName = "ixora";
let dbDisplayName = "ixora_test_db";
let dbSize = 2 * 1024 * 1024;

function selectDB() {
    if (window.openDatabase) {
        db = openDatabase(dbName, version, dbDisplayName, dbSize);

        dropTable(db);
        createTable(db);

        insertData(db, "BMW", "Minina 33", "engine", 2, 100000);
        insertData(db, "Toyota", "Gorky 20/10", "rear window", 10, 200000);
        insertData(db, "Kia", "Gagarina 110", "wing", 5, 50000);
        insertData(db, "Nissan", "Lenina 2a", "turbo pipe", 3, 30000);
        insertData(db, "Volvo", "Stroiteley 98", "molding", 12, 60000);

        dataView(db);

    } else {
        alert("Web SQL Database not supported in this browser");
    }
}

function dataView(db) {
    let table = document.getElementById("tbody01");
    let filterId = document.getElementById("filterId");
    let filterDate = document.getElementById("filterDate");
    let filterSupplier = document.getElementById("filterSupplier");
    let filterWarehouse = document.getElementById("filterWarehouse");
    let filterProduct = document.getElementById("filterProduct");
    let filterQuantity = document.getElementById("filterQuantity");
    let filterSum = document.getElementById("filterSum");
    table.innerHTML = "";

    db.transaction(function (t) {
        t.executeSql('SELECT * FROM ixoraTable', [],
            function (t, r) {
                filterId.innerHTML = "<option value='all'>all</option>";
                filterDate.innerHTML = "<option value='all'>all</option>";
                filterSupplier.innerHTML = "<option value='all'>all</option>";
                filterWarehouse.innerHTML = "<option value='all'>all</option>";
                filterProduct.innerHTML = "<option value='all'>all</option>";
                filterQuantity.innerHTML = "<option value='all'>all</option>";
                filterSum.innerHTML = "<option value='all'>all</option>";

                for (let i = 0; i < r.rows.length; i += 1) {
                    let id = r.rows.item(i).id;
                    let date = r.rows.item(i).date;
                    let supplier = r.rows.item(i).supplier;
                    let warehouse = r.rows.item(i).warehouse;
                    let product = r.rows.item(i).product;
                    let quantity = r.rows.item(i).quantity;
                    let sum = r.rows.item(i).sum;

                    table.innerHTML += "<tr><td>" + id + "</td><td>" + date + "</td><td>" + supplier + "</td><td>" + warehouse + "</td><td>" + product + "</td><td>" + quantity + "</td><td>" + sum + "</td></tr>";
                    filterId.innerHTML += "<option value=" + id + ">" + id + "</option>";
                    filterDate.innerHTML += "<option value=" + id + ">" + date + "</option>";
                    filterSupplier.innerHTML += "<option value=" + id + ">" + supplier + "</option>";
                    filterWarehouse.innerHTML += "<option value=" + id + ">" + warehouse + "</option>";
                    filterProduct.innerHTML += "<option value=" + id + ">" + product + "</option>";
                    filterQuantity.innerHTML += "<option value=" + id + ">" + quantity + "</option>";
                    filterSum.innerHTML += "<option value=" + id + ">" + sum + "</option>";
                }
            },
            function (tran, e) { alert("Error:" + e.message); }
        );
    });
}

function createTable(db) {
    db.transaction(function (t) {
        t.executeSql('CREATE TABLE ixoraTable (id INTEGER PRIMARY KEY, date DATETIME, supplier TEXT, warehouse TEXT, product TEXT, quantity INTEGER, sum INTEGER)', []);
    });
}

function insertData(db, supplier, warehouse, product, quantity, sum) {
    db.transaction(function (e) {
        let day = new Date();
        e.executeSql('INSERT INTO ixoraTable(date, supplier, warehouse, product, quantity, sum) VALUES (?, ?, ?, ?, ?, ?)', [day, supplier, warehouse, product, quantity, sum], onSuccess, onError);
    });
}

function onSuccess(e) { }
function onError(e) { }

function dropTable(db) {
    db.transaction(function (t) {
        t.executeSql('DROP TABLE ixoraTable');
    });
}

function dataChange(value) {
    if (value != "all") {
        let table = document.getElementById("tbody01");
        table.innerHTML = "";
        db.transaction(function (t) {
            t.executeSql('SELECT * FROM ixoraTable WHERE id=?', [value],
                function (tran, r) {
                    for (let i = 0; i < r.rows.length; i +=1) {
                        let id = r.rows.item(i).id;
                        let supplier = r.rows.item(i).supplier;
                        let warehouse = r.rows.item(i).warehouse;
                        let date = r.rows.item(i).date;
                        let product = r.rows.item(i).product;
                        let quantity = r.rows.item(i).quantity;
                        let sum = r.rows.item(i).sum;

                        table.innerHTML += "<tr><td>" + id + "</td><td>" + date + "</td><td>" + supplier + "</td><td>" + warehouse + "</td><td>" + product + "</td><td>" + quantity + "</td><td>" + sum + "</td></tr>";
                    }
                },
                function (t, e) { alert("Error:" + e.message); }
            );
        });
    } else {
        dataView(db);
    }
}

function deletePosition() {
    let id = document.getElementById('deleteId').value;

    db.transaction(function(t) {
        t.executeSql('DELETE FROM ixoraTable where id=' + id + '')
    });

    hideForms();
    dataView(db);
}

function addPosition() {
    db.transaction(function (t) {
        let date = new Date();
        let supplier = document.getElementById('addSupplier').value;
        let warehouse = document.getElementById('addWarehouse').value;
        let product = document.getElementById('addProduct').value;
        let quantity = document.getElementById('addQuantity').value;
        let sum = document.getElementById('addSum').value;
        t.executeSql('INSERT INTO ixoraTable(date, supplier, warehouse, product, quantity, sum) VALUES(?, ?, ?, ?, ?, ?)', [date, supplier, warehouse, product, quantity, sum], onSuccess, onError);
    });

    hideForms();
    dataView(db);
}

function changePosition() {
    let date = new Date();
    let id = document.getElementById('changeId').value;
    let supplier = document.getElementById('changeSupplier').value;
    let warehouse = document.getElementById('changeWarehouse').value;
    let product = document.getElementById('changeProduct').value;
    let quantity = document.getElementById('changeQuantity').value;
    let sum = document.getElementById('changeSum').value;

    db.transaction(function (t) {
        t.executeSql('UPDATE ixoraTable SET date="' + date + '",supplier="' + supplier + '",warehouse="' + warehouse + '",product="' + product + '",quantity="' + quantity + '",sum="' + sum + '" where id=' + id + '');
    });

    hideForms();
    dataView(db);
}

function showForm(id) {
    let deleteForm = document.getElementById("deleteForm");
    let addForm = document.getElementById("addForm");
    let changeForm = document.getElementById("changeForm");

    let form = document.getElementById(id);
    if (form.style.display === "none") {
        form.style.display = "flex";
    } else {
        form.style.display = "none";
    }
}

function hideForms() {
    document.getElementById("addForm").style.display = "none";
    document.getElementById("changeForm").style.display = "none";
    document.getElementById("deleteForm").style.display = "none";
}

window.onload = function () {
    selectDB();
};

