
    let array = JSON.parse(localStorage.getItem("array")) || [];
    let currentPage = 1;
    const itemsPerPage = 5;
    let sortAsc = true;

    function saveToLocalStorage() {
      localStorage.setItem("array", JSON.stringify(array));
    }

    function addName() {
      const input = document.getElementById("inputName");
      const name = input.value.trim();
      if (name) {
        array.push(name);
        input.value = "";
        saveToLocalStorage();
        goToLastPage();
      }
    }

    function deleteName(index) {
      const globalIndex = getFilteredAndSortedArray().indexOf(getPaginatedData()[index]);
      array.splice(globalIndex, 1);
      saveToLocalStorage();

      if (currentPage > totalPages() && currentPage > 1) {
        currentPage--;
      }
      renderList();
    }

    function editName(index) {
      const filtered = getFilteredAndSortedArray();
      const globalIndex = array.indexOf(getPaginatedData()[index]);
      const newName = prompt("Edit name", filtered[index]);
      if (newName) {
        array[globalIndex] = newName.trim();
        saveToLocalStorage();
        renderList();
      }
    }

    function toggleSort() {
      sortAsc = !sortAsc;
      document.getElementById("sortName").textContent = sortAsc ? "A-Z" : "Z-A";
      renderList();
    }

    function changePage(delta) {
      const newPage = currentPage + delta;
      if (newPage >= 1 && newPage <= totalPages()) {
        currentPage = newPage;
        renderList();
      }
    }

    function goToLastPage() {
      currentPage = totalPages();
      renderList();
    }

    function getFilteredAndSortedArray() {
      const filterValue = document.getElementById("filterInput").value.toLowerCase();
      let filtered = array.filter(name => name.toLowerCase().includes(filterValue));
      filtered.sort((a, b) => sortAsc ? a.localeCompare(b) : b.localeCompare(a));
      return filtered;
    }

    function getPaginatedData() {
      const filtered = getFilteredAndSortedArray();
      const start = (currentPage - 1) * itemsPerPage;
      return filtered.slice(start, start + itemsPerPage);
    }

    function totalPages() {
      return Math.ceil(getFilteredAndSortedArray().length / itemsPerPage);
    }

    function renderList() {
      const list = document.getElementById("dataList");
      const pageInfo = document.getElementById("pageInfo");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const paginationControls = document.getElementById("paginationControls");

      const items = getPaginatedData();
      const total = totalPages();

      list.innerHTML = "";

      items.forEach((name, index) => {
        const li = document.createElement("li");
        li.className = "flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm";

        li.innerHTML = `
          <span class="text-gray-700 font-medium">${name}</span>
          <div class="flex gap-2">
            <button 
              onclick="editName(${index})" 
              class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition">
              Edit
            </button>
            <button 
              onclick="deleteName(${index})" 
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
              Delete
            </button>
          </div>
        `;
        list.appendChild(li);
      });

      pageInfo.textContent = `Page ${total === 0 ? 0 : currentPage} of ${total}`;
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === total || total === 0;

      paginationControls.classList.toggle("hidden", total <= 1);
    }

    renderList();