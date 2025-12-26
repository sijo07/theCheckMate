const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    if (res && res.status) {
      res.status(500).json({ message: error.message });
    } else {
      console.error("Async Error (No Response Context):", error.message);
    }
  });
};

export default asyncHandler;
