FETCHDATATIMEOUT = 3 * 60 * 1000; // 3 minutes

function fetchArk(arkId) {
    fetch(`https://ark-servers.net/api/?object=servers&element=detail&key=${arkId}`)
        .then(r => r.json())
        .then(data => printArk(arkId, data));
    setTimeout(() => fetchArk(arkId), FETCHDATATIMEOUT);
}

function printArk(arkId, data) {
    const arkSEList = document.querySelector('#arkSEList');

    const existingRow = document.getElementById(`ark-${arkId}`);
    if (existingRow) {
        arkSEList.removeChild(existingRow);
    }

    const row = document.createElement('tr');
    row.id = `ark-${arkId}`;

    const statusCell = document.createElement('td');
    statusCell.classList.add('text-center');
    const onlineDot = document.createElement('img');

    if (data.is_online == '1') {
        onlineDot.src = './assets/images/online.png'; // Display online.png for online servers
        onlineDot.alt = 'Online';
    } else {
        onlineDot.src = './assets/images/offline.png'; // Display offline.png for offline servers
        onlineDot.alt = 'Offline';
    }
    onlineDot.classList.add('shadow-lg', 'mx-auto');
    statusCell.appendChild(onlineDot);
    row.appendChild(statusCell);

    const serverNameCell = document.createElement('td');
    serverNameCell.classList.add('text-start', 'ps-4', 'server-name');

    // Display data.map on mobile and data.name on desktop
    if (window.innerWidth < 768) {
        serverNameCell.textContent = data.map;
    } else {
        serverNameCell.textContent = data.name;
    }
    row.appendChild(serverNameCell);

    const versionCell = document.createElement('td');
    versionCell.classList.add('vp-text');
    versionCell.textContent = data.version;

    // Hide Version column on mobile
    if (window.innerWidth >= 768) {
        row.appendChild(versionCell);
    }

    const playerCountCell = document.createElement('td');
    playerCountCell.classList.add('vp-text');
    playerCountCell.textContent = `${data.players} / ${data.maxplayers}`;
    row.appendChild(playerCountCell);

    const voteCell = document.createElement('td');
    voteCell.classList.add('text-center');
    const voteButton = document.createElement('button');
    voteButton.classList.add('nk-btn', 'nk-btn-rounded', 'nk-btn-color-dark-3', 'nk-btn-hover-color-main-1');
    voteButton.innerHTML = 'Vote';
    voteButton.style.border = 'none';
    voteButton.addEventListener('click', () => {
        window.location.href = `${data.url}/vote`;
    });
    voteCell.appendChild(voteButton);
    row.appendChild(voteCell);

    const connectCell = document.createElement('td');
    connectCell.classList.add('text-center');
    const joinButton = document.createElement('button');
    joinButton.classList.add('nk-btn', 'nk-btn-rounded', 'nk-btn-color-dark-3', 'nk-btn-hover-color-main-1');
    joinButton.innerHTML = 'Join';
    joinButton.style.border = 'none';
    joinButton.addEventListener('click', () => {
        window.location.href = `steam://connect/${data.address}:${data.query_port}`;
    });
    joinButton.classList.add('vp-text', 'shadow');
    connectCell.appendChild(joinButton);

    // Hide Connect column on mobile
    if (window.innerWidth >= 768) {
        row.appendChild(connectCell);
    }

    arkSEList.appendChild(row);
}

function addArk(arkId) {
    fetchArk(arkId);
}

const arkSE = [
    "h7IFGiljgUR6BEb91tp9R6OkMj13qbwJJUC", // The Island
    "NxG2MDfSyVWH8NEumirPBH6d5bV13798kKf", // The Center
    "oX1wbBCLrsco7ofhQnXK7wZi8QBZhMy7", // Ragnarok
    "FNmgMFR2xXwVLKEXeGWcogJiRFyyX5IKwR", // Scorched Earth
    "nihFR0dWYbN1eLfKk4wbZEZMNHdXXu8AnAZ", // Aberration
    "1O4EtWbXiiglPVOS8bBRDMS1VKVrWrYa2X7", // Extinction
    "Elmv22OFOYsXdfSuy6LHrzEd8NosFzoz4WI", // Valguero
    "JPtyJWlOpPmJQjqs67PmiCqILdOmqVNZF", // Genesis 1
    "NPIxspQHsxUf19dDNVhJ2CWJJZv6R2BKqH", // Crystal Isles
    "4s3wfxL4uRCU7DizBdM6E45roeDBydhZFx", // Genesis 2
    "F0O3Ab0oU6qWuD0JcP473mpqXYJqrE8acqD", // Lost Island
    "MISmmW0t8yaNJms5gMTbEjmGxVqz8iuG5p" // Fjordur
];

arkSE.forEach(ark => addArk(ark));
