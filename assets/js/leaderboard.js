document.addEventListener('DOMContentLoaded', async function() {
    try {
        renderInitialStructure();
        await fetchAndRenderLeaderboard();
    } catch (error) {
        console.error('Error:', error);
    }
});

async function fetchAndRenderLeaderboard(pageNumber = 1, pageSize = 10) {
    try {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '<div class="loading">Loading...</div>';
        
        const response = await fetch(`http://localhost:5001/dsps-3f9b3/us-central1/userSearchAndList?action=paginate&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            headers: {
                "Content-Type": "application/json",
                'x-api-key': 'AIzaSyDvYTmYqR1dOg-GZjYmphEaBn63UDZm_fE'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
        }
        const data = await response.json();
        
        renderLeaderboard(data.users);
        renderPagination(data.totalPages || 201, pageNumber);
    } catch (error) {
        console.error('Error:', error);
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '<div class="error">Failed to load leaderboard</div>';
    }
}

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    let paginationHTML = `
        <button class="pagination-arrow ${currentPage === 1 ? 'disabled' : ''}" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <span class="arrow-left">‹</span>
        </button>
    `;

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }

    paginationHTML += `
        <button class="pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}" 
            ${currentPage === totalPages ? 'disabled' : ''} 
            onclick="changePage(${currentPage + 1})">
            <span class="arrow-right">›</span>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(pageNumber) {
    fetchAndRenderLeaderboard(pageNumber);
}

function renderInitialStructure() {
    const container = document.getElementById('leaderboard-container');
    const pluginUrl = container.getAttribute('data-plugin-url') || '';

    container.innerHTML = `
        <div class="image-box">
             <img src="${pluginUrl}/assets/img/dangil.png" alt="Dangıl Vurdu ve Kale Duvar" height="200">
        </div>
        <div class="tab-container">
            <div class="tab active">YARIŞMA</div>
            <div class="tab">GENEL KLASMANN</div>
        </div>
        <div class="timer-holder">
            <div class="timer-section">
                <div class="timer-title">ÖN ELEME TURU BİTİŞİ İÇİN KALAN SÜRE</div>
                <div class="timer-display">
                    <div class="timer-unit">
                        <div class="timer-value" id="weeks">2</div>
                        <div class="timer-label">HAFTA</div>
                    </div>
                    <div class="timer-unit">
                        <div class="timer-value" id="days">6</div>
                        <div class="timer-label">GÜN</div>
                    </div>
                    <div class="timer-unit">
                        <div class="timer-value" id="hours">12</div>
                        <div class="timer-label">SAAT</div>
                    </div>
                    <div class="timer-unit">
                        <div class="timer-value" id="minutes">51</div>
                        <div class="timer-label">DAKİKA</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="autocomplete search-container">
      
            <input id="myInput" class="search-input" type="text" name="UserName" placeholder=" Kullanıcı ara...">
        </div>
        <div id="leaderboard-list" class="leaderboard-list"></div>
        <div id="pagination" class="pagination"></div>
    `;
    setupSearch();
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    let debounceTimeout;

    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.trim();
        
        // Clear existing dropdown
        clearSearchDropdown();
        
        // Only search if 3 or more characters
        if (searchTerm.length < 3) return;

        // Debounce the search
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://localhost:5001/dsps-3f9b3/us-central1/userSearchAndList?action=search&username=${searchTerm}&pageSize=10`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            'x-api-key': 'AIzaSyDvYTmYqR1dOg-GZjYmphEaBn63UDZm_fE'
                        }
                    }
                );

                if (!response.ok) throw new Error('Search failed');""
                
                const data = await response.json();
                if (data.user) {
                    showSearchResult(data.user, data.pageNumber);
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 300); // 300ms delay
    });
}

function showSearchResult(user, pageNumber) {
    const searchInput = document.querySelector('.search-input');
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'search-dropdown';
    dropdownContainer.id = 'searchDropdown';

    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    resultItem.innerHTML = `
        <span class="search-username">${user.UserName}</span>
        <span class="search-rank">Rank: ${user.RacingScore.Rank}</span>
    `;

    resultItem.addEventListener('click', () => {
        searchInput.value = user.UserName;
        fetchAndRenderLeaderboard(pageNumber);
        clearSearchDropdown();
    });

    dropdownContainer.appendChild(resultItem);
    searchInput.parentNode.appendChild(dropdownContainer);
}

function clearSearchDropdown() {
    const existingDropdown = document.getElementById('searchDropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
}

function renderLeaderboard(users) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    users.forEach((user, index) => {
        console.log(user)
        const itemElement = document.createElement('div');
        const classes = ['leaderboard-item'];
        if (user.RacingScore.Rank < 5) classes.push('top-five');
        if (user.RacingScore.Rank === 6) classes.push('separator');

        // Check if this user matches the searched username
        const searchInput = document.querySelector('.search-input');
        if (searchInput.value && user.UserName === searchInput.value) {
            classes.push('highlighted');
        }

        itemElement.className = classes.join(' ');
        itemElement.innerHTML = `
            <span class="rank">${user.RacingScore.Rank}</span>
            <div class="player-info">
                <div class="player-name">${user.UserName}</div>
            </div>
            <div class="score">${user.RacingScore.Score} <span class="points-text">pts</span></div>
        `;
        leaderboardList.appendChild(itemElement);
    });
}


function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }
  