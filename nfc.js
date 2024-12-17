document.getElementById("scanButton").addEventListener("click", async () => {
    const output = document.getElementById("output");
    output.textContent = ""; // Clear previous messages
  
    // Check if NFC is supported in the browser
    if (!("NDEFReader" in window)) {
      output.textContent = "NFC is not supported by your browser.";
      output.className = "status error";
      return;
    }
  
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      output.textContent = "Hold your NFC tag near the device...";
      ndef.onreading = (event) => {
        const message = event.message.records[0];
        if (message.recordType === "text") {
          const decoder = new TextDecoder();
          const tagData = decoder.decode(message.data);
  
          // Verify tag status
          if (tagData === "00000000000080800000") {
            output.textContent = "Tampered Tag Detected!";
            output.className = "status error";
          } else if (
            tagData === "00000000000080000000" ||
            tagData === "00000000000000000000"
          ) {
            output.textContent = "Non-Tampered Tag Detected!";
            output.className = "status success";
          } else {
            output.textContent = "Unknown Tag!";
            output.className = "status error";
          }
        } else {
          output.textContent = "Unsupported tag type!";
          output.className = "status error";
        }
      };
    } catch (error) {
      output.textContent = `Error: ${error.message}`;
      output.className = "status error";
    }
  });
  