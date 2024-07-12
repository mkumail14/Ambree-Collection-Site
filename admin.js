// if(!localStorage.getItem('adminPermit')){
// window.location.href='index.html'
// }else{
//     localStorage.removeItem('adminPermit')
// }
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCml__ejp5jC1QPfvRdKPKT21W0PIgomCQ",
    authDomain: "ambreen-collection-site.firebaseapp.com",
    projectId: "ambreen-collection-site",
    storageBucket: "ambreen-collection-site.appspot.com",
    messagingSenderId: "170490149415",
    appId: "1:170490149415:web:70fb18aa003cc88cb7ec02",
    measurementId: "G-XD75SQT90W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
document.getElementById('dataBox').style.display='none'

const addStockBtn = document.getElementById('addNewStock');
addStockBtn.addEventListener('click', function() {
    const addStockModal = new bootstrap.Modal(document.getElementById('addStockModal'));
    addStockModal.show();
});
const setStockBtn = document.getElementById('setStockId');
setStockId.addEventListener('click', function() {
    const setStockModal = new bootstrap.Modal(document.getElementById('setStockIdModal'));
    setStockModal.show();
});
document.getElementById('saveStockID').addEventListener('click',function(){
    localStorage.setItem('tempStockId', document.getElementById('inputStockId').value);
    document.getElementById('loadStock').click();
})

document.getElementById('enterStock').addEventListener('click', async function() {
    const stockName = document.getElementById('inputStockName').value;
    if (stockName) {
        try {
            const docRef = await addDoc(collection(db, "stocks"), {
                name: stockName
            });
            Swal.fire({
                title: 'Success',
                text: 'Stock added successfully with ID ' + docRef.id,
                icon: 'success'
            });
            await navigator.clipboard.writeText(docRef.id);
            localStorage.setItem('tempStockId', docRef.id);
            document.getElementById('inputStockName').value = '';
            const addStockModal = bootstrap.Modal.getInstance(document.getElementById('addStockModal'));
            addStockModal.hide();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add stock: ' + error.message,
                icon: 'error'
            });
        }
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Please enter a stock name',
            icon: 'error'
        });
    }
});

document.getElementById('loadStock').addEventListener('click', async function() {
    const stockId = localStorage.getItem('tempStockId');
    if (stockId) {
        try {
            const docRef = doc(db, "stocks", stockId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                var header=`
                <tr style="border: 3px black solid;">
                <td class="scell">Product No</td>
                <td class="scell">Name</td>
                <td class="scell">Description</td>
                <td id='hiddenCell3' class="scell">Retail Price</td>
                <td class="scell">Sale Price</td>
                <td id='hiddenCell4' class="scell">Quantity</td>
                <td class="scell">Product Left</td>
                <td class="scell">Actions</td>
            </tr>`
            document.getElementById('tableContainer').innerHTML = header;
                let stockData = docSnap.data();
                console.log(stockData)
                document.getElementById('stockName').textContent = "Stock Name: " + stockData.name;
                document.getElementById('stockId').textContent = "Stock ID: " + stockId;

                for (var i = 1; i < 1000; i++) {
                    if (stockData[`Product${i}`]) {
                        var temp = stockData[`Product${i}`];
                        var tmp = `
                        <tr>
                            <td class="datacell">${i}</td>
                            <td class="datacell">${temp[0]}</td>
                            <td class="datacell">${temp[1]}</td>
                            <td id='hiddenCell1' class="datacell">${temp[2]}</td>
                            <td class="datacell">${temp[3]}</td>
                            <td id='hiddenCell2' class="datacell">${temp[4]}</td>
                            <td class="datacell">${temp[5]}</td>
                            <td class="datacell">
                                <button class="btn btn-sm btn-warning editProductBtn" data-product-id="${i}">Edit</button>
                            </td>
                        </tr>
                        `;
                        document.getElementById('tableContainer').innerHTML += tmp;
                    } else {
                        break;
                    }
                    document.getElementById('dataBox').style.display='block'

                }
                attachEditButtonsEvent();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'No such document!',
                    icon: 'error'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to load stock: ' + error.message,
                icon: 'error'
            });
        }
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No stock ID found in local storage',
            icon: 'error'
        });
    }
});

