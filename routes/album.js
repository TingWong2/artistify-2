const express = require("express");
const router = new express.Router();
const AlbumModel = require("./../model/Album");
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
const uploader = require("./../config/cloudinary");

// router.use(protectAdminRoute);

// GET - all albums
router.get("/", async (req, res, next) => {
  try {
    res.render("dashboard/albums", {
      albums: await AlbumModel.find().populate("artist label"),
    });
  } catch (err) {
    next(err);
  }
});

// GET - create one album (form)
router.get("/create", async (req, res, next) => {
  const artists = await ArtistModel.find();
  const labels = await LabelModel.find();
  console.log("artist :", artists, "labels :", labels);
  res.render("dashboard/albumCreate", { artists, labels });
});

// GET - update one album (form)
router.get("/update/:id", uploader.single('cover'), async (req, res, next) => {
  try {
    const album = await AlbumModel.findById(req.params.id)
    console.log(album)
    res.render("dashboard/albumUpdate", {
      album,
      artists: await ArtistModel.find(),
      labels: await LabelModel.find(),
    });
  } catch (err) {
    next(err);
  }
});
// POST -update one album (redirection)
router.post("/:id", uploader.single('cover'), async (req, res, next)=> {
  const newAlbum = {...req.body};
  if (!req.file) delete newAlbum.cover;
  else newAlbum.cover = req.file.path;
  console.log("@@@newalbum", newAlbum);
  try {
    await AlbumModel.findByIdAndUpdate(req.params.id, newAlbum)
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
});

// GET - delete one album
router.get("/delete/:id", async (req, res, next) => {
  try {
    await AlbumModel.findByIdAndRemove(req.params.id);
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
});

// POST - create one album
router.post("/", uploader.single("cover"), async (req, res, next) => {
  const newAlbum = { ...req.body };
  if (!req.file) newAlbum.cover = undefined;
  else newAlbum.cover = req.file.path;
  console.log(newAlbum);
  try {
    await AlbumModel.create(newAlbum);
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
});

// POST - update one album

module.exports = router;
