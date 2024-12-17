document.getElementById("scanButton").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.textContent = ""; // Clear previous messages

  // Check if NFC is supported in the browser
  if (!("NDEFReader" in window)) {
    output.textContent = "NFC is not supported by your browser or device.";
    output.className = "status error";
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    output.textContent = "Hold your NFC tag near the device...";
    output.className = "status info";

    ndef.onreading = (event) => {
      console.log("NFC Tag Event:", event);

      // Check for raw serial number
      const serialNumber = event.serialNumber;
      console.log("Tag Serial Number:", serialNumber);

      if (serialNumber) {
        // Check the tag serial number if no NDEF message
        if (serialNumber === "00000000000080800000") {
          output.textContent = "Tampered Tag Detected (Serial Number Match)!";
          output.className = "status error";
        } else if (
          serialNumber === "00000000000080000000" ||
          serialNumber === "00000000000000000000"
        ) {
          output.textContent = "Non-Tampered Tag Detected (Serial Number Match)!";
          output.className = "status success";
        } else {
          output.textContent = "Unknown Tag Serial Number!";
          output.className = "status error";
        }
        return;
      }

      // Decode NDEF message if available
      const message = event.message.records[0];
      if (message.recordType === "text") {
        const decoder = new TextDecoder();
        const tagData = decoder.decode(message.data);
        console.log("Decoded Tag Data:", tagData);

        // Check the loop codes in NDEF data
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
        output.textContent = "Unsupported tag type!";
        output.className = "status error";
      }
    };
  } catch (error) {
    console.error("Error during NFC scan:", error);
    output.textContent = `Error: ${error.message}`;
    output.className = "status error";
  }
});
