document.getElementById("scanButton").addEventListener("click", async () => {
    const output = document.getElementById("output");
    output.textContent = ""; // Clear previous messages
  
    // Check if Web NFC API is supported in the browser
    if (!("NDEFReader" in window)) {
      output.textContent = "NFC is not supported by your browser or device.";
      output.className = "status error";
      return;
    }
  
    try {
      const ndef = new NDEFReader();
      await ndef.scan();  // Start NFC scan
      output.textContent = "Hold your NFC tag near the device...";
      output.className = "status info";
  
      ndef.onreading = (event) => {
        console.log("NFC Tag Event:", event);  // Debugging log
  
        // Try to read the tag's NDEF message
        const message = event.message.records[0];
        console.log("NDEF Message Record:", message);  // Debugging log
  
        if (message && message.recordType === "text") {
          const decoder = new TextDecoder();
          const tagData = decoder.decode(message.data);
          console.log("Decoded Tag Data:", tagData);  // Debugging log
  
          // Check the tag's loop code or identifier
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
            output.textContent = "Unknown or Unsupported Tag Data!";
            output.className = "status error";
          }
        } else {
          output.textContent = "Unsupported tag type or data format!";
          output.className = "status error";
        }
      };
    } catch (error) {
      console.error("Error during NFC scan:", error);
      output.textContent = `Error: ${error.message}`;
      output.className = "status error";
    }
  });
  
