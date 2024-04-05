/**
 * Get references to DOM elements
 */
const LoginScreen = document.getElementById("login");
const LoginForm = document.getElementById("login-form");
const addcust = document.getElementById("addCustomer-form");
addcust.style.display = "none";
const editcust = document.getElementById("editCustomer-form");
editcust.style.display = "none";
const customerList = document.getElementById("customer-list");
customerList.style.display = "none";

/**
 * Event listener for login form submission
 */
LoginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // Retrieve username and password from the form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Create authentication object
  const AuthObj = {
    loginId: username,
    password: password,
  };

  // API endpoint for user authentication
  const api = "http://localhost:9900/api/auth/login";

  // Make a POST request to authenticate the user
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(AuthObj),
  })
    .then((response) => {
      if (response.ok == false) {
        throw new Error(`HTTP error, Status : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Save JWT token to local storage
      localStorage.setItem("jwtToken", data.jwtToken);

      // Hide login screen and display customer list
      LoginScreen.style.display = "none";
      customerList.style.display = "block";
      addCustomerForm.style.display = "none";
      editcust.style.display = "none";

      // Display first page of customers
      getCustomers(1, 5, "firstName");
    })
    .catch((err) => {
      console.log("Error : ", err);
    });
});

/**
 * Function to retrieve customers with pagination parameters
 * @param {number} pageNo - Page number
 * @param {number} pageSize - Number of customers per page
 * @param {string} sortBy - Field to sort the customers by
 */
function getCustomers(pageNo, pageSize, sortBy) {
  // API endpoint to retrieve customers
  const apiUrl = `http://localhost:9900/api/customers/getAllCustomers?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}`;

  // Get authentication token from localStorage
  const authToken = localStorage.getItem("jwtToken");

  // Make a GET request to retrieve customers
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Handle the data from the response
      addCustomersToTable(data.content);
    })
    .catch((error) => {
      // Handle errors during the fetch operation
      console.error("Error:", error);
    });
}

/**
 * Function to add customers to the table
 * @param {Array} customers - Array of customer objects
 */
function addCustomersToTable(customers) {
  // Clear the table container
  tableContainer.innerHTML = "";

  // Create table header row
  const tableHeading = document.createElement("tr");
  tableHeading.innerHTML = `
    <th>First Name</th>
    <th>Last Name</th>
    <th>Address</th>
    <th>City</th>
    <th>State</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Actions</th>`;

  // Append table header row to table container
  tableContainer.appendChild(tableHeading);

  // Iterate over customers and create table rows
  customers.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${element.firstName}</td>
        <td>${element.lastName}</td>
        <td>${element.address}</td>
        <td>${element.city}</td>
        <td>${element.state}</td>
        <td>${element.email}</td>
        <td>${element.phone}</td>
        <td>
            <div class="actions">
                <button onclick="deleteCust(this)" data-id=${element.id} class="del-btn">Delete</button>
                <button onclick="editRow(this)" data-id=${element.id} class="edit-btn">Edit</button>
            </div>
        </td>`;

    // Append table row to table container
    tableContainer.appendChild(tr);
  });
}

/**
 * Function to handle customer deletion
 * @param {HTMLElement} event - Button element clicked
 */
function deleteCust(event) {
  // Retrieve the customer ID from the button
  const id = event.getAttribute("data-id");

  // API endpoint for customer deletion
  const apiUrl = `http://localhost:9900/api/customers/${id}`;

  // Get authentication token from localStorage
  const authToken = localStorage.getItem("jwtToken");

  // Make a DELETE request to delete the customer
  fetch(apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      // Reload customers after deletion
      getCustomers(1, 5, "firstName");
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * Function to handle editing a customer row
 * @param {HTMLElement} btn - Button element clicked
 */
function editRow(btn) {
    let editCustomerForm = document.getElementById("editCustomer-form");
    editCustomerForm.style.display = "flex";
    const row = btn.parentNode.parentNode.parentNode;
  
    // Retrieve customer details from the row
    const firstName = row.cells[0].innerText;
    const lastName = row.cells[1].innerText;
    const address = row.cells[2].innerText;
    const city = row.cells[3].innerText;
    const state = row.cells[4].innerText;
    const email = row.cells[5].innerText;
    const phone = row.cells[6].innerText;
  
    // Populate edit form with customer details
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editAddress").value = address;
    document.getElementById("editCity").value = city;
    document.getElementById("editState").value = state;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;
  
    // Event listener for edit form submission
    editCustomerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const firstName = document.getElementById("editFirstName").value;
      const lastName = document.getElementById("editLastName").value;
      const address = document.getElementById("editAddress").value;
      const city = document.getElementById("editCity").value;
      const state = document.getElementById("editState").value;
      const email = document.getElementById("editEmail").value;
      const phone = document.getElementById("editPhone").value;
  
      const formData = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone,
      };
  
      // API endpoint for updating a customer
      const authToken = localStorage.getItem("jwtToken");
      const apiUrl = `http://localhost:9900/api/customers/update/${id}`;
  
      // Make a PUT request to update the customer
      fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("Response data:", data);
  
          // Hide edit form after submission
          document.getElementById("editCustomer-form").style.display = "none";
  
          // Refresh customer list
          getCustomers(1, 5, "firstName");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  
      // Reset edit form
      editCustomerForm.reset();
      editCustomerForm.style.display = "none";
    });
  }
  
  /**
   * Function to handle customer search
   */
  function search() {
    let searchValue = document.getElementById("searchBy").value;
    let selectedValue = document.getElementById("searchBar").value;
  
    // API endpoint for customer search
    const apiUrl = `http://localhost:9900/api/customers/search?searchBy=${searchValue}&searchQuery=${selectedValue}`;
  
    // Get authentication token from localStorage
    const authToken = localStorage.getItem("jwtToken");
  
    // Make a GET request to search for customers
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Handle the data from the response
        addCustomersToTable(data);
      })
      .catch((error) => {
        // Handle errors during the fetch operation
        console.error("Error:", error);
      });
  }
  
  /**
   * Function to synchronize customers
   */
  function sync() {
    let customersSync = [];
    const apiUrl = `http://localhost:9900/api/customers/sync`;
  
    // Get authentication token from localStorage
    const authToken = localStorage.getItem("jwtToken");
  
    // Make a GET request to retrieve customers to sync
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Handle the data from the response
        data.forEach((customer) => {
          formData = {
            firstName: customer.first_name,
            lastName: customer.last_name,
            street: customer.street,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            email: customer.email,
            phone: customer.phone,
          };
          customersSync.push(formData);
        });
  
        customersSync.forEach((customer) => {
          // API endpoint for creating a customer with sync
          const apiUrl = "http://localhost:9900/api/customers/create?Sync=true";
  
          // Make a POST request to create the customer
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(customer),
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              // Handle the data from the response
              getCustomers(1, 5, "firstName");
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      })
      .catch((error) => {
        // Handle errors during the fetch operation
        console.error("Error:", error);
      });
  }
  
  /**
   * Pagination functionality
   */
  const paginationButtons = document.querySelectorAll(".pagination button");
  paginationButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const pageNo = index + 1;
      getCustomers(pageNo, 5, "name");
    });
  });
  