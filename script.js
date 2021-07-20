const textBox = document.getElementById("urls");
const submitterTextBox = document.getElementById("submitter");
const descriptionTextBox = document.getElementById("description");
const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async (event) => {
    if (textBox.value.includes("/")) {
        alert("Please use the videoIDs instead of URLs");
        return;
    }
    
    const urls = textBox.value.split("\n");
    
    const status = document.getElementById("status");
    status.innerText = "0/" + urls.length;
    
    
    for (let i = 0; i < urls.length; i++) {
        await fetch("http://localhost/api/unlistedVideo", {
            method: "POST",
            body: JSON.stringify({
                videoID: urls[i]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch((err) => {
            alert("Submission failed: \n\n" + err);
        });
        
        status.innerText = (i + 1) + "/" + urls.length;
    }
    
    status.innerText = "Done!";
    
    textBox.value = "";
});