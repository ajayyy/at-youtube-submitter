const textBox = document.getElementById("urls");
const submitterTextBox = document.getElementById("submitter");
const descriptionTextBox = document.getElementById("description");
const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async (event) => {
    if (submitButton.classList.contains('disabled')) return;

    let videoIDs = [];
    const urls = textBox.value.split(/\r?\n/g);
    const rejects = [];

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i].trim();
        if (url.length === 0) continue;

        const match = /^(?:(?:https?:\/\/)?(?:www\.)?(?:(?:(?:m\.)?youtube\..{2,6}|youtube-nocookie\.com)\/(?:watch\?(?:.+&)?v=|embed\/)|youtu\.be\/))?([a-zA-Z0-9_\-]{11})(?:$|\/|\?|&)/.exec(url);

        if (!match || !match[1]) {
            rejects.push(url);
            continue;
        }

        videoIDs.push(match[1]);
    }

    if (rejects.length > 0) {
        const msg = [`Please correct the following ${rejects.length} invalid line${rejects.length === 1 ? '' : 's'}:`];
        msg.push(...rejects.slice(0, 5));
        if (rejects.length > 5) msg.push(`(${rejects.length - 5} more)`);
        alert(msg.join('\n'));
        return;
    }

    let duplicateCount = 0;
    {
        const dupes = new Set();
        videoIDs = videoIDs.filter((id) => {
            const found = dupes.has(id);
            dupes.add(id);
            if (found) duplicateCount++;
            return !found;
        });
    }
    const duplicateMsg = duplicateCount === 0 ? '' : " (ignoring " + duplicateCount + " duplicates)"

    submitButton.classList.add('disabled');

    const status = document.getElementById("status");
    status.innerText = "0/" + videoIDs.length + duplicateMsg;
    
    
    for (let i = 0; i < videoIDs.length; i++) {
        await fetch("https://sponsor.ajay.app/api/unlistedVideo", {
            method: "POST",
            body: JSON.stringify({
                videoID: videoIDs[i]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch((err) => {
            alert("Submission failed: \n\n" + err);
        });
        
        status.innerText = (i + 1) + "/" + videoIDs.length + duplicateMsg;
    }
    
    submitButton.classList.remove('disabled');
    status.innerText = "Done!";
    
    textBox.value = "";
});
