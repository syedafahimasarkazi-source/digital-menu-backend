exports.createMenuItem = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const image = req.file ? req.file.path : null;

    const menuItem = new MenuItem({
      name,
      price,
      category,
      image,
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating menu item",
      error: error.message,
    });
  }
};