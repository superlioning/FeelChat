jest.mock("mongoose"); // Mock mongoose before importing dbConnect

const mongoose = require("mongoose");
const { dbConnect, connection } = require("../utils/dbConnect");

describe("dbConnect", () => {
  let isConnectedBackup;

  beforeEach(() => {
    // Backup isConnected variable
    isConnectedBackup = connection.isConnected;
    // Reset isConnected before each test
    connection.isConnected = false;

    // Clear mocks
    jest.clearAllMocks();

    // Mock console methods to prevent actual logging
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore isConnected variable
    connection.isConnected = isConnectedBackup;

    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  it("should not connect if already connected", async () => {
    connection.isConnected = true;
    await dbConnect();
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it("should connect if not connected", async () => {
    connection.isConnected = false;
    mongoose.connect.mockResolvedValue({
      connections: [{ readyState: 1 }],
    });

    await dbConnect();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(connection.isConnected).toBe(true);
  });

  it("should handle connection errors", async () => {
    connection.isConnected = false;
    mongoose.connect.mockRejectedValue(new Error("Connection error"));

    await dbConnect();

    expect(console.error).toHaveBeenCalledWith(
      "Error connecting to MongoDB",
      expect.any(Error)
    );
  });
});
