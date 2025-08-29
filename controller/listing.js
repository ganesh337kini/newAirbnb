const listing = require("../models/listing.js");
const multer  = require('multer')
module.exports.showalllistings = async (req, res) => {
  const alllistings = await listing.find({});
  res.render("index.ejs", { alllistings });
};

module.exports.renderlist = async (req, res) => {
  res.render("new.ejs");
};

module.exports.newlist = async (req, res, next) => {
  try {
    const newlist = new listing(req.body.listing);
    newlist.owner = req.user._id;

    // Image from multer
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      newlist.image = { url, filename };
    }
    await newlist.save();
    req.flash("success", "New listing added successfully");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error in newlist controller:", err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings/new");
  }
};

module.exports.editlist = async (req, res) => {
  const { id } = req.params;
  const list = await listing.findById(id);
  if (!list) {
    req.flash("error", "The requested listing doesn't exist");
    return res.redirect("/listings");
  }
  const resizedImage = list.image.url.replace('/upload', '/upload/h_200,w_250');
  res.render("edit.ejs", { list, originalurl: resizedImage });
};

module.exports.showlistings = async (req, res) => {
  const { id } = req.params;
  const list = await listing.findById(id).populate({
    path: "review",
    populate: {
      path: "author"
    }
  }).populate("owner");

  if (!list) {
    req.flash("error", "The requested listing doesn't exist");
    return res.redirect("/listings");
  }

  res.render("show.ejs", { list });
};

module.exports.updatelist = async (req, res) => {
  const { id } = req.params;
  const list = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    list.image = { url, filename };
    await list.save();
  }

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroylist = async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
