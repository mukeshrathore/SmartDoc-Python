// // script.js

// document.addEventListener("DOMContentLoaded", () => {
//     const consentCheckbox = document.getElementById("consent-checkbox");
//     const proceedButton = document.getElementById("proceed-button");
//     const metadataContainer = document.getElementById("metadata-container");
//     const instructions = document.getElementById("instructions");
//     const attachmentsList = document.getElementById("attachments-list");
//     const submitButton = document.getElementById("submit-button");
//     const successMessage = document.getElementById("success-message");

//     let metadata = null;
//     let attachments = [];

//     consentCheckbox.addEventListener("change", (event) => {
//         console.log('checkbox event change: ', event, event.target.checked);
//         proceedButton.disabled = !event.target.checked;
//     });

//     proceedButton.addEventListener("click", async () => {
//         metadata = await fetchMetadata(); // Mocking API call
//         attachments = await fetchAttachments(); // Mocking API call

//         if (!attachments || attachments.length === 0) {
//             instructions.style.display = "block";
//         } else {
//             instructions.style.display = "none";
//             displayMetadata(metadata);
//             displayAttachments(attachments);
//             submitButton.style.display = "inline-block";
//         }
//     });

//     submitButton.addEventListener("click", () => {
//         downloadAttachments(attachments);
//         downloadMetadata(metadata);
//         successMessage.style.display = "block";
//     });

//     // Mock Metadata Fetch Function
//     async function fetchMetadata() {
//         return {
//             sender: "example@domain.com",
//             to: "recipient@domain.com",
//             subject: "Test Subject",
//             conversationId: "12345",
//             itemId: "67890",
//             timeStamp: new Date().toISOString(),
//         };
//     }

//     // Mock Attachments Fetch Function
//     async function fetchAttachments() {
//         return [
//             { id: "1", name: "file1.txt" },
//             { id: "2", name: "file2.jpg" },
//         ];
//     }

//     function displayMetadata(metadata) {
//         metadataContainer.style.display = "block";
//         document.getElementById("metadata-sender").textContent = metadata.sender;
//         document.getElementById("metadata-to").textContent = metadata.to;
//         document.getElementById("metadata-subject").textContent = metadata.subject;
//         document.getElementById("metadata-conversation-id").textContent = metadata.conversationId;
//         document.getElementById("metadata-item-id").textContent = metadata.itemId;
//         document.getElementById("metadata-timestamp").textContent = metadata.timeStamp;
//     }

//     function displayAttachments(attachments) {
//         attachmentsList.style.display = "block";
//         attachmentsList.innerHTML = "";
//         attachments.forEach((attachment) => {
//             const li = document.createElement("li");
//             li.textContent = attachment.name;
//             attachmentsList.appendChild(li);
//         });
//     }

//     function downloadAttachments(attachments) {
//         attachments.forEach((attachment) => {
//             const blob = new Blob(["Attachment Content"], { type: "text/plain" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             link.download = attachment.name;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         });
//     }

//     function downloadMetadata(metadata) {
//         const jsonString = JSON.stringify(metadata, null, 2);
//         const blob = new Blob([jsonString], { type: "application/json" });
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = "metadata.json";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }

// });

// // Export functions
// export { fetchMetadata, fetchAttachments, displayMetadata, displayAttachments, downloadAttachments, downloadMetadata };