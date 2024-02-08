const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    // Specify the destination folder where files will be saved
    cb(null, "/path/to/your/upload/folder");
  },
  filename: function (
    req: Request,
    file: { originalname: any },
    cb: (arg0: null, arg1: string) => void
  ) {
    // Customize the filename here
    const originalName = file.originalname; // Original filename
    const timestamp = Date.now(); // Current timestamp
    const uniqueId = Math.random().toString(36).substring(7); // Generate a unique ID

    // Construct the final filename
    const modifiedFilename = `${uniqueId}-${originalName}-${timestamp}.jpg`;

    cb(null, modifiedFilename);
  },
});

const upload = multer({ storage: storage });

// Use the 'upload' middleware in your route handler
// ...

// Example usage:
app.post("/upload", upload.single("myFile"), (req, res) => {
  // File has been uploaded with the customized filename
  res.send("File uploaded successfully!");
});
