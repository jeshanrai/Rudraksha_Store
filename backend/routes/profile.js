router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
