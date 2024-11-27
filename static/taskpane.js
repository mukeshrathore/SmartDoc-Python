/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    const consentDOMContainer = document.getElementById("consent-container");
    const consentCheckbox = document.getElementById("consent-checkbox");
    const dataDOMContainer = document.getElementById("manifestData-container");
    const errorMessage = document.getElementById("error-message");
    const attachmentDOMList = document.getElementById("attachments-list");
    const submitButton = document.getElementById("submit-button");
    const successMessage = document.getElementById("success-message");

    let manifestData = null;
    let attachmentNameList = [];

    // declare manifest data
    async function fetchManifestdata() {
      // step 1: fetch manifest from email
      manifestData = {
        sender: Office.context.mailbox.item.sender.emailAddress.toString(),
        to: Office.context.mailbox.item.to[0].emailAddress.toString(),
        subject: Office.context.mailbox.item.subject.toString(),
        conversationId: Office.context.mailbox.item.conversationId.toString(),
        itemId: Office.context.mailbox.item.itemId.toString(),
        timeStamp: Office.context.mailbox.item.dateTimeCreated.getTime().toString()
      };

      document.getElementById("manifestData-sender").textContent = manifestData.sender;
      document.getElementById("manifestData-to").textContent = manifestData.to;
      document.getElementById("manifestData-subject").textContent = manifestData.subject;
      document.getElementById("manifestData-conversation-id").textContent = manifestData.conversationId;
      document.getElementById("manifestData-item-id").textContent = manifestData.itemId;
      document.getElementById("manifestData-timestamp").textContent = manifestData.timeStamp;

      return manifestData;
    }

    // Call fetchManifestdata function
    fetchManifestdata();

    // declare fetch attachments function
    async function fetchAttachmentNames() {
      // step 3: fetch attachments from email
      Office.context.mailbox.item.attachments.forEach(async (attachment) => {
        attachmentNameList.push(attachment.name);
      });

      // step 6: display attachments from email      
      attachmentDOMList.innerHTML = "";
      attachmentNameList.forEach((attachmentName) => {
        const li = document.createElement("li");
        li.textContent = attachmentName;
        attachmentDOMList.appendChild(li);
      });

      return attachmentNameList;
    }

    // Call fetchAttachments function
    fetchAttachmentNames();

    consentCheckbox.addEventListener("change", (event) => {
      // Enable submit button + display manifest and attachments on click of checkbox only if attachments are present
      if (attachmentDOMList.childElementCount) {
        submitButton.disabled = !event.target.checked;
        dataDOMContainer.style.display = "block";
      } else {
        errorMessage.style.display = "block";
      }
    }); // end of consentCheckbox.addEventListener

    submitButton.addEventListener("click", async () => {
      downloadAttachments();
    }); // end of submitButton.addEventListener

    async function downloadAttachments() {
      const attachments = Office.context.mailbox.item.attachments;
      const attachmentPromises = attachments.map((attachment) => {
        return new Promise((resolve, reject) => {
          const attachmentId = attachment.id;
          Office.context.mailbox.item.getAttachmentContentAsync(attachmentId, (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
              const content = result.value.content;
              const contentType = result.value.format === Office.MailboxEnums.AttachmentContentFormat.Base64 ? 'application/octet-stream' : attachment.contentType;

              let blob;
              if (result.value.format === Office.MailboxEnums.AttachmentContentFormat.Base64) {
                const byteCharacters = atob(content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                blob = new Blob([byteArray], { type: contentType });
              } else {
                blob = new Blob([content], { type: contentType });
              }

              const reader = new FileReader();
              reader.onload = function () {
                const base64data = reader.result.split(',')[1];
                resolve({
                  name: attachment.name,
                  content: base64data
                });
              };
              reader.readAsDataURL(blob);
            } else {
              reject("Error fetching attachment content");
            }
          });
        });
      });

      await sendEmailData(attachmentPromises);

    } // end of function downloadAttachments

    async function sendEmailData(attachmentPromises) {
      try {
        manifestData.attachmentNames = attachmentNameList;
        const attachmentContentList = await Promise.all(attachmentPromises);
        fetch('/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            manifestData,
            attachments: attachmentContentList
          })
        }).then(response => {
          if (response.ok) {
            // display success message
            successMessage.style.display = "block";

            // hiding the submit button and consent container
            submitButton.style.display = "none";
            consentDOMContainer.style.display = "none";

            // log response
            response.text().then(text => {
              console.log(text);
            });

          } else {
            console.error('Failed to submit data');
          }
        });
      } catch (error) {
        console.error(error);
      }

    } // end of function sendEmailData

  } // end of if (info.host === Office.HostType.Outlook)

}); // end of Office.onReady