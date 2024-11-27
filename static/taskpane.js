/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    const consentCheckbox = document.getElementById("consent-checkbox");
    const manifestDataContainer = document.getElementById("manifestData-container");
    const errorMessage = document.getElementById("error-message");
    const attachmentsList = document.getElementById("attachments-list");
    const submitButton = document.getElementById("submit-button");
    const successMessage = document.getElementById("success-message");

    let manifestData = null;
    let attachments = [];

    // Mock Metadata Fetch Function
    async function fetchManifestdata() {
      // step 1: fetch manifest from email
      return {
        sender: Office.context.mailbox.item.sender.emailAddress.toString(),
        to: Office.context.mailbox.item.to[0].emailAddress.toString(),
        subject: Office.context.mailbox.item.subject.toString(),
        conversationId: Office.context.mailbox.item.conversationId.toString(),
        itemId: Office.context.mailbox.item.itemId.toString(),
        timeStamp: Office.context.mailbox.item.dateTimeCreated.getTime().toString()
      };
    }

    // Call functions from script.js
    fetchManifestdata().then(manifestData => {
      // step 2: print manifest from email
      displayMetadata(manifestData);
    });

    // Mock Attachments Fetch Function
    async function fetchAttachments() {
      // step 3: fetch attachments from email
      const names = [];
      // fetching attachments names from email
      Office.context.mailbox.item.attachments.forEach(async (attachment) => {
        names.push({
          id: attachment.id,
          name: attachment.name,
        });
      });
      return names;
    }

    fetchAttachments().then(attachments => {
      // step 4: print attachments from email
      displayAttachments(attachments);
    });

    consentCheckbox.addEventListener("change", (event) => {
      // Enable submit button + display manifest and attachments on click of checkbox only if attachments are present
      if (attachmentsList.childElementCount) {
        submitButton.disabled = !event.target.checked;
        manifestDataContainer.style.display = "block";
      } else {
        errorMessage.style.display = "block";
      }
    });

    submitButton.addEventListener("click", async () => {
      downloadAttachments(attachments);
      downloadMetadata(manifestData);
      successMessage.style.display = "block";
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: 'metadata',
          attachments: 'attachments'
        })
      });

      if (response.ok) {
        successMessage.style.display = "block";
        console.log('Successfully submitted data');
      } else {
        console.error('Failed to submit data');
      }

    });

    function displayMetadata(manifestData) {
      // step 5: display manifest from email      
      document.getElementById("manifestData-sender").textContent = manifestData.sender;
      document.getElementById("manifestData-to").textContent = manifestData.to;
      document.getElementById("manifestData-subject").textContent = manifestData.subject;
      document.getElementById("manifestData-conversation-id").textContent = manifestData.conversationId;
      document.getElementById("manifestData-item-id").textContent = manifestData.itemId;
      document.getElementById("manifestData-timestamp").textContent = manifestData.timeStamp;
    }

    function displayAttachments(attachments) {
      // step 6: display attachments from email      
      attachmentsList.innerHTML = "";
      attachments.forEach((attachment) => {
        const li = document.createElement("li");
        li.textContent = attachment.name;
        attachmentsList.appendChild(li);
      });
    }

    function downloadAttachments() {
      Office.context.mailbox.item.attachments.forEach(async (attachment) => {
        const attachmentId = attachment.id;
        Office?.context?.mailbox?.item?.getAttachmentContentAsync(attachmentId, (result) => {
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

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = attachment.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // setIsSubmissionInitiated(true);
          } else {
            // setIsSubmissionInitiated(false);
            console.error("Error fetching attachment content", result.error);
          }
        });
      });
    }

    function downloadMetadata(manifestData) {
      const jsonString = JSON.stringify(manifestData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "manifest.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }
  }
});