document.getElementById('addProductBtn').addEventListener('click', async function() {
    const itemName = document.getElementById('itemName').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const retailPrice = document.getElementById('retialPrice').value;
    const salePrice = document.getElementById('salePrice').value;
    const quantity = document.getElementById('Quantity').value;

    if (itemName && itemDescription && retailPrice && salePrice && quantity) {
        const stockId = localStorage.getItem('tempStockId');
        if (stockId) {
            try {
                const docRef = doc(db, "stocks", stockId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    let stockData = docSnap.data();
                    let productId = 1;
                    while (stockData[`Product${productId}`]) {
                        productId++;
                    }

                    stockData[`Product${productId}`] = [
                        itemName,
                        itemDescription,
                        retailPrice,
                        salePrice,
                        quantity,
                        quantity
                    ];

                    await updateDoc(docRef, stockData);

                    Swal.fire({
                        title: 'Success',
                        text: 'Product added successfully!',
                        icon: 'success'
                    });
                    document.getElementById('addProductModal').style.display='none';


                    document.getElementById('itemName').value = '';
                    document.getElementById('itemDescription').value = '';
                    document.getElementById('retialPrice').value = '';
                    document.getElementById('salePrice').value = '';
                    document.getElementById('Quantity').value = '';

                    document.getElementById('loadStock').click(); // Refresh the stock data
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No such document!',
                        icon: 'error'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to add product: ' + error.message,
                    icon: 'error'
                });
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No stock ID found in local storage',
                icon: 'error'
            });
        }
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Please fill all the fields',
            icon: 'error'
        });
    }
});

function attachEditButtonsEvent() {
    const editButtons = document.querySelectorAll('.editProductBtn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = button.getAttribute('data-product-id');
            openEditModal(productId);
        });
    });
}

async function openEditModal(productId) {
    const stockId = localStorage.getItem('tempStockId');
    const docRef = doc(db, "stocks", stockId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let stockData = docSnap.data();
        let productData = stockData[`Product${productId}`];

        document.getElementById('editItemName').value = productData[0];
        document.getElementById('editItemDescription').value = productData[1];
        document.getElementById('editRetailPrice').value = productData[2];
        document.getElementById('editSalePrice').value = productData[3];
        document.getElementById('editQuantity').value = productData[4];

        const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editProductModal.show();

        document.getElementById('saveEditProductBtn').onclick = async function() {
            await saveProductChanges(productId);
            editProductModal.hide();
        };
    }
}

async function saveProductChanges(productId) {
    const stockId = localStorage.getItem('tempStockId');
    const docRef = doc(db, "stocks", stockId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let stockData = docSnap.data();

        stockData[`Product${productId}`] = [
            document.getElementById('editItemName').value,
            document.getElementById('editItemDescription').value,
            document.getElementById('editRetailPrice').value,
            document.getElementById('editSalePrice').value,
            document.getElementById('editQuantity').value,
            document.getElementById('editQuantity').value  // Assuming Product Left is the same as Quantity after edit
        ];

        try {
            await updateDoc(docRef, stockData);
            Swal.fire({
                title: 'Success',
                text: 'Product updated successfully!',
                icon: 'success'
            });
            document.getElementById('loadStock').click(); // Refresh the stock data
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to update product: ' + error.message,
                icon: 'error'
            });
        }
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No such document!',
            icon: 'error'
        });
    }
}
        
document.getElementById('unHideBtn').addEventListener('click',function(){
    if (document.getElementById('hiddenCell1').style.display=='none') {
       document.getElementById('hiddenCell1').style.display='block'
       document.getElementById('hiddenCell2').style.display='block'
       document.getElementById('hiddenCell3').style.display='block'
       document.getElementById('hiddenCell4').style.display='block'
       document.getElementById('unHideBtn').innerText="Hide"
    } else {
       document.getElementById('hiddenCell1').style.display='none'
       document.getElementById('hiddenCell2').style.display='none'
       document.getElementById('hiddenCell3').style.display='none'
       document.getElementById('hiddenCell4').style.display='none'                
       document.getElementById('unHideBtn').innerText="unHide"
    }
    
})


