const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-D';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const result = await response.json();
        console.log(result.data.players)
        return result.data.players
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        const result = await response.json();
        console.log(result.data);
        return result.data;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerObj)
          });
          const result = await response.json();
          console.log(result.data);
          return result.data;

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            console.log(`Player #${playerId} successfully removed from the roster.`);
          } else {
            console.error(`Failed to remove player #${playerId} from the roster.`);
          }

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerList) => {
    try {
        //const players = await fetchAllPlayers();
        const container = document.getElementById('all-players-container');

        playerList.forEach((player) => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');

            playerCard.innerHTML = `
            <img src="${player.imageUrl}" alt="${player.name}">
            <h3>${player.name}</h3>
            <p>Breed: ${player.breed}</p>
            <p>Status: ${player.status}</p>
            <button class="details-button" data-player-id="${player.id}">See Details</button>
            <button class="remove-button" data-player-id="${player.id}">Remove from Roster</button>
        `;
        container.appendChild(playerCard);

        });

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const formContainer = document.getElementById('new-player-form')
        const form = document.createElement('form');
        form.classList.add('new-player-form');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Player Name';

        const breedInput = document.createElement('input');
        breedInput.type = 'text';
        breedInput.placeholder = 'Player Breed';
    
        const statusInput = document.createElement('input');
        statusInput.type = 'text';
        statusInput.placeholder = 'Player Status';

        const imgInput = document.createElement('input');
        imgInput.type = 'text';
        imgInput.placeholder = 'Player Image URL';
    
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Add Player';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const newPlayer = {
                name: nameInput.value,
                breed: breedInput.value,
                status: statusInput.value,
            };

            await addNewPlayer(newPlayer);

            const players = await fetchAllPlayers();
            renderAllPlayers(players);
        });

        form.appendChild(nameInput);
        form.appendChild(breedInput);
        form.appendChild(statusInput);
        form.appendChild(imgInput);
        form.appendChild(submitButton);
    
        formContainer.appendChild(form);

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();