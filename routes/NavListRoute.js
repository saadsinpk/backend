const express = require("express");
const { MainList, SubList } = require("../Modelss/NavList"); // Import your schemas
const router = express.Router();
const multer = require("multer");
  const fs = require("fs");
  
  const { uploadFile } = require('../s3')
  
// Main List Routes

// Get all main lists
router.get("/api/mainlists", async (req, res) => {
  try {
    const mainLists = await MainList.find({});
    res.status(200).json(mainLists);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching main lists" });
  }
});

// Create a new main list
router.post("/api/mainlists", async (req, res) => {
  try {
    const newMainList = new MainList(req.body);
    const savedMainList = await newMainList.save();
    res.status(201).json(savedMainList);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating a main list" });
  }
});

// Update a specific main list by ID
router.put("/api/mainlists/:mainListId", async (req, res) => {
  try {
    const mainList = await MainList.findByIdAndUpdate(req.params.mainListId, req.body, { new: true });
    if (!mainList) {
      return res.status(404).json({ message: "Main list not found" });
    }
    res.status(200).json(mainList);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the main list" });
  }
});

// Delete a specific main list by ID
router.delete("/api/mainlists/:mainListId", async (req, res) => {
  try {
    const deletedMainList = await MainList.findByIdAndDelete(req.params.mainListId);
    if (!deletedMainList) {
      return res.status(404).json({ message: "Main list not found" });
    }
    res.status(200).json({ message: "Main list deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the main list" });
  }
});

// Sub List Routes

// Add a sub-list to a main list
router.post("/api/mainlists/:mainListId/sublists", async (req, res) => {
  try {
    const { mainListId } = req.params;

    const mainList = await MainList.findById(mainListId);
    if (!mainList) {
      return res.status(404).json({ message: "Main list not found" });
    }

    // Create a new sub-list
    const newSubList = new SubList({ title: req.body.title });
    mainList.subLists.push(newSubList);

    // Save the changes
    const savedMainList = await mainList.save();
    res.status(201).json(savedMainList);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding the sub-list" });
  }
});

// Get all sub-lists within a main list
router.get("/api/mainlists/:mainListId/sublists", async (req, res) => {
  try {
    const { mainListId } = req.params;

    const mainList = await MainList.findById(mainListId);
    if (!mainList) {
      return res.status(404).json({ message: "Main list not found" });
    }

    const subLists = mainList.subLists;
    res.status(200).json(subLists);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching sub-lists" });
  }
});

// Update a sub-list within a main list
router.put("/api/mainlists/:mainListId/sublists/:subListId", async (req, res) => {
  try {
    const { mainListId, subListId } = req.params;

    const mainList = await MainList.findById(mainListId);
    if (!mainList) {
      return res.status(404).json({ message: "Main list not found" });
    }

    const subList = mainList.subLists.id(subListId);
    if (!subList) {
      return res.status(404).json({ message: "Sub list not found" });
    }

    // Update sub-list properties
    subList.title = req.body.title;

    // Save the changes
    const savedMainList = await mainList.save();
    res.status(200).json(savedMainList);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the sub-list" });
  }
});

// Delete a sub-list within a main list
router.delete("/api/mainlists/:mainListId/sublists/:subListId", async (req, res) => {
  try {
    const { mainListId, subListId } = req.params;

    const mainList = await MainList.findById(mainListId);
    if (!mainList) {
      return res.status(404).json({ message: "Main list not found" });
    }

    const subList = mainList.subLists.id(subListId);
    if (!subList) {
      return res.status(404).json({ message: "Sub list not found" });
    }

    // Remove the sub-list
    subList.remove();

    // Save the changes
    const savedMainList = await mainList.save();
    res.status(200).json(savedMainList);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the sub-list" });
  }
});


// Get sub-list items within a specific sub-list in a main list
router.get("/mainlists/:mainListId/sublists/:subListId/items", async (req, res) => {
  try {
    const { mainListId, subListId } = req.params;

    const mainList = await MainList.findById(mainListId);
    if (!mainList) {
      return res.status(404).json({ message: "Main list not found" });
    }

    const subList = mainList.subLists.id(subListId);
    if (!subList) {
      return res.status(404).json({ message: "Sub list not found" });
    }

    res.status(200).json(subList.items);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the items" });
  }
});
  
  // Configure multer disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./uploads/profiles";
      fs.access(dir, (error) => {
        if (error) {
          fs.mkdir(dir, (error) => cb(error, dir));
        } else {
          cb(null, dir);
        }
      });
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + file.originalname;
      req.body.pic = "uploads/profiles/" + fileName;
      cb(null, fileName);
    },
  });
  
  const upload = multer({ storage: storage });
  
  
  // Create sub-list item
  router.post("/mainlists/:mainListId/sublists/:subListId/items", upload.single("image"), async (req, res) => {
    try {
      const { mainListId, subListId } = req.params;
      const { title, description } = req.body;
      const imageUrl = await uploadFile(req.file)
  
      const mainList = await MainList.findById(mainListId);
      if (!mainList) {
        return res.status(404).json({ message: "Main list not found" });
      }
  
      const subList = mainList.subLists.id(subListId);
      if (!subList) {
        return res.status(404).json({ message: "Sub list not found" });
      }
  
      subList.items.push({ title, image: imageUrl, description });
      await mainList.save();
  
      res.status(201).json(subList.items[subList.items.length - 1]);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while adding the item" });
    }
  });
  // Update sub-list item
  router.put("/mainlists/:mainListId/sublists/:subListId/items/:itemId", upload.single("image"), async (req, res) => {
    try {
      const { mainListId, subListId, itemId } = req.params;
      const { title, description } = req.body;
      const imageUrl = await uploadFile(req.file)
  
      const mainList = await MainList.findById(mainListId);
      if (!mainList) {
        return res.status(404).json({ message: "Main list not found" });
      }
  
      const subList = mainList.subLists.id(subListId);
      if (!subList) {
        return res.status(404).json({ message: "Sub list not found" });
      }
  
      const item = subList.items.id(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      item.title = title;
      item.description = description;
      if (imageUrl) {
        item.image = imageUrl;
      }
  
    const main =  await mainList.save();
      res.status(200).json({
        success: true,
       result: main,
     });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the item" });
    }
  });
  
  // Delete sub-list item
  router.delete("/mainlists/:mainListId/sublists/:subListId/items/:itemId", async (req, res) => {
    try {
      const { mainListId, subListId, itemId } = req.params;
  
      const mainList = await MainList.findById(mainListId);
      if (!mainList) {
        return res.status(404).json({ message: "Main list not found" });
      }
  
      const subList = mainList.subLists.id(subListId);
      if (!subList) {
        return res.status(404).json({ message: "Sub list not found" });
      }
  
      subList.items.id(itemId).remove();
      await mainList.save();
  
      res.status(204).send(); // No content response
    } catch (error) {
      res.status(500).json({ error: "An error occurred while deleting the item" });
    }
  });
  
module.exports = router;