document.getElementById('addProductBoxBtn').addEventListener('click',function(){
    document.getElementById('addProductModal').style.display='block';
})


document.getElementById('showBillPortal').addEventListener('click',function(){
    document.getElementById('billModal').style.display='block';
    document.getElementById('main').style.display='none';
    var date = new Date();
    document.getElementById('dateTime').value=date;
})
document.getElementById('exitBillPortalBtn').addEventListener('click',function(){
    document.getElementById('billModal').style.display='none';
    document.getElementById('main').style.display='block';
})


document.getElementById('showBillPortal').addEventListener('click', function() {
    document.getElementById('billModal').style.display = 'block';
    document.getElementById('main').style.display = 'none';
    var date = new Date();
    document.getElementById('dateTime').value = date;

    // Populate the dropdown with products
    populateProductDropdown();
});

document.getElementById('exitBillPortalBtn').addEventListener('click', function() {
    document.getElementById('billModal').style.display = 'none';
    document.getElementById('main').style.display = 'block';
});

function populateProductDropdown() {
    const stockId = localStorage.getItem('tempStockId');
    if (stockId) {
        const docRef = doc(db, "stocks", stockId);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const stockData = docSnap.data();
                const productDropdown = document.getElementById('productDropdown');
                productDropdown.innerHTML = '<option value="" disabled selected>Select a product</option>';
                for (let i = 1; i < 1000; i++) {
                    if (stockData[`Product${i}`]) {
                        const product = stockData[`Product${i}`];
                        const option = document.createElement('option');
                        option.value = `Product${i}`;
                        option.textContent = `${product[0]} - ${product[1]}`;
                        productDropdown.appendChild(option);
                    } else {
                        break;
                    }
                }
            }
        }).catch((error) => {
            console.error("Error loading products: ", error);
        });
    } else {
        console.error('No stock ID found in local storage');
    }
}

document.getElementById('addToCartBtn').addEventListener('click', function() {
    const selectedProduct = document.getElementById('productDropdown').value;
    if (selectedProduct) {
        const stockId = localStorage.getItem('tempStockId');
        const docRef = doc(db, "stocks", stockId);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const stockData = docSnap.data();
                const productData = stockData[selectedProduct];
                addProductToCart(selectedProduct, productData);
            }
        }).catch((error) => {
            console.error("Error adding to cart: ", error);
        });
    } else {
        alert("Please select a product first");
    }
});
function addProductToCart(productId, productData) {
    var totalPrice=document.getElementById('totalPrice').innerText
    const cartList = document.getElementById('cartList');
    const cartItem = document.createElement('li');
    cartItem.className = 'list-group-item';
    cartItem.textContent = `${productData[0]} - ${productData[1]} - RS.${productData[3]} `;
    cartList.appendChild(cartItem);
    document.getElementById('totalPrice').innerText=parseInt(parseInt(totalPrice)+parseInt(productData[3]))
}

document.getElementById('billHeader').style.display = 'none'
document.getElementById('billFooter').style.display = 'none'


document.getElementById('submitBill').addEventListener('click',function(){
    if(document.getElementById('customerName').value==''){
        Swal.fire({
            title: 'Failed',
            text: 'Customer Name can not be empty',
            icon: 'error'
        });
    }else{
        document.getElementById('customerName').disabled = true
        document.getElementById('portalElements').style.display = 'none'
        document.getElementById('exitBillPortalBtn').style.display = 'none'
        document.getElementById('submitBill').style.display = 'none'
        document.getElementById('navbar').style.display = 'none'
        document.getElementById('billHeader').style.display = 'flex'
        document.getElementById('billFooter').style.display = 'flex'
        print()
        document.getElementById('exitBillPortalBtn').style.display = 'block'
        // document.getElementById('billHeader').style.display = 'none'
        // document.getElementById('billFooter').style.display = 'none'

    }
})