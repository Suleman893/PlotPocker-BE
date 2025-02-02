const router = require("express").Router();
//controllers
const episodeController = require("../controllers/episode.controller");
//middlewares
const { verifyToken, verifyRole } = require("../middlewares/auth.middleware");
const { upload } = require("../services/helpers/fileHelper");
const payloadValidator = require("../middlewares/payloadValidator");

//[ADMIN] Add episodes in series
router.post(
  "/admin/add/:id",
  verifyToken,
  verifyRole(["Admin"]),
  upload.single("episode"),
  payloadValidator.validateAddEpisode,
  episodeController.addEpisode
);

//[APP] Rate the episode on episode view screen
router.post(
  "/app/rate/:id",
  verifyToken,
  verifyRole(["User"]),
  episodeController.rateTheEpisode
);

//[ADMIN] Series episodes
router.get(
  "/admin/series-episodes/:id",
  verifyToken,
  verifyRole(["Admin"]),
  episodeController.episodesOfSeries
);

//[APP] All episode of series in List Box
router.get(
  "/app/all/:id",
  verifyToken,
  verifyRole(["User", "Guest"]),
  episodeController.allEpisodeOfSeries
);

//[ADMIN] Delete episode based on series
router.delete(
  "/admin/:id",
  verifyToken,
  verifyRole(["Admin"]),
  episodeController.deleteEpisode
);

//[ADMIN] Edit episode
router.put(
  "/admin/:id",
  verifyToken,
  verifyRole(["Admin"]),
  upload.single("episode"),
  episodeController.updateEpisode
);

//[APP] View Episode Next/Prev or Current
router.get(
  "/app/view/:id",
  verifyToken,
  verifyRole(["Guest", "User"]),
  episodeController.viewEpisode
);

//[APP] For you episodes/reels
router.get(
  "/app/for-you",
  verifyToken,
  verifyRole(["User", "Guest"]),
  episodeController.episodesForYou
);

module.exports = router;
