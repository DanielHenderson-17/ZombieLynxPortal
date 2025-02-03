fetchMinecraftTIMEOUT = 3 * 60 * 1000; // 3 minutes

function fetchMinecraft(minecraftId) {
    fetch(`https://minecraft-mp.com/api/?object=servers&element=detail&key=${minecraftId}`)
        .then(r => r.json())
        .then(data => printMinecraft(minecraftId, data));
    setTimeout(() => fetchMinecraft(minecraftId), fetchMinecraftTIMEOUT);
}

function printMinecraft(minecraftId, data) {
    const minecraftList = document.querySelector('#minecraftList');

    // const existingRow = rows.find(row => row.id === `minecraft-${minecraftId}`);
    const existingRow = document.getElementById(`minecraft-${minecraftId}`)
    if (existingRow) {
        minecraftList.removeChild(existingRow);
    }

    const index = minecrafts.indexOf(minecraftId);
    const row = document.createElement('tr');
    row.id = `minecraft-${minecraftId}`;

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
    statusCell.appendChild(onlineDot);
    row.appendChild(statusCell);

    const serverNameCell = document.createElement('td');
    serverNameCell.classList.add('text-start', 'ps-4', 'server-name');

    // Replace data.name with 'Minecraft' on mobile display
    const serverName = isMobileDisplay() ? 'ZLG Minecraft' : (data.name.length > 30 ? data.name.substring(0, 37) + '...' : data.name);

    serverNameCell.textContent = serverName;
    row.appendChild(serverNameCell);

    // Hide version on mobile display
    if (!isMobileDisplay()) {
        const versionCell = document.createElement('td');
        versionCell.textContent = data.version;
        versionCell.classList.add('vp-text')
        row.appendChild(versionCell);
    }

    const playerCountCell = document.createElement('td');
    playerCountCell.textContent = `${data.players} / ${data.maxplayers}`;
    playerCountCell.classList.add('vp-text')
    row.appendChild(playerCountCell);

    const voteCell = document.createElement('td');
    voteCell.classList.add('text-center');
    const voteButton = document.createElement('button');
    voteButton.classList.add('nk-btn', 'nk-btn-rounded', 'nk-btn-color-dark-3', 'nk-btn-hover-color-main-1');
    // voteButton.style.backgroundColor = '#FE842C';
    voteButton.innerHTML = 'Vote';
    voteButton.style.border = 'none';
    voteButton.addEventListener('click', () => {
        window.location.href = `${data.url}/vote`;
    });
    voteButton.classList.add('vp-text', 'shadow')
    voteCell.appendChild(voteButton);
    row.appendChild(voteCell);

    // Hide copy button on mobile display
    if (!isMobileDisplay()) {
        const copyCell = document.createElement('td');
        copyCell.classList.add('text-center');
        const copyButton = document.createElement('button');
        copyButton.classList.add('nk-btn', 'nk-btn-rounded', 'nk-btn-color-dark-3', 'nk-btn-hover-color-main-1');
        copyButton.innerHTML = 'Copy';
        copyButton.style.border = 'none';
        copyButton.addEventListener('click', () => {
            const copyText = `${data.address}:${data.port}`;
            copyToClipboard(copyText);
            showCopySuccessPopup();
        });
        copyButton.classList.add('vp-text', 'shadow');
        copyCell.appendChild(copyButton);
        row.appendChild(copyCell);
    }

    minecraftList.appendChild(row);
}

function addMinecraft(minecraftId) {
    fetchMinecraft(minecraftId);
}

const minecrafts = [
    "7euYDFXn2afO4fwbvpYn0gxmmPXFQR4oQ5v", // Minecraft
];
minecrafts.forEach(minecraft => addMinecraft(minecraft));

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

function isMobileDisplay() {
    return window.innerWidth < 576; // Define your desired breakpoint for mobile display
}
